namespace InSiteCommerce.Web
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Web;
    using System.Web.Optimization;
    using Insite.WebFramework.Theming;
    using Microsoft.Practices.ServiceLocation;

    /// <summary>
    /// Sets up javascript and css bundling at application start.
    /// </summary>
    public class BundleConfig
    {
        public const string LibraryScriptBundlePath = "~/bundles/js/libraries.min.js";

        /// <summary>Xml file containing all files to add to the libraries.min.js so they be edited easily for implementations</summary>
        public const string LibraryScriptXmlPath = "Scripts/Libraries/libraries.bundle.xml";

        public const string GlobalScriptBundlePath = "~/bundles/js/global.min.js";
        private static readonly string[] GlobalScripts = {
            "~/Scripts/App/insite.module.js",
            "~/Scripts/App/core/insite.authenticationinterceptor.factory.js",
            "~/Scripts/App/core/insite.core.httpErrorsInterceptor.factory.js",
            "~/Scripts/App/insite.config.js",
           
            "~/Scripts/App/insite.nav.js",
            "~/Scripts/App/insite.jquery.extensions.js",
            "~/Scripts/App/insite.core.js",
            "~/Scripts/App/insite.responsive.js",
            "~/Scripts/App/insite.personalization.js"      
        };

        public const string GlobalStyleBundlePath = "~/bundles/css/global.min.css";
        private static readonly string[] GlobalStyles = {
            "~/Styles/normalize.css",
            "~/Styles/foundation.css",
            "~/Scripts/Libraries/chosen.jquery/1.0.0/chosen.min.css",
            "~/Scripts/libraries/pickadate/3.5.0-custom/themes/classic.css",
            "~/Scripts/libraries/pickadate/3.5.0-custom/themes/classic.date.css",
            "~/Styles/flexslider.css"
        };

        // files with fonts that can't be bundled with foundation.css or there will be issues in IE
        public const string BaseStyleBundlePath = "~/bundles/css/base.min.css";
        private static readonly string[] BaseStyles = {
            "~/Styles/base.css",
            "~/Styles/cms-incontext.css"
        };

        public const string ProductListStyleBundlePath = "~/bundles/css/productlist.min.css";
        private static readonly string[] ProductListStyles = {
            "~/Styles/template/product-list.css",
            "~/Styles/template/product-category.css",
            "~/Styles/template/compare-hopper.css"
        };

        public const string ProductDetailStyleBundlePath = "~/bundles/css/productdetail.min.css";
        private static readonly string[] ProductDetailStyles = {
            "~/Styles/template/product-detail.css",
            "~/Scripts/Libraries/jquery.jqzoom/2.3.Custom/jquery.jqzoom.css"
        };

        public const string ContentAdminLibraryScriptBundlePath = "~/bundles/js/contentadmin/libraries.min.js";
        private static readonly string[] ContentAdminLibraryScripts = {
            "~/Scripts/Libraries/jquery/1.10.2/jquery.min.js",
            "~/Scripts/Libraries/jquery-ui/1.9.2/jquery-ui.custom.min.js",
            "~/Scripts/Libraries/jquery-ui/jquery-ui-i18n.min.js",
            "~/Scripts/Libraries/jquery.validate/1.11.1/jquery.validate.min.js",
            "~/Scripts/Libraries/jquery.validate.unobtrusive.min.js",
            "~/Scripts/Libraries/knockout/2.2.1/knockout.min.js",
            "~/Scripts/Libraries/knockout.mapping/2.2.4/knockout.mapping.js",
            "~/Scripts/Libraries/history/1.8.0b2/jquery.history.js",
            "~/Scripts/Libraries/jquery.simplemodal/1.4.4/jquery.simplemodal.min.js",
            "~/Scripts/Libraries/jquery.cookie/1.3.1/jquery.cookie.js",
            "~/Console/editor/adapters/jquery.js",
            "~/Scripts/libraries/pickadate/3.5.0-custom/picker.js",
            "~/Scripts/libraries/pickadate/3.5.0-custom/picker.date.js",
            "~/Scripts/libraries/pickadate/3.5.0-custom/picker.time.js",
            "~/Scripts/libraries/fancyselect/custom/fancySelect.js"
        };

        public const string ContentAdminGlobalScriptBundlePath = "~/bundles/js/contentadmin/global.min.js";
        private static readonly string[] ContentAdminGlobalScripts = {
            "~/Scripts/App/insite.jquery.extensions.js",
            "~/Scripts/App/insite.core.js",
            "~/Scripts/App/insite.contentCore.js",
            "~/Scripts/App/insite.contentadmin.js",
            "~/Scripts/App/insite.contentadmin.tree.js"
        };

        public const string ContentAdminGlobalStyleBundlePath = "~/bundles/css/contentadmin/global.min.css";
        private static readonly string[] ContentAdminGlobalStyles = {
            "~/Scripts/Libraries/jquery-ui/1.9.2/jquery-ui.custom.css",
            "~/Scripts/Libraries/jquery.fancytree/2.2.0/skin-lion/ui.fancytree.min.css",
            "~/Styles/normalize.min.css",
            "~/Styles/contentadmin.css",
            "~/Styles/cms.css",
            "~/Scripts/libraries/pickadate/3.5.0-custom/themes/classic.css",
            "~/Scripts/libraries/pickadate/3.5.0-custom/themes/classic.date.css",
            "~/Scripts/libraries/pickadate/3.5.0-custom/themes/classic.time.css"
        };

        public static void RegisterBundles(BundleCollection bundles)
        {
            var fileBundler = ServiceLocator.Current.GetInstance<IFileBundler>();            
            fileBundler.AddScriptBundleFromXml(bundles, LibraryScriptBundlePath, LibraryScriptXmlPath);
            fileBundler.AddAutomaticGlobalScriptBundle(bundles, GlobalScriptBundlePath, GlobalScripts);
            fileBundler.AddThemedStyleBundles(bundles, GlobalStyleBundlePath, GlobalStyles);
            fileBundler.AddThemedStyleBundles(bundles, BaseStyleBundlePath, BaseStyles);            
            fileBundler.AddThemedStyleBundles(bundles, ProductListStyleBundlePath, ProductListStyles);            
            fileBundler.AddThemedStyleBundles(bundles, ProductDetailStyleBundlePath, ProductDetailStyles);
            fileBundler.AddScriptBundle(bundles, ContentAdminLibraryScriptBundlePath, ContentAdminLibraryScripts);
            fileBundler.AddScriptBundle(bundles, ContentAdminGlobalScriptBundlePath, ContentAdminGlobalScripts);
            fileBundler.AddStyleBundle(bundles, ContentAdminGlobalStyleBundlePath, ContentAdminGlobalStyles);
        }       
    }
}