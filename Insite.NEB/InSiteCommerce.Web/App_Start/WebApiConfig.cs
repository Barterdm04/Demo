// --------------------------------------------------------------------------------------------------------------------
// <copyright file="WebApiConfig.cs" company="Insite Software">
//   Copyright © 2015. Insite Software. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace InSiteCommerce.Web
{
    using System;
    using System.Configuration;
    using System.Linq;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Web.Http;
    using System.Web.Http.Cors;
    using System.Web.Http.ExceptionHandling;

    using CacheCow.Server;
    using CacheCow.Server.EntityTagStore.SqlServer;

    using Insite.Core.WebApi;

    using InSite.Model.Interfaces;
    using InSite.Model.Interfaces.Repositories;

    using Microsoft.Owin.Security.OAuth;
    using Microsoft.Practices.Unity;

    using Newtonsoft.Json.Serialization;

    using Unity.WebApi;

    /// <summary>
    /// WebApi Configuration class.
    /// </summary>
    public static class WebApiConfig
    {
        /// <summary>The web api server cache timeout.</summary>
        private static int etagCacheServerDuration = 5;

        /// <summary>The web api client cache timeout.</summary>
        private static int etagCacheClientDuration = 5;

        /// <summary>Registers the specified configuration.</summary>
        /// <param name="config">The configuration.</param>
        /// <param name="unityContainer">The unity container.</param>
        /// <param name="unitOfWork">The unit of work.</param>
        public static void Register(HttpConfiguration config, IUnityContainer unityContainer, IUnitOfWork unitOfWork)
        {
            var applicationSettingRepository = unitOfWork.GetTypedRepository<IApplicationSettingRepository>();

            etagCacheServerDuration = applicationSettingRepository.GetOrCreateByName<int>("EtagCacheServerDuration");
            etagCacheClientDuration = applicationSettingRepository.GetOrCreateByName<int>("EtagCacheClientDuration");

#if !DEBUG

    // Configure Web API to use only bearer token authentication.
    // Only suppress if not in debug mode, this allows browsing the WebAPI if in debug mode.
            config.SuppressDefaultHostAuthentication();
#endif

            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));
            config.Filters.Add(new ModelStateValidationFilter());
            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            config.Formatters.JsonFormatter.SerializerSettings.Converters.Add(new SelectSupportConverter());

            var browserFormatter = new BrowserJsonFormatter
            {
                SerializerSettings =
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                }
            };

            browserFormatter.SerializerSettings.Converters.Add(new SelectSupportConverter());

            config.Formatters.Add(browserFormatter);

            config.DependencyResolver = new UnityDependencyResolver(unityContainer);

            // Changing this setting requires a website restart
            if (applicationSettingRepository.GetOrCreateByName<bool>("Caching_EnableEtags"))
            {
                var etagStore = new SqlServerEntityTagStore(ConfigurationManager.ConnectionStrings["InSite.Commerce"].ConnectionString);

                // The vary by in the constructor needs to be something that is unique per user so it generates ETags uniquely per user
                // Cookie contains a cookie we generate InsiteCacheId that is a guid per user.
                var cacheHandler = new CachingHandler(config, etagStore, "Cookie")
                {
                    // This must be false so IE client side caching works, anything that needs to vary needs to be done by uri or querystring
                    AddVaryHeader = false,
                    AddLastModifiedHeader = true,
                    RoutePatternProvider = new CacheRoutePatternProvider(),
                    CacheControlHeaderProvider = CacheControlHeaderProvider,
                    CacheRefreshPolicyProvider = CacheRefreshPolicyProvider
                };
                config.MessageHandlers.Add(cacheHandler);
            }

            config.MessageHandlers.Add(new LocalizationHandler());
            config.MapHttpAttributeRoutes(new InheritanceDirectRouteProvider());

            // There can be multiple exception loggers. (By default, no exception loggers are registered.)
            config.Services.Add(typeof(IExceptionLogger), unityContainer.Resolve<IExceptionLogger>());

            // There must be exactly one exception handler. (There is a default one that may be replaced.)
            config.Services.Replace(typeof(IExceptionHandler), unityContainer.Resolve<IExceptionHandler>());
        }

        /// <summary>The cache control header provider.</summary>
        /// <param name="request">The request.</param>
        /// <param name="httpConfiguration">The http configuration.</param>
        /// <returns>The <see cref="CacheControlHeaderValue"/>.</returns>
        private static CacheControlHeaderValue CacheControlHeaderProvider(HttpRequestMessage request, HttpConfiguration httpConfiguration)
        {
            var cacheServerSide = CacheResourceServerSide(request.RequestUri);
            var cacheClientSide = CacheResourceClientSide(request.RequestUri);

            if (!cacheServerSide && !cacheClientSide)
            {
                return null;
            }

            return new CacheControlHeaderValue
            {
                Private = true,

                // This has to be false for IE to cache the resource client side, other browsers don't seem to care
                MustRevalidate = !cacheClientSide,
                NoTransform = true,
                MaxAge = cacheClientSide
                    ? TimeSpan.FromMinutes(etagCacheClientDuration)
                    : TimeSpan.Zero
            };
        }

        /// <summary>The cache refresh policy provider.</summary>
        /// <param name="request">The request.</param>
        /// <param name="httpConfiguration">The http configuration.</param>
        /// <returns>The <see cref="TimeSpan"/>.</returns>
        private static TimeSpan CacheRefreshPolicyProvider(HttpRequestMessage request, HttpConfiguration httpConfiguration)
        {
            // Expire server side cache right away for things that are cached for a duration of time client side.
            // This forces the next request after the client side timeout to re-get and re-cache the resource client side with a new max-age
            // so that it stays cached client side, otherwise it doesn't re-set the modified since and max age.
            if (CacheResourceClientSide(request.RequestUri))
            {
                var cacheHandler = httpConfiguration.MessageHandlers.OfType<ICachingHandler>().FirstOrDefault();
                if (cacheHandler != null)
                {
                    cacheHandler.InvalidateResource(request);
                }

                return TimeSpan.FromMinutes(etagCacheClientDuration);
            }

            return TimeSpan.FromMinutes(etagCacheServerDuration);
        }

        /// <summary>Returns true if the supplied resource can be cached server side (using ETags).</summary>
        /// <param name="resourceUri">The resource uri.</param>
        /// <returns>True if the resource can be cached server side.</returns>
        private static bool CacheResourceServerSide(Uri resourceUri)
        {
            if (resourceUri == null || resourceUri.Segments.Length < 4)
            {
                return false;
            }

            var resource = resourceUri.Segments[3].TrimEnd('/');
            return !resource.EqualsIgnoreCase("budgetcalendars")
                && !resource.EqualsIgnoreCase("budgets")
                && !resource.EqualsIgnoreCase("dashboardpanels")
                && !resource.EqualsIgnoreCase("messages")
                && !resource.EqualsIgnoreCase("orderapprovals")
                && !resource.EqualsIgnoreCase("quotes")
                && !resource.EqualsIgnoreCase("requisitions")
                && !resource.EqualsIgnoreCase("autocomplete");
        }

        /// <summary>Returns true if the supplied resource can be cached client side (in the browser cache).</summary>
        /// <param name="resourceUri">The resource uri.</param>
        /// <returns>True if the resource can be cached client side.</returns>
        private static bool CacheResourceClientSide(Uri resourceUri)
        {
            if (resourceUri == null || resourceUri.Segments.Length < 4)
            {
                return false;
            }

            var resource = resourceUri.Segments[3].TrimEnd('/');

            // Do not cache website crosssells client side
            if (resource.EqualsIgnoreCase("websites")
                && resourceUri.Segments.Length >= 6
                && resourceUri.Segments[5].TrimEnd('/').EqualsIgnoreCase("crosssells"))
            {
                return false;
            }

            return resource.EqualsIgnoreCase("settings")
                || resource.EqualsIgnoreCase("websites");
        }
    }
}