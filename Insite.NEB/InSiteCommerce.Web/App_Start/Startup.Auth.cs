// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Startup.Auth.cs" company="Insite Software">
//   Copyright © 2015. Insite Software. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace InSiteCommerce.Web
{
    using System;
    using System.Configuration;
    using System.IdentityModel.Claims;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Helpers;

    using InSite.Model.BootStrapper;

    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using Microsoft.AspNet.Identity.Owin;
    using Microsoft.Owin;
    using Microsoft.Owin.Cors;
    using Microsoft.Owin.Security.Cookies;

    using NHibernate.Linq;

    using Owin;

    using Thinktecture.IdentityServer.Core.Configuration;

    using Constants = Thinktecture.IdentityServer.Core.Constants;
    using CorsPolicy = System.Web.Cors.CorsPolicy;
    using Insite.Account.Content;
    using Insite.DataProvider.NHibernate;
    using Insite.IdentityServer;
    using Insite.IdentityServer.AspNetIdentity;
    using Insite.IdentityServer.Options;

    using InSite.Model.Interfaces.Repositories;
    using InSite.Model.Managers;
    using InSite.Model.Services;
    using InSite.Model.Services.Repositories;

    using Microsoft.Owin.Security.Facebook;
    using Microsoft.Owin.Security.Google;

    using NHibernate;

    using Thinktecture.IdentityServer.AccessTokenValidation;

    using IdentityDbContext = Insite.IdentityServer.AspNetIdentity.IdentityDbContext;

    /// <summary>
    /// Authorization Configuration part of OWIN Startup.
    /// </summary>
    public partial class Startup
    {
        /// <summary>
        /// Initializes static members of the <see cref="Startup" /> class.
        /// Initializes the <see cref="Startup" /> class.
        /// Enable the application to use OAuthAuthorization. You can then secure your Web APIs
        /// </summary>
        static Startup()
        {
            SecurityOptions.AuthenticationCookieLifetime = Convert.ToInt32(TimeSpan.FromMinutes(20).TotalSeconds);

            // server timeout will revoke access token
            SecurityOptions.AccessTokenLifetime = Convert.ToInt32(TimeSpan.FromHours(12).TotalSeconds);

            // TODO implement refresh tokens
            SecurityOptions.AbsoluteRefreshTokenLifetime = Convert.ToInt32(TimeSpan.FromHours(24).TotalSeconds);

            // TODO implement refresh tokens
            SecurityOptions.SlidingRefreshTokenLifetime = Convert.ToInt32(TimeSpan.FromHours(12).TotalSeconds);

            // Configure Identity Server
            SecurityOptions.IdentityServerOptions = new IdentityServerOptions
            {
                SiteName = "Insite Commerce - Identity Server",
                IssuerUri = ConfigurationManager.AppSettings["IdentityServerUrl"],
                // TODO: Consider enabling CSP but need to determine what settings we want and will likely need to refactor _MainLayout.cshtml
                CspOptions = new CspOptions { Enabled = false }, 
                SigningCertificate = Certificate.Get(),
                Factory = Factory.Configure(ConnectionStringProvider.Current.ConnectionStringName),
                CorsPolicy = Thinktecture.IdentityServer.Core.Configuration.CorsPolicy.AllowAll,
                AuthenticationOptions = new AuthenticationOptions
                {
                    IdentityProviders = ConfigureIdentityProviders
                },
#if DEBUG
                RequireSsl = false
#endif
            };

            // Configure Cookie Authentication options
            SecurityOptions.CookieOptions = new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/RedirectTo/" + typeof(SignInPage).Name),
                ExpireTimeSpan = TimeSpan.FromSeconds(SecurityOptions.AuthenticationCookieLifetime),
                Provider = new CookieAuthenticationProvider
                {
                    // Enables the application to validate the security stamp when the user logs in.
                    // This is a security feature which is used when you change a password or add an external login to your account.  
                    OnValidateIdentity = SecurityStampValidator.OnValidateIdentity<IdentityUserManager, IdentityUser>(
                        TimeSpan.FromSeconds(SecurityOptions.AuthenticationCookieLifetime),
                        (manager, user) => manager.CreateIdentityAsync(user, DefaultAuthenticationTypes.ApplicationCookie))
                }
            };

            // Configure validation logic for usernames
            SecurityOptions.UserValidatorOptions = new UserValidatorOptions
            {
                AllowOnlyAlphanumericUserNames = false, 
                RequireUniqueEmail = false
            };

            // Configure validation logic for passwords
            SecurityOptions.PasswordValidatorOptions = new PasswordValidatorOptions
            {
                RequiredLength = 7, 
                RequireNonLetterOrDigit = false, 
                RequireDigit = true, 
                RequireLowercase = false, 
                RequireUppercase = false
            };

            // Configure user lockout options
            SecurityOptions.LockoutOptions = new LockoutOptions
            {
                UserLockoutEnabledByDefault = true, 
                DefaultAccountLockoutTimeSpan = TimeSpan.FromMinutes(5), 
                MaxFailedAccessAttemptsBeforeLockout = 5
            };

            AntiForgeryConfig.UniqueClaimTypeIdentifier = ClaimTypes.Name;
        }

        /// <summary>Configures the authentication.
        /// For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864</summary>
        /// <param name="app">The app.</param>
        public void ConfigureAuth(IAppBuilder app)
        {
            // Changing this setting requires a website restart
            var corsOrigin = BootStrapper.GetApplicationSetting("Cors_Origin", string.Empty);
            if (!corsOrigin.IsBlank())
            {
                var policy = new CorsPolicy
                {
                    AllowAnyHeader = true, 
                    AllowAnyMethod = true, 
                    AllowAnyOrigin = corsOrigin.Equals("*"), 
                    SupportsCredentials = true
                };
                if (!policy.AllowAnyOrigin)
                {
                    corsOrigin.Split(',').ForEach(origin => policy.Origins.Add(origin.Trim()));
                }

                app.UseCors(new CorsOptions
                {
                    PolicyProvider = new CorsPolicyProvider
                    {
                        PolicyResolver = context => Task.FromResult(policy)
                    }
                });
            }

            app.CreatePerOwinContext(IdentityDbContext.Create);
            app.CreatePerOwinContext<IdentityUserManager>(IdentityUserManager.Create);
            app.CreatePerOwinContext<IdentitySignInManager>(IdentitySignInManager.Create);

            app.UseKentorOwinCookieSaver();

            app.UseIdentityServerBearerTokenAuthentication(new IdentityServerBearerTokenAuthenticationOptions
            {
                Authority = SecurityOptions.IdentityServerOptions.IssuerUri,
                RequiredScopes = new[] { SecurityOptions.Scope },
                NameClaimType = Constants.ClaimTypes.PreferredUserName,
                RoleClaimType = Constants.ClaimTypes.Role
            });


            app.UseCookieAuthentication(SecurityOptions.CookieOptions);

            // Use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            app.Map("/identity", identityApp => { identityApp.UseIdentityServer(SecurityOptions.IdentityServerOptions); });

            // Enables the application to temporarily store user information when they are verifying the second factor in the two-factor authentication process.
            // app.UseTwoFactorSignInCookie(DefaultAuthenticationTypes.TwoFactorCookie, TimeSpan.FromMinutes(5));

            // Enables the application to remember the second login verification factor such as phone or email.
            // Once you check this option, your second step of verification during the login process will be remembered on the device where you logged in from.
            // This is similar to the RememberMe option when you log in.
            // app.UseTwoFactorRememberBrowserCookie(DefaultAuthenticationTypes.TwoFactorRememberBrowserCookie);
        }

        private static void ConfigureIdentityProviders(IAppBuilder app, string signInAsType)
        {
            var dataProvider = new DataProviderNHibernate(new EmptyInterceptor(), new MemoryCacheManager(), new EmptyMappingInjector());
            var applicationSettingRepository = new ApplicationSettingRepository(dataProvider);

            ConfigureFacebookLogin(app, signInAsType, applicationSettingRepository);
            ConfigureGoogleLogin(app, signInAsType, applicationSettingRepository);
        }

        private static void ConfigureGoogleLogin(IAppBuilder app, string signInAsType, IApplicationSettingRepository applicationSettingRepository)
        {
            var googleEnabled = applicationSettingRepository.GetOrCreateByName<bool>("ExternalProvider_Google_Enabled");
            if (googleEnabled)
            {
                var googleClientId = applicationSettingRepository.GetOrCreateByName<string>("ExternalProvider_Google_ClientId");
                var googleClientSecret = applicationSettingRepository.GetOrCreateByName<string>("ExternalProvider_Google_ClientSecret"); 

                if (!string.IsNullOrWhiteSpace(googleClientId) && !string.IsNullOrWhiteSpace(googleClientSecret))
                {
                    app.UseGoogleAuthentication(new GoogleOAuth2AuthenticationOptions
                    {
                        Caption = "Google",
                        ClientId = googleClientId,
                        ClientSecret = googleClientSecret,
                        SignInAsAuthenticationType = signInAsType,
                        AuthenticationType = "Google"
                    });
                }
            }
        }

        private static void ConfigureFacebookLogin(IAppBuilder app, string signInAsType, IApplicationSettingRepository applicationSettingRepository)
        {
            var facebookEnabled = applicationSettingRepository.GetOrCreateByName<bool>("ExternalProvider_Facebook_Enabled");
            if (facebookEnabled)
            {
                var facebookAppId = applicationSettingRepository.GetOrCreateByName<string>("ExternalProvider_Facebook_AppId"); 
                var facebookAppSecret = applicationSettingRepository.GetOrCreateByName<string>("ExternalProvider_Facebook_AppSecret");

                if (!string.IsNullOrWhiteSpace(facebookAppId) && !string.IsNullOrWhiteSpace(facebookAppSecret))
                {
                    var facebookOptions = new FacebookAuthenticationOptions
                    {
                        AppId = facebookAppId,
                        AppSecret = facebookAppSecret,
                        Caption = "Facebook",
                        SignInAsAuthenticationType = signInAsType,
                        AuthenticationType = "Facebook",
                        Provider = new FacebookAuthenticationProvider
                        {
                            OnAuthenticated = async context =>
                                {
                                    foreach (var claim in context.User)
                                    {
                                        switch (claim.Key)
                                        {
                                            case "first_name":
                                                context.Identity.AddClaim(new System.Security.Claims.Claim(Constants.ClaimTypes.GivenName, claim.Value.ToString(), "XmlSchemaString", "Facebook"));
                                                break;
                                            case "last_name":
                                                context.Identity.AddClaim(new System.Security.Claims.Claim(Constants.ClaimTypes.FamilyName, claim.Value.ToString(), "XmlSchemaString", "Facebook"));
                                                break;
                                        }
                                    }

                                    await Task.FromResult(false);
                                }
                        },
                        BackchannelHttpHandler = new FacebookBackChannelHandler(),
                        UserInformationEndpoint = "https://graph.facebook.com/v2.5/me?fields=id,name,email,first_name,last_name"
                    };
                    facebookOptions.Scope.Add("email");
                    facebookOptions.Scope.Add("public_profile");
                    app.UseFacebookAuthentication(facebookOptions);
                }
            }
        }

        private class FacebookBackChannelHandler : HttpClientHandler
        {
            protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
            {
                // Replace the RequestUri so it's not malformed
                if (!request.RequestUri.AbsolutePath.Contains("/oauth"))
                {
                    request.RequestUri = new Uri(request.RequestUri.AbsoluteUri.Replace("?access_token", "&access_token"));
                }

                return await base.SendAsync(request, cancellationToken);
            }
        }
    }
}