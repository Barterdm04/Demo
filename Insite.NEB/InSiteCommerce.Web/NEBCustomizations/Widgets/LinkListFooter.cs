using System;
using System.Collections.Generic;
using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Pages;
using Insite.ContentLibrary.Widgets;
using Insite.WebFramework.Content;
using Insite.WebFramework.Content.Attributes;

namespace InSiteCommerce.Web.NEBCustomizations.Widgets
{
    [AllowedParents(new Type[] { typeof(Footer) })]
    public class LinkListFooter : ContentWidget
    {
        [TextContentField(IsRequired = true)]
        public virtual string ListTitle
        {
            get
            {
                return this.GetValue<string>("ListTitle", "", FieldType.Variant);
            }
            set
            {
                this.SetValue<string>("ListTitle", value, FieldType.Variant);
            }
        }

        [ListOfPagesContentField(DisplayName = "Pages", IsRequired = true)]
        public virtual List<int> Pages
        {
            get
            {
                return this.GetValue<List<int>>("Pages", new List<int>(), FieldType.General);
            }
            set
            {
                this.SetValue<List<int>>("Pages", value, FieldType.General);
            }
        }

        [RichTextContentField(IsRequired = false)]
        public virtual string AdditionalLinks
        {
            get
            {
                return this.GetValue<string>("AdditionalLinks", "", FieldType.Variant).Replace("<ul>", "").Replace("</ul>", "");
            }
            set
            {
                this.SetValue<string>("AdditionalLinks", value, FieldType.Variant);
            }
        }
    }
}

