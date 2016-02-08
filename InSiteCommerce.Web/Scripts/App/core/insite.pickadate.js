/// <reference path="../../typings/angularjs/angular.d.ts" />
// A directive wrapper for pickadate.js 
// value gets set to a iso formatted non localized date or null, which webapi will derserialize correctly.
// usage:  <input type="text" value="" class="datepicker txt" pick-a-date="vm.fromDate" min-date="vm.mindate" update="vm.updateCallback()"  />
var insite;
(function (insite) {
    var core;
    (function (core) {
        "use strict";
        angular.module('insite').directive('iscPickADate', [
            '$filter',
            function ($filter) {
                var directive = {
                    restrict: "A",
                    scope: {
                        iscPickADate: '=',
                        minDate: '=',
                        maxDate: '=',
                        pickADateOptions: '=',
                        update: '&' // set this attribute to call a parent scope method when the date is updated
                    },
                    link: function (scope, element, attrs) {
                        var options = $.extend(scope.pickADateOptions || {}, {
                            onSet: function (e) {
                                if (scope.$$phase || scope.$root.$$phase)
                                    return;
                                var select = element.pickadate('picker').get('select'); // selected date
                                scope.$apply(function () {
                                    if (e.hasOwnProperty('clear')) {
                                        scope.iscPickADate = '';
                                        if (scope.update)
                                            scope.update();
                                        return;
                                    }
                                    if (select) {
                                        // pass the pick-a-date selection to the scope variable
                                        scope.iscPickADate = select.obj.toISOString();
                                    }
                                });
                            },
                            onClose: function () {
                                element.blur();
                                if (scope.update)
                                    scope.update();
                            },
                            selectYears: true
                        });
                        element.pickadate(options);
                        element.pickadate('picker').set('min', scope.minDate ? scope.minDate : false);
                        element.pickadate('picker').set('max', scope.maxDate ? scope.maxDate : false);
                        // this watch is needed to update the UI when the scope variable pickADate is updated external (initial values and clearing)
                        // override the default pickadate formatting with a regular angular filtered date            
                        scope.$watch('iscPickADate', function (newValue, oldValue) {
                            if (!newValue) {
                                element.prop("value", "");
                            }
                            else {
                                var date = new Date(newValue);
                                element.pickadate('picker').set('select', date);
                                element.prop("value", $filter('date')(date, 'shortDate'));
                            }
                        }, true);
                        scope.$watch('minDate', function (newValue, oldValue) {
                            element.pickadate('picker').set('min', newValue ? newValue : false);
                        }, true);
                        scope.$watch('maxDate', function (newValue, oldValue) {
                            element.pickadate('picker').set('max', newValue ? newValue : false);
                        }, true);
                    }
                };
                return directive;
            }
        ]);
    })(core = insite.core || (insite.core = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.pickadate.js.map