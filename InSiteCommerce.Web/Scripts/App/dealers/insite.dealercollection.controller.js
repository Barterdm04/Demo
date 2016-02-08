var insite;
(function (insite) {
    var dealers;
    (function (_dealers) {
        "use strict";
        var DealerCollectionController = (function () {
            function DealerCollectionController($scope, $q, dealerService) {
                this.$scope = $scope;
                this.$q = $q;
                this.dealerService = dealerService;
                this.locationKnown = true;
                this.markers = new Array();
                this.init();
            }
            DealerCollectionController.prototype.init = function () {
                this.initializeMap();
            };
            // fetches the dealers from the dealerService checking for a search field.
            DealerCollectionController.prototype.getDealers = function () {
                var _this = this;
                if (!this.$scope.dealerSearchForm.$valid) {
                    return;
                }
                this.pagination.currentPage = 1;
                if ((typeof this.addressSearchField != "undefined") && (this.addressSearchField.trim())) {
                    // resolve an address
                    this.dealerService.getGeoCode(this.addressSearchField).then(function (geoCodingResult) {
                        if (geoCodingResult.status === google.maps.GeocoderStatus.ZERO_RESULTS) {
                            _this.locationKnown = false;
                            return;
                        }
                        _this.locationKnown = true;
                        var geoCodeResults = geoCodingResult.result;
                        if (typeof geoCodeResults[0].formatted_address != "undefined") {
                            // go ahead and make the input box nicer.
                            _this.addressSearchField = geoCodeResults[0].formatted_address;
                        }
                        var coords = new google.maps.LatLng(geoCodeResults[0].geometry.location.lat(), geoCodeResults[0].geometry.location.lng());
                        _this.dealerService.getDealerCollection(_this.getFilter(coords)).then(function (result) {
                            _this.setMap(result);
                        });
                    });
                }
                else {
                    // get from the browser
                    this.searchDealers();
                }
            };
            DealerCollectionController.prototype.searchDealers = function () {
                var _this = this;
                this.getCoords().then(function (coords) {
                    _this.dealerService.getDealerCollection(_this.getFilter(coords)).then(function (result) {
                        _this.setMap(result);
                    });
                });
            };
            // retrieves the default geoLocation if one is not currently set
            DealerCollectionController.prototype.getCoords = function () {
                var deferred = this.$q.defer();
                if (this.center)
                    deferred.resolve(this.center);
                else {
                    this.dealerService.getGeoLocation().then(deferred.resolve);
                }
                return deferred.promise;
            };
            DealerCollectionController.prototype.getFilter = function (coords) {
                this.center = coords;
                var filter = {
                    name: this.storeName,
                    latitude: coords.lat(),
                    longitude: coords.lng()
                };
                if (this.pagination) {
                    filter.pageSize = this.pagination.pageSize;
                    filter.startPage = this.pagination.currentPage;
                }
                return filter;
            };
            // Creates the html for the marker pop-up 
            DealerCollectionController.prototype.getMarkerPopupHtml = function (dealer) {
                var dealerInfo = "<div class='dealer-win'><div class='dealer-deetz'><div class='dealer-name'><a href='/DealerLocator/Dealer?dealerId=" + dealer.dealerId + "'>" + dealer.name + "</a></div><div class='dealer-addy'>" + dealer.address1 + "<br />";
                if (dealer.address2) {
                    dealerInfo += dealer.address2 + "<br />";
                }
                dealerInfo += dealer.city + ", " + dealer.state + " " + dealer.postalCode + "<br />" + dealer.phone + "</div>";
                if (dealer.htmlContent) {
                    dealerInfo += "<div class='dealer-hours-map'><h4>Hours</h4><div>" + dealer.htmlContent + "</div></div>";
                }
                dealerInfo += "<a href='http://maps.google.com/maps?daddr=" + dealer.address1 + " " + dealer.address2 + ", " + dealer.city + ", " + dealer.state + " " + dealer.postalCode + "' class='dealer-directions'>Directions</a>";
                if (dealer.webSiteUrl) {
                    dealerInfo += "<span><a href='" + dealer.webSiteUrl + "' class='dealer-www' target='_blank'>Website</a></span>";
                }
                if (dealer.distanceUnitOfMeasure === "Imperial") {
                    dealerInfo += "<span class='dealer-distance miles'>" + (dealer.distance).toFixed(2) + " mi</span>";
                }
                else {
                    dealerInfo += "<span class='dealer-distance kilometers'>" + (dealer.distance * 1.60934).toFixed(2) + " km</span>";
                }
                dealerInfo += "</div></div></div>";
                return dealerInfo;
            };
            // fetches the dealers from the dealerService after the Google maps api is initialized. 
            DealerCollectionController.prototype.initializeMap = function () {
                var _this = this;
                this.$scope.$on("mapInitialized", function () {
                    _this.searchDealers();
                });
            };
            // Adds the current location with special marker to the map. It's important that setHomeLocation is called before setMarkers 
            // in order to clear any existing markers from the map.
            DealerCollectionController.prototype.setHomeLocation = function (address) {
                var _this = this;
                for (var m = 0; m < this.markers.length; m++) {
                    this.markers[m].setMap(null);
                }
                var latlong = new google.maps.LatLng(this.center.lat(), this.center.lng());
                var markerOption = {
                    position: latlong,
                    map: this.$scope.map,
                    flat: true,
                    draggable: false,
                    content: "<span class='home-marker'></span>"
                };
                var richMarker = new RichMarker(markerOption);
                google.maps.event.addListener(richMarker, "click", function () {
                    if (_this.infoWindow) {
                        _this.infoWindow.close();
                    }
                    _this.infoWindow = new google.maps.InfoWindow();
                    _this.infoWindow.setContent("Your current location.<br/>" + address);
                    _this.infoWindow.open(_this.$scope.map, richMarker);
                });
                this.markers.push(richMarker);
            };
            // sets home/store markers, updates pagination and centers the map.
            DealerCollectionController.prototype.setMap = function (result) {
                if ((typeof this.center === "undefined") || (this.center && this.center.lat() === 0 && this.center.lng() === 0)) {
                    // this is the default lat lng
                    this.center = new google.maps.LatLng(result.defaultLatitude, result.defaultLongitude);
                }
                this.pagination = result.pagination;
                this.$scope.map.setCenter(this.center);
                this.setHomeLocation(result.formattedAddress);
                var currentMarkers = this.setMarkers(result.dealers);
                this.addressSearchField = result.formattedAddress;
                this.dealers = result.dealers;
                this.distanceUnitOfMeasure = result.distanceUnitOfMeasure === "Metric" ? 1 : 0;
                this.fitBounds(currentMarkers);
            };
            // Creates the RichMarkers and generates the html for the marker pop-up
            DealerCollectionController.prototype.setMarkers = function (dealers) {
                var _this = this;
                var markers = new Array();
                dealers.forEach(function (dealer, i) {
                    var markerOptions = {
                        position: new google.maps.LatLng(dealer.latitude, dealer.longitude),
                        map: _this.$scope.map,
                        flat: true,
                        draggable: false,
                        content: "<span class='loc-marker'><span>" + _this.getDealerNumber(i) + "</span></span>"
                    };
                    var richMarker = new RichMarker(markerOptions);
                    google.maps.event.addListener(richMarker, "click", function () {
                        if (_this.infoWindow) {
                            _this.infoWindow.close();
                        }
                        _this.infoWindow = new google.maps.InfoWindow();
                        _this.infoWindow.setContent(_this.getMarkerPopupHtml(dealer));
                        _this.infoWindow.open(_this.$scope.map, richMarker);
                    });
                    markers.push(richMarker);
                    _this.markers.push(richMarker);
                });
                return markers;
            };
            DealerCollectionController.prototype.getDealerNumber = function (index) {
                return index + 1 + (this.pagination.pageSize * (this.pagination.currentPage - 1));
            };
            DealerCollectionController.prototype.fitBounds = function (currentMarkers) {
                if (this.$scope.map != null) {
                    var bounds = new google.maps.LatLngBounds();
                    for (var i = 0, markersLength = currentMarkers.length; i < markersLength; i++) {
                        bounds.extend(currentMarkers[i].position);
                    }
                    // Extends the bounds when we have only one marker to prevent zooming in too far.
                    if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
                        var extendPoint1 = new google.maps.LatLng(bounds.getNorthEast().lat() + 0.03, bounds.getNorthEast().lng() + 0.03);
                        var extendPoint2 = new google.maps.LatLng(bounds.getNorthEast().lat() - 0.03, bounds.getNorthEast().lng() - 0.03);
                        bounds.extend(extendPoint1);
                        bounds.extend(extendPoint2);
                    }
                    this.$scope.map.setCenter(bounds.getCenter());
                    this.$scope.map.fitBounds(bounds);
                }
            };
            DealerCollectionController.$inject = [
                "$scope",
                "$q",
                "dealerService"
            ];
            return DealerCollectionController;
        })();
        _dealers.DealerCollectionController = DealerCollectionController;
        angular.module("insite").controller("DealerCollectionController", DealerCollectionController);
    })(dealers = insite.dealers || (insite.dealers = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.dealercollection.controller.js.map