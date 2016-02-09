module insite.console.websitesettings {
    "use strict";

    export class SeoSettingsController {

        isLoading = true;
        settings: any = {};
        tree = [];
        websiteId: System.Guid;
        fancyTree: any;
        errorMessage: string;
        successMessage: string;
        changeMessage: string;
        static hasChanges: boolean = false;

        public static $inject = [
            "$http",
            "seoSettingsService",
            "$scope"
        ];

        constructor(
            protected $http: ng.IHttpService,
            protected seoSettingsService: ISeoSettingsService,
            protected $scope: ng.IScope) {
        }

        getSeoSettings(websiteId: System.Guid) {
            this.websiteId = websiteId;
            this.isLoading = true;
            this.errorMessage = null;

            this.seoSettingsService.getSeoSettings(this.websiteId).success((result) => {
                this.settings = result;

                // Not using strongly typed objects due to mvc not using the Json.Net serializer and property names not matching up with the generated typelite interfaces
                var pages = result["CmsPages"];
                this.tree = this.generateTree(pages, null);
                
                this.fancyTree = (<any>$("#cmsTree")).fancytree({
                    source: this.tree,
                    checkbox: true,
                    select: (event, data) => {
                        this.changed();
                        this.$scope.$apply();
                    }
                });
            }).error(() => {
                this.errorMessage = "An error occured when trying to retrieve seo settings for the current website";
            }).finally(() => {
                this.isLoading = false;
            });
        }

        saveSeoSettings() {
            var selectedNodes = (<any>$("#cmsTree")).fancytree("getTree").getSelectedNodes();
            this.settings.CmsPages.forEach((p) => {
                // ReSharper disable once CoercedEqualsUsing
                p["ExcludeFromSearch"] = !selectedNodes.some(n => n.key == p["ContentKey"]);
            });

            this.seoSettingsService.updateSeoSettings(this.websiteId, this.settings).success(() => {
                this.successMessage = "SEO Settings have been updated";
                this.changeMessage = null;
                SeoSettingsController.hasChanges = false;
            }).error(() => {
                this.errorMessage = "An error occurred when trying to update SEO settings.";
            });
        }

        generateTree(pages, contentKey: number) {
            var nodeArray = [];

            var nodes = pages.filter(x => x["ParentContentKey"] === contentKey);
            nodes.forEach(n => {
                var node = {
                    title: n["Title"],
                    key: n["ContentKey"],
                    selected: !n["ExcludeFromSearch"],
                    children: this.generateTree(pages, n["ContentKey"]),
                    expanded: false
                };

                if (node.children.length === 0) {
                    delete node.children;
                } else {
                    node.expanded = true;
                }

                nodeArray.push(node);
            });

            return nodeArray;
        }

        cmsSelectAllClick(selected: boolean) {
            (<any>$("#cmsTree")).fancytree("getTree").visit(n => {
                n.setSelected(selected);
            });
        }

        changed() {
            if (!this.changeMessage) {
                this.changeMessage = "You have unsaved changes.";
                SeoSettingsController.hasChanges = true;
                this.successMessage = null;
            }
        }
    };

    angular
        .module("insite.console")
        .controller("SeoSettingsController", SeoSettingsController);
}

// triggers the unsaved changes dialog
function hasChanges() {
    return insite.console.websitesettings.SeoSettingsController.hasChanges;
}
