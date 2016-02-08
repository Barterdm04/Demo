using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using Insite.Catalog.Services;
using Insite.Customers.Services;
using InSite.Model;
using InSite.Model.Core;
using InSite.Model.Interfaces;
using InSite.Model.Interfaces.Dependency;
using InSiteCommerce.Web.NEBCustomizations.Interfaces;
using InSiteCommerce.Web.NEBCustomizations.UserExchange.Models;

namespace InSiteCommerce.Web.NEBCustomizations.Repositories
{
    public class UserExchangeRepository : BaseRepository, IUserExchangeRepository, IInterceptable, IDependency
    {
        private IContextProvider contextProvider;

        public UserExchangeRepository(IUnitOfWork unitOfWork, ICustomerService customerService,
            IProductService productService, IContextProvider contextProvider)
            : base(unitOfWork, customerService, productService)
        {
            this.contextProvider = contextProvider;
        }

        public UserExchangeResult GetUsers(UserExchangeRequest sopRequest, CurrentContext currentContext, HttpRequestMessage httpRequest)
        {
            var result = new UserExchangeResult();

            if (contextProvider.CurrentUserProfile == null)
            {
                result.Success = false;
                result.ErrorMessage = "contextProvider.CurrentUserProfile is null";
            }
            else
            {
                var users = unitOfWork.GetRepository<UserProfile>().GetTable()
                    .Where(x => x.Id != contextProvider.CurrentUserProfile.Id);

                foreach (var user in users)
                {
                    var nebUser = new NEBUser();
                    nebUser.Name = user.UserName;
                    nebUser.Id = user.Id;
                    nebUser.BillTo = new List<Customer>();
                    nebUser.ShipTo = new List<Customer>();

                    var customers = unitOfWork.GetRepository<CustomerUserProfile>().GetTable()
                         .Where(x => x.UserProfile.Id == nebUser.Id)
                         .Join(unitOfWork.GetRepository<Customer>().GetTable(),
                          customerUserProfile => customerUserProfile.Customer.Id,
                          customer => customer.Id,
                          (customerUserProfile, customer) => customer);

                    foreach (var customer in customers)
                    {
                        if (!string.IsNullOrEmpty(customer.CustomerName) && customer.IsActive)
                        {
                            if (string.IsNullOrEmpty(customer.CustomerSequence))
                            {
                                if(customer.Id == currentContext.BillTo.Id)
                                    result.Users.Add(nebUser);
                            }
                        }
                    }
                }

                result.Success = true;
                }
            return result;
        }
    }
}
