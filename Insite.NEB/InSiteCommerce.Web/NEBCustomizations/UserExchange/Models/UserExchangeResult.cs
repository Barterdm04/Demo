using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using InSite.Model;

namespace InSiteCommerce.Web.NEBCustomizations.UserExchange.Models
{
    public class UserExchangeResult
    {
        public UserExchangeResult()
        {
            Users = new List<NEBUser>();
        }
        public Boolean Success { get; set; }
        public String ErrorMessage { get; set; }
        public List<NEBUser> Users { get; set; }
    }
}
