var insite;
(function (insite) {
    var dealers;
    (function (dealers) {
        "use strict";
        var DealerService = (function () {
            function DealerService($http, $q) {
                this.$http = $http;
                this.$q = $q;
                this.serviceUri = "/api/v1/dealers";
            }
            DealerService.prototype.getGeoCodeFromLatLng = function (lat, lng) {
                var deferredGeo = this.$q.defer();
                var latlng = new google.maps.LatLng(lat, lng);
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ address: "", latLng: latlng }, deferredGeo.resolve);
                return deferredGeo.promise;
            };
            DealerService.prototype.getGeoCode = function (addressSearch) {
                var deferredGeo = this.$q.defer();
                if (typeof addressSearch != "undefined") {
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ address: addressSearch }, function (result, status) { return deferredGeo.resolve({
                        result: result,
                        status: status
                    }); });
                }
                return deferredGeo.promise;
            };
            DealerService.prototype.getGeoLocation = function () {
                var deferredGeo = this.$q.defer();
                var response = new google.maps.LatLng(0, 0);
                // ok no geoCoder so grab the geolocation from the browser if available.
                if (!navigator.geolocation) {
                    deferredGeo.resolve(response);
                    return deferredGeo.promise;
                }
                var defaultLocationTimer = setTimeout(function () {
                    deferredGeo.resolve(response);
                }, 250);
                navigator.geolocation.getCurrentPosition(function (position) {
                    clearTimeout(defaultLocationTimer);
                    response = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    deferredGeo.resolve(response);
                }, function () {
                    clearTimeout(defaultLocationTimer);
                    deferredGeo.resolve(response);
                });
                return deferredGeo.promise;
            };
            DealerService.prototype.getDealerCollection = function (filter) {
                var deferred = this.$q.defer();
                var uri = this.serviceUri;
                // add filters
                if (filter) {
                    uri += "?";
                    for (var property in filter) {
                        if (filter.hasOwnProperty(property)) {
                            if (filter[property]) {
                                uri += property + "=" + filter[property] + "&";
                            }
                        }
                    }
                }
                this.$http.get(uri).success(function (result) {
                    var latlng = new google.maps.LatLng(result.defaultLatitude, result.defaultLongitude);
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ address: "", latLng: latlng }, function (geoResults, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            result.formattedAddress = geoResults[0].formatted_address;
                            return deferred.resolve(result);
                        }
                    });
                    //return deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            DealerService.prototype.getDealer = function (dealerId) {
                var deferred = this.$q.defer();
                var uri = this.serviceUri + "/" + dealerId;
                this.$http.get(uri).success(function (result) {
                    var latlng = new google.maps.LatLng(result.latitude, result.longitude);
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ address: "", latLng: latlng }, function (geoResults, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            return deferred.resolve(result);
                        }
                        return deferred.reject(result);
                    });
                }).error(function (result, status, headers, config) {
                    return deferred.reject(status);
                });
                return deferred.promise;
            };
            DealerService.$inject = ["$http", "$q"];
            return DealerService;
        })();
        dealers.DealerService = DealerService;
        angular.module("insite").service("dealerService", DealerService);
    })(dealers = insite.dealers || (insite.dealers = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.dealers.service.js.map