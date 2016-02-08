var insite;
(function (insite) {
    var dealers;
    (function (dealers) {
        "use strict";
        var DealerDirectionsController = (function () {
            function DealerDirectionsController($scope, dealerService, coreService, $sce) {
                this.$scope = $scope;
                this.dealerService = dealerService;
                this.coreService = coreService;
                this.$sce = $sce;
                this.init();
            }
            DealerDirectionsController.prototype.init = function () {
                this.initializeMap();
            };
            DealerDirectionsController.prototype.setOrigin = function (geoResult) {
                var _this = this;
                this.geoOrigins = geoResult;
                this.$scope.map.setCenter(this.geoOrigins);
                this.dealerService.getGeoCodeFromLatLng(geoResult.lat(), geoResult.lng()).then(function (result) {
                    _this.addressSearchField = result[0].formatted_address;
                }, function () {
                    // if it errors out, just put the lat/lng in 
                    _this.addressSearchField = geoResult.lat() + ", " + geoResult.lng();
                });
            };
            DealerDirectionsController.prototype.setDestination = function (dealerResult) {
                var _this = this;
                try {
                    this.geoDestination = new google.maps.LatLng(dealerResult.latitude, dealerResult.longitude);
                    var unitSystem;
                    if (dealerResult.distanceUnitOfMeasure === "Imperial") {
                        unitSystem = google.maps.UnitSystem.IMPERIAL;
                    }
                    else {
                        unitSystem = google.maps.UnitSystem.METRIC;
                    }
                    var request = {
                        origin: this.geoOrigins,
                        destination: this.geoDestination,
                        travelMode: google.maps.TravelMode.DRIVING,
                        unitSystem: unitSystem,
                        durationInTraffic: true
                    };
                    this.directionsService = new google.maps.DirectionsService();
                    this.directionsService.route(request, function (response, status) {
                        if (status === google.maps.DirectionsStatus.OK) {
                            _this.directionsDisplay.setDirections(response);
                        }
                    });
                }
                catch (e) {
                }
            };
            // fetches the dealers from the dealerService after the Google maps api is initialized. 
            DealerDirectionsController.prototype.initializeMap = function () {
                var _this = this;
                this.$scope.$on("mapInitialized", function () {
                    _this.dealerService.getGeoLocation().then(function (geoResults) {
                        _this.setOrigin(geoResults);
                        // get the dealer
                        _this.dealerService.getDealer(_this.coreService.getQueryStringParameter("dealerId", true)).then(function (dealerResult) {
                            _this.dealer = dealerResult;
                            _this.dealer.htmlContent = _this.$sce.trustAsHtml(_this.dealer.htmlContent);
                            _this.directionsDisplay = new google.maps.DirectionsRenderer(null);
                            _this.directionsDisplay.setMap(_this.$scope.map);
                            _this.directionsDisplay.setPanel(document.getElementById("directionsPanel"));
                            google.maps.event.addListener(_this.directionsDisplay, "directions_changed", function () {
                                _this.directions = _this.directionsDisplay.getDirections();
                                // $scope.computeTotalDistance(directionsDisplay.getDirections(), dealerResult);
                            });
                            _this.setDestination(dealerResult);
                        }, function (dealerResult) {
                            if (dealerResult === 404) {
                                _this.notFound = true;
                            }
                        });
                    });
                });
            };
            DealerDirectionsController.$inject = [
                "$scope",
                "dealerService",
                "coreService",
                "$sce"
            ];
            return DealerDirectionsController;
        })();
        dealers.DealerDirectionsController = DealerDirectionsController;
        angular.module("insite").controller("DealerDirectionsController", DealerDirectionsController);
    })(dealers = insite.dealers || (insite.dealers = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.dealerdirections.controller.js.map