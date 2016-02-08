///<reference path="insite.product.service.ts"/>
///<reference path="../../typings/jquery.validation/jquery.validation.d.ts"/>
var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        "use strict";
        var TellAFriendController = (function () {
            function TellAFriendController($scope, emailService) {
                this.$scope = $scope;
                this.emailService = emailService;
                this.init();
            }
            TellAFriendController.prototype.init = function () {
                var _this = this;
                angular.element("#TellAFriendDialogContainer").foundation("reveal", {
                    "close": function () {
                        _this.shareModel = _this.shareModel || {};
                        _this.shareModel.friendsName = "";
                        _this.shareModel.friendsEmail = "";
                        _this.shareModel.yourName = "";
                        _this.shareModel.yourEmail = "";
                        _this.shareModel.yourMessage = "";
                        _this.isSuccess = false;
                        _this.isError = false;
                        _this.$scope.$apply();
                    }
                });
            };
            TellAFriendController.prototype.shareWithFriend = function () {
                var _this = this;
                var valid = angular.element("#tellAFriendForm").validate().form();
                if (!valid) {
                    return;
                }
                var tellAFriendInfo = {
                    friendsName: this.shareModel.friendsName,
                    friendsEmailAddress: this.shareModel.friendsEmail,
                    yourName: this.shareModel.yourName,
                    yourEmailAddress: this.shareModel.yourEmail,
                    yourMessage: this.shareModel.yourMessage,
                    productId: this.product.id,
                    productImage: this.product.mediumImagePath,
                    productShortDescription: this.product.shortDescription,
                    altText: this.product.altText,
                    productUrl: this.product.productDetailUrl
                };
                var tellAFriendInfoJs = angular.toJson(tellAFriendInfo);
                this.emailService.tellAFriend(tellAFriendInfoJs).then(function (result) {
                    _this.isSuccess = true;
                    _this.isError = false;
                }, function (error) {
                    _this.isSuccess = false;
                    _this.isError = true;
                });
            };
            TellAFriendController.$inject = ["$scope", "EmailService"];
            return TellAFriendController;
        })();
        catalog.TellAFriendController = TellAFriendController;
        angular.module("insite").controller("TellAFriendController", TellAFriendController);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.tellafriend.controller.js.map