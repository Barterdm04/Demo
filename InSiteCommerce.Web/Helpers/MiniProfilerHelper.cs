namespace InSiteCommerce.Web.Helpers
{
    using System;
    using System.Linq;

    using InSite.Model.Interfaces;
    using InSite.Model.Interfaces.Repositories;

    using Microsoft.Practices.ServiceLocation;

    using StackExchange.Profiling;

    public class MiniProfilerHelper
    {
        public static void StartIfConfigured()
        {
            if (UseMiniProfiler())
            {
                var ignoredPaths = MiniProfiler.Settings.IgnoredPaths.ToList();
                ignoredPaths.Add("/Images/");
                ignoredPaths.Add("/UserFiles/");
                ignoredPaths.Add("/Styles/");
                MiniProfiler.Settings.IgnoredPaths = ignoredPaths.ToArray();

                MiniProfiler.Start();
            }
        }

        public static void StopIfConfigured()
        {
            if (UseMiniProfiler())
            {
                MiniProfiler.Stop();
            }
        }

        private static bool UseMiniProfiler()
        {
            var cacheManager = ServiceLocator.Current.GetInstance<ICacheManager>();
            return cacheManager.Get("UseMiniProfiler", () =>
                {
                    var unitOfWork = ServiceLocator.Current.GetInstance<IUnitOfWork>();

                    return unitOfWork.GetTypedRepository<IApplicationSettingRepository>().GetOrCreateByName<bool>("MiniProfiler_Enabled");
                }, TimeSpan.FromMinutes(5));
        }
    }
}