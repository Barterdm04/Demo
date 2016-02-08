using System.Net.Http;
using System.Threading.Tasks;
using Insite.Core.Services;
using InSite.Model.Core;
using InSite.Model.Interfaces;
using InSite.Model.Interfaces.Dependency;
using InSiteCommerce.Web.NEBCustomizations.Interfaces;
using InSiteCommerce.Web.NEBCustomizations.UserExchange.Interfaces;
using InSiteCommerce.Web.NEBCustomizations.UserExchange.Models;

namespace InSiteCommerce.Web.NEBCustomizations.UserExchange.Services
{
    public class UserExchangeService : ServiceBase, IUserExchangeService, IInterceptable, IDependency
    {
        private readonly IUserExchangeRepository repository;

        public UserExchangeService(IUnitOfWorkFactory unitOfWorkFactory, IContextProvider contextProvider, ITranslationLocalizer translationLocalizer,
            IUserExchangeRepository repository)
            :base(unitOfWorkFactory, contextProvider, translationLocalizer)
        {
            this.repository = repository;
        }

        public async Task<UserExchangeResult> GetUsers(UserExchangeRequest request, CurrentContext currentContext, HttpRequestMessage httpRequest)
        {
           
            var result = await Task.FromResult<UserExchangeResult>(
                repository.GetUsers(request, currentContext, httpRequest));

            return result;
        }
    }
}

