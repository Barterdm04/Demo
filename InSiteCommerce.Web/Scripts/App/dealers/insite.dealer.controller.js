var insite;
(function (insite) {
    var dealers;
    (function (dealers) {
        "use strict";
        var DealerController = (function () {
            function DealerController($scope, dealerService, coreService, $sce) {
                this.$scope = $scope;
                this.dealerService = dealerService;
                this.coreService = coreService;
                this.$sce = $sce;
                this.init();
            }
            DealerController.prototype.init = function () {
                this.initializeMap();
            };
            // fetches the dealers from the dealerService after the Google maps api is initialized. 
            DealerController.prototype.initializeMap = function () {
                var _this = this;
                this.$scope.$on("mapInitialized", function () {
                    _this.dealerService.getDealer(_this.coreService.getQueryStringParameter("dealerId", true)).then(function (dealerResult) {
                        _this.dealer = dealerResult;
                        _this.dealer.htmlContent = _this.$sce.trustAsHtml(_this.dealer.htmlContent);
                        var latlong = new google.maps.LatLng(_this.dealer.latitude, _this.dealer.longitude);
                        var richMarker = new RichMarker({ position: latlong, map: _this.$scope.map, flat: true, draggable: false, content: '<span class="home-marker"></span>' });
                        _this.$scope.map.setCenter(latlong);
                        _this.addressForDirections = dealerResult.address1 + " " + dealerResult.address2 + ", " + dealerResult.city + ", " + dealerResult.state + " " + dealerResult.postalCode;
                    });
                });
            };
            DealerController.$inject = [
                "$scope",
                "dealerService",
                "coreService",
                "$sce"
            ];
            return DealerController;
        })();
        dealers.DealerController = DealerController;
        angular.module("insite").controller("DealerController", DealerController);
    })(dealers = insite.dealers || (insite.dealers = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.dealer.controller.js.map