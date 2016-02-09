using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Services;
using System.Data.Services.Common;
using System.Linq.Expressions;
using System.Security.Principal;
using System.ServiceModel.Web;
using System.Text;
using System.Web;
using System.Web.Security;
using InSite.Library;
using InSite.Model;
using InSite.Model.Interfaces;
using InSite.OData;
using Microsoft.Practices.ServiceLocation;

namespace InSiteCommerce.Web.OData.Secure
{
    using InSite.Model.Interfaces.Repositories;

    [System.ServiceModel.ServiceBehavior(IncludeExceptionDetailInFaults = true)]
    public class ModelService : DataService<ModelContext>
    {
        protected readonly IUnitOfWork UnitOfWork;
        protected readonly IContextProvider ContextProvider;
        protected readonly IAuthenticationService AuthenticationService;

        // This method is called only once to initialize service-wide policies.
        public static void InitializeService(DataServiceConfiguration config)
        {
            config.UseVerboseErrors = true;
            config.SetEntitySetAccessRule("*", EntitySetRights.All);
            config.SetServiceOperationAccessRule("*", ServiceOperationRights.All);
            config.SetEntitySetPageSize("Products", 500);
            config.SetEntitySetPageSize("ProductInfos", 500);
            config.SetEntitySetPageSize("Customers", 500);
            config.SetEntitySetPageSize("CustomerInfos", 500);
            config.SetEntitySetPageSize("CustomerOrders", 500);
            config.SetEntitySetPageSize("OrderLines", 500);
            config.DataServiceBehavior.MaxProtocolVersion = DataServiceProtocolVersion.V3;
            config.DataServiceBehavior.AcceptProjectionRequests = true;
        }

        public ModelService()
        {
            UnitOfWork = ServiceLocator.Current.GetInstance<IUnitOfWork>();
            ContextProvider = ServiceLocator.Current.GetInstance<IContextProvider>();
            AuthenticationService = ServiceLocator.Current.GetInstance<IAuthenticationService>();
        }

        protected override void OnStartProcessingRequest(ProcessRequestArgs args)
        {
            // If already logged in via Forms Auth, just return
            if (ContextProvider.CurrentUserProfile != null)
                return;

            if (!args.OperationContext.RequestHeaders.AllKeys.Contains("Authorization"))
            {
                CreateNotAuthorizedResponse(401, 1, "Authorization headers missing.");
                HttpContext.Current.ApplicationInstance.Response.End();
                return;
            }

            var credentials = GetCredentialsFromHeader(args.OperationContext.RequestHeaders["Authorization"]);
            if (credentials == null)
            {
                CreateNotAuthorizedResponse(403, 1, "Wrong credentials header.");
                HttpContext.Current.ApplicationInstance.Response.End();
                return;
            }

            // UserName can be in the form of just UserName, UserName\CustomerNumber or UserName\CustomerNumber\CustomerSequence
            var loginInfo = credentials[0].Split('\\');
            var userName = loginInfo[0];
            var customerNumber = "";
            var customerSequence = "";
            if (loginInfo.Length > 1)
                customerNumber = loginInfo[1];
            if (loginInfo.Length > 2)
                customerSequence = loginInfo[2];

            var password = credentials[1];

            if (!AuthenticationService.ValidateUser(ContextProvider.CurrentApplicationName, userName, password))
            {
                CreateNotAuthorizedResponse(403, 1, "Wrong credentials.");
                HttpContext.Current.ApplicationInstance.Response.End();
                return;
            }
            var userProfile = UserProfile.GetByUserName(userName);
            if (userProfile == null)
            {
                CreateNotAuthorizedResponse(403, 1, "UserProfile record missing.");
                HttpContext.Current.ApplicationInstance.Response.End();
                return;
            }
            if (!string.IsNullOrEmpty(customerNumber))
            {
                if (!CustomerUserProfile.GetTable().Any(cup => cup.UserProfile.Id == userProfile.Id && cup.Customer.CustomerNumber == customerNumber))
                {
                    CreateNotAuthorizedResponse(403, 1, "The supplied CustomerNumber is not associated with the supplied UserName.");
                    HttpContext.Current.ApplicationInstance.Response.End();
                    return;
                }

                var customer = Customer.GetByNumber(customerNumber);
                ContextProvider.SetContext(customer);
                if (!string.IsNullOrEmpty(customerSequence))
                {
                    var shipTo = Customer.GetByNumberSequence(customerNumber, customerSequence);
                    if (!CustomerInfo.GetTable().Any(c => c.CustomerNumber == customerNumber && c.CustomerSequence == customerSequence))
                    {
                        CreateNotAuthorizedResponse(403, 1, "The supplied CustomerSequence is not associated with the supplied CustomerNumber.");
                        HttpContext.Current.ApplicationInstance.Response.End();
                        return;
                    }
                    ContextProvider.SetContext(customer, shipTo);
                }
            }
            FormsAuthentication.SetAuthCookie(userName, true);
            HttpContext.Current.ApplicationInstance.Context.User = new GenericPrincipal(new GenericIdentity(userName), Roles.GetRolesForUser(userName));
        }

        private static string[] GetCredentialsFromHeader(string authHeader)
        {
            // Check if header starts with Basic
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Basic", StringComparison.OrdinalIgnoreCase))
                return null;

            // Decode credentials, and split them (separator is ':')
            var base64Credentials = authHeader.Substring(6);
            var credentials = Encoding.ASCII.GetString(Convert.FromBase64String(base64Credentials)).Split(':');
            // if empty credentials our more than 2 (Username and password)
            if (credentials.Length != 2 || string.IsNullOrEmpty(credentials[0]) || string.IsNullOrEmpty(credentials[0]))
                return null;

            // return credential
            return credentials;
        }

        private void CreateNotAuthorizedResponse(int code, int subCode, string description)
        {
            var response = HttpContext.Current.ApplicationInstance.Response;
            response.Clear();
            response.StatusCode = code;
            response.SubStatusCode = subCode;
            response.StatusDescription = description;
            response.AppendHeader("WWW-Authenticate", "Basic");
        }

        private void CheckIsAdminOrSystem()
        {
            var user = HttpContext.Current.User;
            if (!HttpContext.Current.Request.IsAuthenticated || (!user.IsInRole(Role.ISC_System) && !user.IsInRole(Role.ISC_Admin)))
                throw new DataServiceException(400, "Not authorized");
        }


        [QueryInterceptor("Languages")]
        public Expression<Func<Language, bool>> LanguageFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("Menus")]
        public Expression<Func<Menu, bool>> MenuFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("ApplicationDictionaries")]
        public Expression<Func<ApplicationDictionary, bool>> ApplicationDictionaryFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("DictionaryAttributes")]
        public Expression<Func<DictionaryAttribute, bool>> DictionaryAttributeFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("DictionaryLabels")]
        public Expression<Func<DictionaryLabel, bool>> DictionaryLabelFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("ApplicationSettings")]
        public Expression<Func<ApplicationSetting, bool>> ApplicationSettingFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("MiscellaneousCodes")]
        public Expression<Func<MiscellaneousCode, bool>> MiscellaneousCodeFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("WebSites")]
        public Expression<Func<WebSite, bool>> WebSiteFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("WebSiteLanguages")]
        public Expression<Func<WebSiteLanguage, bool>> WebSiteLanguageFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
                
        // TODO 4.0: Figure out a way to genericize to work for both Product and ProductInfo
        [QueryInterceptor("ProductInfos")]
        public Expression<Func<ProductInfo, bool>> ProductInfosFilter()
        {
            if (!HttpContext.Current.Request.IsAuthenticated)
                return product => false;
            var user = HttpContext.Current.User;
            if (user.IsInRole(Role.ISC_System) || user.IsInRole(Role.ISC_Admin) || user.IsInRole(Role.ISC_User))
                return product => true;

            var websiteConfigurationRepository = ServiceLocator.Current.GetInstance<IUnitOfWorkFactory>().GetUnitOfWork().GetTypedRepository<IWebSiteConfigurationRepository>();

            var customerProductsInclude = websiteConfigurationRepository.GetOrCreateByName<string>("CustomerProductsInclude").ToLowerInvariant();
            Expression<Func<ProductInfo, bool>> filter = null;
            if (customerProductsInclude != "ignore")
            {
                var productIdList = CustomerProduct.GetTable().Where(cp => cp.Customer.Id == ContextProvider.CurrentCustomer.Id).Select(cp => cp.Product.Id).ToList();
                if (customerProductsInclude == "true")
                    filter = product => productIdList.Contains(product.Id);
                else
                    filter = product => !productIdList.Contains(product.Id);
            }

            // Restriction Groups
            var currentCustomer = ContextProvider.CurrentCustomer;
            var currentShipTo = ContextProvider.CurrentShipTo;
            var restrictionsByItem = websiteConfigurationRepository.GetOrCreateByName<bool>("RestrictionsByItem");
            if (restrictionsByItem && !currentShipTo.IgnoreProductRestrictions && !currentCustomer.IgnoreProductRestrictions && RestrictionGroup.GetTable().Any())
            {
                var shiptoProductSets = currentShipTo.CustomerProductSets;
                var customerProductSets = currentCustomer.CustomerProductSets;

                Expression<Func<ProductInfo, bool>> restrictionFilter = null;

                foreach (var restrictionGroup in RestrictionGroup.GetTable())
                {
                    var restrictionGroupId = restrictionGroup.Id;
                    var restrictionGroupName = restrictionGroup.Name.Trim();

                    // shipto product sets take precedence over customer
                    var productSet = shiptoProductSets.FirstOrDefault(ps => string.Equals(ps.Name.Trim(), restrictionGroupName, StringComparison.OrdinalIgnoreCase)) ??
                                     customerProductSets.FirstOrDefault(ps => string.Equals(ps.Name.Trim(), restrictionGroupName, StringComparison.OrdinalIgnoreCase));
                    if(productSet != null)
                    {
                        if(productSet.Products.Count == 0)
                        {
                            // Override the whole Restriction Group for this customer/shipto
                            if (restrictionGroup.Allow)
                            {
                                restrictionFilter = restrictionFilter == null ? 
                                    product => product.RestrictionGroup.Id == restrictionGroupId : 
                                    restrictionFilter.Or(product => product.RestrictionGroup.Id == restrictionGroupId);
                            }
                            // ignore deny groups, its overriden to allow it
                        }
                        else
                        {
                            var productIdList = productSet.Products.Select(cp => cp.Product.Id).ToList();
                            if (restrictionGroup.Allow)
                            {
                                // Override the products from the set for this Restriction Group for this customer/shipto                                
                                restrictionFilter = restrictionFilter == null ? 
                                    product => productIdList.Contains(product.Id) : 
                                    restrictionFilter.Or(product => productIdList.Contains(product.Id));
                            }
                            else
                            {                                
                                // all products in the group are denied except certain ones                                
                                Expression<Func<ProductInfo, bool>> subQuery = product => product.RestrictionGroup.Id == restrictionGroupId;
                                subQuery = subQuery.And(product => !productIdList.Contains(product.Id));
                                restrictionFilter = restrictionFilter == null ? subQuery : restrictionFilter.Or(subQuery);
                            }
                        }                        
                    }
                    else
                    {
                        // Apply RestrictionGroup if no customer/shipto exceptions
                        // if it's allow, we just don't want to do anything
                        if (!restrictionGroup.Allow)
                        {
                            restrictionFilter = restrictionFilter == null ? 
                                product => product.RestrictionGroup.Id == restrictionGroupId : 
                                restrictionFilter.Or(product => product.RestrictionGroup.Id == restrictionGroupId);
                        }
                    }
                }
                if (restrictionFilter != null)
                {
                    // if anything in this restriction filter is true, the product will be blocked
                    restrictionFilter = restrictionFilter.Not();

                    // SQL has a problem comparing to null uniqueidentifiers so ignore restrictionFilter completely if RestrictionGroupId is NULL
                    Expression<Func<ProductInfo, bool>> nullRestrictionGroupFilter = product => product.RestrictionGroup == null;
                    restrictionFilter = nullRestrictionGroupFilter.Or(restrictionFilter);

                    filter = filter == null ? restrictionFilter : filter.And(restrictionFilter);
                }
            }

            return filter ?? (product => true);
        }

        [QueryInterceptor("Products")]
        public Expression<Func<Product, bool>> ProductsFilter()
        {
            if (!HttpContext.Current.Request.IsAuthenticated)
                return product => false;
            var user = HttpContext.Current.User;
            if (user.IsInRole(Role.ISC_System) || user.IsInRole(Role.ISC_Admin) || user.IsInRole(Role.ISC_User))
                return product => true;

            var websiteConfigurationRepository = ServiceLocator.Current.GetInstance<IUnitOfWorkFactory>().GetUnitOfWork().GetTypedRepository<IWebSiteConfigurationRepository>();

            var customerProductsInclude = websiteConfigurationRepository.GetOrCreateByName<string>("CustomerProductsInclude").ToLowerInvariant();
            Expression<Func<Product, bool>> filter = null;
            if (customerProductsInclude != "ignore")
            {
                var productIdList = CustomerProduct.GetTable().Where(cp => cp.Customer.Id == ContextProvider.CurrentCustomer.Id).Select(cp => cp.Product.Id).ToList();
                if (customerProductsInclude == "true")
                    filter = product => productIdList.Contains(product.Id);
                else
                    filter = product => !productIdList.Contains(product.Id);
            }

            // Restriction Groups
            var currentCustomer = ContextProvider.CurrentCustomer;
            var currentShipTo = ContextProvider.CurrentShipTo;
            var restrictionsByItem = websiteConfigurationRepository.GetOrCreateByName<bool>("RestrictionsByItem");
            if (restrictionsByItem && !currentShipTo.IgnoreProductRestrictions && !currentCustomer.IgnoreProductRestrictions && RestrictionGroup.GetTable().Any())
            {
                var shiptoProductSets = currentShipTo.CustomerProductSets;
                var customerProductSets = currentCustomer.CustomerProductSets;

                Expression<Func<Product, bool>> restrictionFilter = null;

                foreach (var restrictionGroup in RestrictionGroup.GetTable())
                {
                    var restrictionGroupId = restrictionGroup.Id;
                    var restrictionGroupName = restrictionGroup.Name.Trim();

                    // shipto product sets take precedence over customer
                    var productSet = shiptoProductSets.FirstOrDefault(ps => string.Equals(ps.Name.Trim(), restrictionGroupName, StringComparison.OrdinalIgnoreCase)) ??
                                     customerProductSets.FirstOrDefault(ps => string.Equals(ps.Name.Trim(), restrictionGroupName, StringComparison.OrdinalIgnoreCase));
                    if(productSet != null)
                    {
                        if(productSet.Products.Count == 0)
                        {
                            // Override the whole Restriction Group for this customer/shipto
                            if (restrictionGroup.Allow)
                            {
                                restrictionFilter = restrictionFilter == null ? 
                                    product => product.RestrictionGroup.Id == restrictionGroupId : 
                                    restrictionFilter.Or(product => product.RestrictionGroup.Id == restrictionGroupId);
                            }
                            // ignore deny groups, its overriden to allow it
                        }
                        else
                        {
                            var productIdList = productSet.Products.Select(cp => cp.Product.Id).ToList();
                            if (restrictionGroup.Allow)
                            {
                                // Override the products from the set for this Restriction Group for this customer/shipto                                
                                restrictionFilter = restrictionFilter == null ? 
                                    product => productIdList.Contains(product.Id) : 
                                    restrictionFilter.Or(product => productIdList.Contains(product.Id));
                            }
                            else
                            {                                
                                // all products in the group are denied except certain ones                                
                                Expression<Func<Product, bool>> subQuery = product => product.RestrictionGroup.Id == restrictionGroupId;
                                subQuery = subQuery.And(product => !productIdList.Contains(product.Id));
                                restrictionFilter = restrictionFilter == null ? subQuery : restrictionFilter.Or(subQuery);
                            }
                        }                        
                    }
                    else
                    {
                        // Apply RestrictionGroup if no customer/shipto exceptions
                        // if it's allow, we just don't want to do anything
                        if (!restrictionGroup.Allow)
                        {
                            restrictionFilter = restrictionFilter == null ? 
                                product => product.RestrictionGroup.Id == restrictionGroupId : 
                                restrictionFilter.Or(product => product.RestrictionGroup.Id == restrictionGroupId);
                        }
                    }
                }
                if (restrictionFilter != null)
                {
                    // if anything in this restriction filter is true, the product will be blocked
                    restrictionFilter = restrictionFilter.Not();

                    // SQL has a problem comparing to null uniqueidentifiers so ignore restrictionFilter completely if RestrictionGroupId is NULL
                    Expression<Func<Product, bool>> nullRestrictionGroupFilter = product => product.RestrictionGroup == null;
                    restrictionFilter = nullRestrictionGroupFilter.Or(restrictionFilter);

                    filter = filter == null ? restrictionFilter : filter.And(restrictionFilter);
                }
            }

            return filter ?? (product => true);
        }
        
        [QueryInterceptor("ProductProperties")]
        public Expression<Func<ProductProperty, bool>> ProductPropertieFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("RestrictionGroups")]
        public Expression<Func<RestrictionGroup, bool>> RestrictionGroupFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("Dealers")]
        public Expression<Func<Dealer, bool>> DealerFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("DealerProperties")]
        public Expression<Func<DealerProperty, bool>> DealerPropertyFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("WishLists")]
        public Expression<Func<WishList, bool>> WishListFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("WishListProducts")]
        public Expression<Func<WishListProduct, bool>> WishListProductFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("UserProfiles")]
        public Expression<Func<UserProfile, bool>> UserProfileFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("UserProfileProperties")]
        public Expression<Func<UserProfileProperty, bool>> UserProfilePropertyFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("Roles")]
        public Expression<Func<Role, bool>> RoleFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("Customers")]
        public Expression<Func<Customer, bool>> CustomerFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("CustomerInfos")]
        public Expression<Func<CustomerInfo, bool>> CustomerInfoFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }

        [QueryInterceptor("CustomerOrders")]
        public Expression<Func<CustomerOrder, bool>> CustomerOrdersFilter()
        {
            if (!HttpContext.Current.Request.IsAuthenticated)
                return order => false;
            var user = HttpContext.Current.User;
            if (user.IsInRole(Role.ISC_System) || user.IsInRole(Role.ISC_Admin) || user.IsInRole(Role.ISC_User))
                return order => order.Status != CustomerOrder.CartStatus;
            return order => order.Status != CustomerOrder.CartStatus && order.CustomerNumber == ContextProvider.CurrentCustomer.CustomerNumber;
        }

        [QueryInterceptor("OrderLines")]
        public Expression<Func<OrderLine, bool>> OrderLinesFilter()
        {
            if (!HttpContext.Current.Request.IsAuthenticated)
                return order => false;
            var user = HttpContext.Current.User;
            if (user.IsInRole(Role.ISC_System) || user.IsInRole(Role.ISC_Admin) || user.IsInRole(Role.ISC_User))
                return line => line.CustomerOrder.Status != CustomerOrder.CartStatus;
            return line => line.CustomerOrder.Status != CustomerOrder.CartStatus && line.CustomerOrder.CustomerNumber == ContextProvider.CurrentCustomer.CustomerNumber;
        }
        
        [QueryInterceptor("OrderLineProperties")]
        public Expression<Func<OrderLineProperty, bool>> OrderLinePropertyFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("OrderLineConfigurationValues")]
        public Expression<Func<OrderLineConfigurationValue, bool>> OrderLineConfigurationValueFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }

        [QueryInterceptor("OrderHistories")]
        public Expression<Func<OrderHistory, bool>> OrderHistoriesFilter()
        {
            if (!HttpContext.Current.Request.IsAuthenticated)
                return order => false;
            var user = HttpContext.Current.User;
            if (user.IsInRole(Role.ISC_System) || user.IsInRole(Role.ISC_Admin) || user.IsInRole(Role.ISC_User))
                return order => true;
            return order => order.CustomerNumber == ContextProvider.CurrentCustomer.CustomerNumber;
        }

        [QueryInterceptor("OrderHistoryLines")]
        public Expression<Func<OrderHistoryLine, bool>> OrderHistoryLinesFilter()
        {
            if (!HttpContext.Current.Request.IsAuthenticated)
                return line => false;
            var user = HttpContext.Current.User;
            if (user.IsInRole(Role.ISC_System) || user.IsInRole(Role.ISC_Admin) || user.IsInRole(Role.ISC_User))
                return line => true;
            return line => line.CustomerNumber == ContextProvider.CurrentCustomer.CustomerNumber;
        }
        
        [QueryInterceptor("CategoryInfos")]
        public Expression<Func<CategoryInfo, bool>> CategoryInfoFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("Vendors")]
        public Expression<Func<Vendor, bool>> VendorFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("Carriers")]
        public Expression<Func<Carrier, bool>> CarrierFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("ShipVias")]
        public Expression<Func<ShipVia, bool>> ShipViaFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("Countries")]
        public Expression<Func<Country, bool>> CountryFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("States")]
        public Expression<Func<State, bool>> StateFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }

        [QueryInterceptor("Promotions")]
        public Expression<Func<Promotion, bool>> PromotionsFilter()
        {
            if (!HttpContext.Current.Request.IsAuthenticated)
                return promotion => false;
            var user = HttpContext.Current.User;
            if (user.IsInRole(Role.ISC_System) || user.IsInRole(Role.ISC_Admin) || user.IsInRole(Role.ISC_User))
                return promotion => true;
            return promotion => promotion.WebSites.Contains(ContextProvider.CurrentWebSite);
        }
        
        [QueryInterceptor("PromotionRules")]
        public Expression<Func<PromotionRule, bool>> PromotionRuleFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }
        
        [QueryInterceptor("PromotionResults")]
        public Expression<Func<PromotionResult, bool>> PromotionResultFilter()
        {
            CheckIsAdminOrSystem();
            return entity => true;
        }


        [ChangeInterceptor("Languages")]
        public void LanguageChanged(Language entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }

        [ChangeInterceptor("Menus")]
        public void MenuChanged(Menu entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("ApplicationDictionaries")]
        public void ApplicationDictionaryChanged(ApplicationDictionary entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("DictionaryAttributes")]
        public void DictionaryAttributeChanged(DictionaryAttribute entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("DictionaryLabels")]
        public void DictionaryLabelChanged(DictionaryLabel entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("ApplicationSettings")]
        public void ApplicationSettingChanged(ApplicationSetting entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("MiscellaneousCodes")]
        public void MiscellaneousCodeChanged(MiscellaneousCode entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("WebSites")]
        public void WebSiteChanged(WebSite entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("WebSiteLanguages")]
        public void WebSiteLanguageChanged(WebSiteLanguage entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("ProductInfos")]
        public void ProductInfoChanged(ProductInfo entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }

        [ChangeInterceptor("Products")]
        public void ProductChanged(Product entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }

        [ChangeInterceptor("ProductProperties")]
        public void ProductPropertyChanged(ProductProperty entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("RestrictionGroups")]
        public void RestrictionGroupChanged(RestrictionGroup entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("Dealers")]
        public void DealerChanged(Dealer entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("DealerProperties")]
        public void DealerPropertyChanged(DealerProperty entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("WishLists")]
        public void WishListChanged(WishList entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("WishListProducts")]
        public void WishListProductChanged(WishListProduct entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("UserProfiles")]
        public void UserProfileChanged(UserProfile entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("UserProfileProperties")]
        public void UserProfilePropertyChanged(UserProfileProperty entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("Roles")]
        public void RoleChanged(Role entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("Customers")]
        public void CustomerChanged(Customer entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("CustomerInfos")]
        public void CustomerInfoChanged(CustomerInfo entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }

        [ChangeInterceptor("CustomerOrders")]
        public void CustomerOrderChanged(CustomerOrder entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("OrderLines")]
        public void OrderLineChanged(OrderLine entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("OrderLineProperties")]
        public void OrderLinePropertyChanged(OrderLineProperty entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("OrderLineConfigurationValues")]
        public void OrderLineConfigurationValueChanged(OrderLineConfigurationValue entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
                
        [ChangeInterceptor("OrderHistories")]
        public void OrderHistoryChanged(OrderHistory entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }

        [ChangeInterceptor("OrderHistoryLines")]
        public void OrderHistoryLineChanged(OrderHistoryLine entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("CategoryInfos")]
        public void CategoryInfoChanged(CategoryInfo entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("Vendors")]
        public void VendorChanged(Vendor entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("Carriers")]
        public void CarrierChanged(Carrier entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("ShipVias")]
        public void ShipViaChanged(ShipVia entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("Countries")]
        public void CountryChanged(Country entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("States")]
        public void StateChanged(State entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("Promotions")]
        public void PromotionChanged(Promotion entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }

        [ChangeInterceptor("PromotionRules")]
        public void PromotionRuleChanged(PromotionRule entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }
        
        [ChangeInterceptor("PromotionResults")]
        public void PromotionResultChanged(PromotionResult entity, UpdateOperations operation)
        {
            CheckIsAdminOrSystem();
        }


        [WebGet]
        public Guid CurrentUserProfileId()
        {
            return ContextProvider.CurrentUserProfile.Id;
        }

        [WebGet]
        public WebSite CurrentWebSite()
        {
            return ContextProvider.CurrentWebSite;
        }

        [WebGet]
        public UserProfile CurrentUserProfile()
        {
            return ContextProvider.CurrentUserProfile;
        }

        [WebGet]
        public IList<Role> CurrentUserProfileRoles()
        {
            return ContextProvider.CurrentUserProfile.Roles;
        }
    }
}
