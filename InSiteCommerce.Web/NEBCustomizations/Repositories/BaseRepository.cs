using System;
using System.Configuration;
using System.Data.SqlClient;
using Insite.Catalog.Services;
using Insite.Customers.Services;
using InSite.Model.Interfaces;

namespace InSiteCommerce.Web.NEBCustomizations.Repositories
{
    public class BaseRepository
    {
        private String connectionString = String.Empty;
        protected IUnitOfWork unitOfWork { get; set; }
        protected readonly ICustomerService CustomerService;
        protected readonly IProductService ProductService;

        protected BaseRepository(IUnitOfWork unitOfWork, ICustomerService customerService, IProductService productService)
        {
            this.connectionString = ConfigurationManager.ConnectionStrings["InSite.Commerce"].ConnectionString;
            this.unitOfWork = unitOfWork;
            this.CustomerService = customerService;
            this.ProductService = productService;
        }

        protected SqlConnection GetOpenConnection()
        {
            var result = new SqlConnection(this.connectionString);
            result.Open();
            return result;
        }

        protected SqlParameter GetParameter(string parameterName, object value)
        {
            object parameterValue = value ?? DBNull.Value;
            return new SqlParameter(parameterName, parameterValue);
        }

        protected DateTime? GetNullableDateTime(SqlDataReader rdr, string key)
        {
            return (rdr[key] != DBNull.Value) ? (DateTime?) rdr[key] : null;
        }
    }
}
