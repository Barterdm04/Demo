var insite;
(function (insite) {
    var console;
    (function (console) {
        var websitesettings;
        (function (websitesettings) {
            "use strict";
            var SeoSettingsController = (function () {
                function SeoSettingsController($http, seoSettingsService, $scope) {
                    this.$http = $http;
                    this.seoSettingsService = seoSettingsService;
                    this.$scope = $scope;
                    this.isLoading = true;
                    this.settings = {};
                    this.tree = [];
                }
                SeoSettingsController.prototype.getSeoSettings = function (websiteId) {
                    var _this = this;
                    this.websiteId = websiteId;
                    this.isLoading = true;
                    this.errorMessage = null;
                    this.seoSettingsService.getSeoSettings(this.websiteId).success(function (result) {
                        _this.settings = result;
                        // Not using strongly typed objects due to mvc not using the Json.Net serializer and property names not matching up with the generated typelite interfaces
                        var pages = result["CmsPages"];
                        _this.tree = _this.generateTree(pages, null);
                        _this.fancyTree = $("#cmsTree").fancytree({
                            source: _this.tree,
                            checkbox: true,
                            select: function (event, data) {
                                _this.changed();
                                _this.$scope.$apply();
                            }
                        });
                    }).error(function () {
                        _this.errorMessage = "An error occured when trying to retrieve seo settings for the current website";
                    }).finally(function () {
                        _this.isLoading = false;
                    });
                };
                SeoSettingsController.prototype.saveSeoSettings = function () {
                    var _this = this;
                    var selectedNodes = $("#cmsTree").fancytree("getTree").getSelectedNodes();
                    this.settings.CmsPages.forEach(function (p) {
                        // ReSharper disable once CoercedEqualsUsing
                        p["ExcludeFromSearch"] = !selectedNodes.some(function (n) { return n.key == p["ContentKey"]; });
                    });
                    this.seoSettingsService.updateSeoSettings(this.websiteId, this.settings).success(function () {
                        _this.successMessage = "SEO Settings have been updated";
                        _this.changeMessage = null;
                        SeoSettingsController.hasChanges = false;
                    }).error(function () {
                        _this.errorMessage = "An error occurred when trying to update SEO settings.";
                    });
                };
                SeoSettingsController.prototype.generateTree = function (pages, contentKey) {
                    var _this = this;
                    var nodeArray = [];
                    var nodes = pages.filter(function (x) { return x["ParentContentKey"] === contentKey; });
                    nodes.forEach(function (n) {
                        var node = {
                            title: n["Title"],
                            key: n["ContentKey"],
                            selected: !n["ExcludeFromSearch"],
                            children: _this.generateTree(pages, n["ContentKey"]),
                            expanded: false
                        };
                        if (node.children.length === 0) {
                            delete node.children;
                        }
                        else {
                            node.expanded = true;
                        }
                        nodeArray.push(node);
                    });
                    return nodeArray;
                };
                SeoSettingsController.prototype.cmsSelectAllClick = function (selected) {
                    $("#cmsTree").fancytree("getTree").visit(function (n) {
                        n.setSelected(selected);
                    });
                };
                SeoSettingsController.prototype.changed = function () {
                    if (!this.changeMessage) {
                        this.changeMessage = "You have unsaved changes.";
                        SeoSettingsController.hasChanges = true;
                        this.successMessage = null;
                    }
                };
                SeoSettingsController.hasChanges = false;
                SeoSettingsController.$inject = [
                    "$http",
                    "seoSettingsService",
                    "$scope"
                ];
                return SeoSettingsController;
            })();
            websitesettings.SeoSettingsController = SeoSettingsController;
            ;
            angular.module("insite.console").controller("SeoSettingsController", SeoSettingsController);
        })(websitesettings = console.websitesettings || (console.websitesettings = {}));
    })(console = insite.console || (insite.console = {}));
})(insite || (insite = {}));
// triggers the unsaved changes dialog
function hasChanges() {
    return insite.console.websitesettings.SeoSettingsController.hasChanges;
}
//# sourceMappingURL=insite.seosettings.controller.js.map