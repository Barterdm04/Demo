namespace InSiteCommerce.Web
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.Http;
    using System.Web.Mvc;
    using System.Web.Optimization;
    using System.Web.Routing;
    using Insite.Account.Content;
    using Insite.Integration.WebService.Interfaces;
    using Insite.Integration.WindowsService.Broker;
    using Insite.Integration.WindowsService.Broker.Interfaces;
    using Insite.Integration.WindowsService.Broker.WebIntegrationService;
    using Insite.IocContainer.Unity;
    using InSite.Model.Core;
    using InSite.Model.Interfaces;
    using Insite.WebFramework.Routing;
    
    using Microsoft.Practices.ServiceLocation;
    using IntegrationConnection = InSite.Model.IntegrationConnection;

    public class MvcApplication : Insite.WebFramework.Mvc.MvcApplication
    {
        protected override void RegisterCustomRoutes(RouteCollection routes, IRouteProvider routeProvider)
        {
            // Add additional routes with this syntax
            // routeProvider.MapRoute(routes, null, "Test", new { Controller = "Test", Action = "Index" }, true);
        }

        /// <summary>
        /// Customs the application start.
        /// </summary>
        /// <param name="iocContainer">The ioc container.</param>
        /// <param name="unitOfWork">The unit of work.</param>
        protected override void CustomApplicationStart(UnityIocContainer iocContainer, IUnitOfWork unitOfWork)
        {
            GlobalConfiguration.Configure(c => WebApiConfig.Register(c, iocContainer.UnityContainer, unitOfWork));

            BundleConfig.RegisterBundles(BundleTable.Bundles);

            // Start web server Side Integration Processing, must be started in a separate thread because it calls back to webservices in the site
            var startupFolder = this.Server.MapPath(@"/");
            Task.Factory.StartNew(() => this.IntegrationStart(startupFolder));
        }

        /// <summary>
        /// If there is a SiteConnections.config file in the website root folder, start a server side <see cref="IWindowsIntegrationBroker"/>.
        /// If there is not a SiteConnections.config file in the website root folder, register all the <see cref="IIntegrationProcessor"/>s so
        /// that pass through jobs can still run.
        /// </summary>
        protected void IntegrationStart(string startupFolder)
        {
            var windowsIntegrationBroker = ServiceLocator.Current.GetInstance<IWindowsIntegrationBroker>();

            if (File.Exists(Path.Combine(startupFolder, "SiteConnections.config")))
            {
                windowsIntegrationBroker.IntegrationStart(startupFolder);
            }
            else
            {
                this.RegisterWindowIntegrationServicePlugins(startupFolder, windowsIntegrationBroker);
            }
        }

        private void RegisterWindowIntegrationServicePlugins(string startupFolder, IWindowsIntegrationBroker windowsIntegrationBroker)
        {
            var siteConnections = ServiceLocator.Current.GetInstance<IUnitOfWork>().GetRepository<IntegrationConnection>().GetTable()
                .Select(c => new SiteConnection { IntegrationConnectionName = c.Name, DllFolder = c.Name, IsActive = true }).ToList();

            if (siteConnections.Any())
            {
                var webServiceHandler = ServiceLocator.Current.GetInstance<IWebServiceHandler>();

                var windowsIntegrationServiceDtos = windowsIntegrationBroker.IntegrationStart(startupFolder, siteConnections, false);

                foreach (var siteConnection in siteConnections)
                {
                    var windowsIntegrationServiceDto = windowsIntegrationServiceDtos.FirstOrDefault(w => w.ConnectionName.EqualsIgnoreCase(siteConnection.IntegrationConnectionName));
                    var webSideDto = DataContractTypeConverter.ConvertType<WindowsIntegrationServiceDto, Insite.Integration.WebService.Dtos.WindowsIntegrationServiceDto>(windowsIntegrationServiceDto);
                    webServiceHandler.RegisterPlugins(webSideDto, false);
                }
            }
        }

        protected override void Application_End(object sender, EventArgs e)
        {
            base.Application_End(sender, e);

            var windowsIntegrationBroker = ServiceLocator.Current.GetInstance<IWindowsIntegrationBroker>();
            windowsIntegrationBroker.IntegrationStop();
        }

        protected override void Application_EndRequest()
        {
            base.Application_EndRequest();

            var context = new HttpContextWrapper(this.Context);
            // If we're an ajax request, and doing a 302 to the /MyAccount/Login action, then we actually need to do a 401 so that our js can redirect to the login properly
            if (this.Context.Response.StatusCode == 302 && context.Request.IsAjaxRequest())
            {
                var urlProvider = ServiceLocator.Current.GetInstance<IUrlProvider>();
                if (context.Response.RedirectLocation.ToLower().Contains(urlProvider.GetUrl<SignInPage>().ToLower()))
                {
                    this.Context.Response.Clear();
                    this.Context.Response.StatusCode = 401;
                }
            }
        }
    }
}