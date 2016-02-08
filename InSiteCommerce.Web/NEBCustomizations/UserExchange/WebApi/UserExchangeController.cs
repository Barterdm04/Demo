using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using Insite.Core.WebApi;
using Insite.Core.WebApi.Interfaces;
using InSite.Model.Managers;
using InSiteCommerce.Web.NEBCustomizations.UserExchange.Models;
using InSiteCommerce.Web.NEBCustomizations.UserExchange.Interfaces;

namespace InSiteCommerce.Web.NEBCustomizations.UserExchange.WebApi
{
    [System.Web.Http.RoutePrefix("api/NEB/userexchange")]
    public class UserExchangeController : BaseApiController
    {
        private readonly IUserExchangeService userExchangeService;

        public UserExchangeController(IContextUnwrapper contextUnwrapper, ICookieManager cookieManager, IUserExchangeService userExchangeService) 
            : base(contextUnwrapper, cookieManager)
        {
            this.userExchangeService = userExchangeService;
        }

        [ResponseType(typeof(UserExchangeResult)), Route("getUsers")]
        public async Task<IHttpActionResult> Get([FromUri] UserExchangeRequest rqst)
        {
            var currentContext = base.ContextUnwrapper.UnwrapContext(this.Request);
            return this.Ok<UserExchangeResult>(await this.userExchangeService.GetUsers(rqst, currentContext, this.Request));
        }

    }
}
