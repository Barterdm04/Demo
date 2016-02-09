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
        public UserExchangeRepository(IUnitOfWork unitOfWork, ICustomerService customerService,
            IProductService productService)
            : base(unitOfWork, customerService, productService)
        {

        }

        public UserExchangeResult GetUsers(UserExchangeRequest sopRequest, CurrentContext currentContext, HttpRequestMessage httpRequest)
        {
            var result = new UserExchangeResult();

            var users = unitOfWork.GetRepository<UserProfile>().GetTable();

            foreach (var user in users)
            {
                var nebUser = new NEBUser
                {
                    Name = user.UserName,
                    Id = user.Id,
                    BillTo = new List<Customer>()
                };

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
                        nebUser.BillTo.Add(new Customer()
                        {
                            IdString = customer.IdString
                        });
                    }
                }
                result.Users.Add(nebUser);
            }
            result.Success = true;

            return result;
        }
    }
}
