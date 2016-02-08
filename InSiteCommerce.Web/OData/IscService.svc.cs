using System.Data.Services;
using System.Data.Services.Common;
using System.ServiceModel.Web;
using InSite.Model;
using InSite.Model.Interfaces;
using InSite.OData;
using Microsoft.Practices.ServiceLocation;

namespace InSiteCommerce.Web.OData
{
    using InSite.Model.Interfaces.Repositories;

    [System.ServiceModel.ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    public class IscService : DataService<UnsecureContext>
    {
        protected IUnitOfWork UnitOfWork;
        protected IContextProvider ContextProvider;
        protected IAuthenticationService AuthenticationService;

        // This method is called only once to initialize service-wide policies.
        public static void InitializeService(DataServiceConfiguration config)
        {
            config.SetEntitySetAccessRule("*", EntitySetRights.AllRead);
            config.SetServiceOperationAccessRule("*", ServiceOperationRights.All);
            config.SetEntitySetPageSize("*", 100);
            config.DataServiceBehavior.MaxProtocolVersion = DataServiceProtocolVersion.V3;
            config.DataServiceBehavior.AcceptProjectionRequests = true;
            config.UseVerboseErrors = true;
        }

        public IscService()
        {
            UnitOfWork = ServiceLocator.Current.GetInstance<IUnitOfWork>();
            ContextProvider = ServiceLocator.Current.GetInstance<IContextProvider>();
            AuthenticationService = ServiceLocator.Current.GetInstance<IAuthenticationService>();
        }

        [WebGet]
        public bool SignIn(string userName, string password)
        {
            var applicationName = ContextProvider.CurrentApplicationName;
            var validUser = AuthenticationService.ValidateUser(applicationName, userName, password);
            if (!validUser)
                return false;
            var userProfile = UnitOfWork.GetTypedRepository<IUserProfileRepository>().GetByNaturalKey(userName, applicationName);
            AuthenticationService.SetUserAsAuthenticated(applicationName, userProfile.UserName);
            return true;
        }

        [WebGet]
        public bool SignOut()
        {
            AuthenticationService.SignOut(ContextProvider.CurrentApplicationName);
            return true;
        }

        [WebGet]
        public bool IsSignedIn()
        {
            return UserProfile.Current != null;
        }
    }
}
