using System.Net.Http;
using System.Threading.Tasks;
using InSite.Model.Core;
using InSiteCommerce.Web.NEBCustomizations.UserExchange.Models;

namespace InSiteCommerce.Web.NEBCustomizations.UserExchange.Interfaces
{
    public interface IUserExchangeService
    {
        Task<UserExchangeResult> GetUsers(UserExchangeRequest request, CurrentContext currentContext, HttpRequestMessage httpRequest);
    }
}

