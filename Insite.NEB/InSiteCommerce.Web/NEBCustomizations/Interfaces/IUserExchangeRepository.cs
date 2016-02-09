using System.Net.Http;
using InSite.Model.Core;
using InSiteCommerce.Web.NEBCustomizations.UserExchange.Models;

namespace InSiteCommerce.Web.NEBCustomizations.Interfaces
{
    public interface IUserExchangeRepository
    {
        UserExchangeResult GetUsers(UserExchangeRequest ueRequest, CurrentContext currentContext, HttpRequestMessage httpRequest);
    }
}
