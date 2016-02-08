using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using InSite.Model;

namespace InSiteCommerce.Web.NEBCustomizations.UserExchange.Models
{
    public class NEBUser
    {
        public string Name { get; set; }

        public Guid Id { get; set; }

        public List<Customer> BillTo { get; set; }

        public List<Customer> ShipTo { get; set; }
    }
}