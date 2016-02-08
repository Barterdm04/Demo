var insite;
(function (insite) {
    var budget;
    (function (budget) {
        "use strict";
        var BudgetController = (function () {
            function BudgetController($window, $scope, $timeout, coreService, budgetService, budgetCalendarService, accountService, customerService) {
                this.$window = $window;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.coreService = coreService;
                this.budgetService = budgetService;
                this.budgetCalendarService = budgetCalendarService;
                this.accountService = accountService;
                this.customerService = customerService;
                this.budgetsFromOnlineOnly = false;
                this.sortDirection = 1;
                this.currentYear = new Date().getFullYear();
                this.budgetYears = [];
                this.maintenanceUser = {};
                this.maintenanceShipTo = {};
                this.reviewUser = {};
                this.reviewShipTo = {};
                this.periodCount = 13;
                this.init();
            }
            BudgetController.prototype.init = function () {
                var _this = this;
                this.getBudgetCalendar();
                this.getCostCodes();
                this.getAccounts();
                this.getShipTos();
                this.fillBudgetYears(this.currentYear, 5);
                this.maintenanceBudgetYear = this.currentYear;
                this.reviewBudgetYear = this.currentYear;
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.budgetsFromOnlineOnly = data.customerSettings.budgetsFromOnlineOnly;
                });
            };
            BudgetController.prototype.getAccounts = function () {
                var _this = this;
                this.accountService.getAccounts().success(function (result) {
                    _this.accounts = result.accounts;
                });
            };
            BudgetController.prototype.getShipTos = function () {
                var _this = this;
                this.customerService.getShipTos().success(function (result) {
                    _this.shipTos = result.shipTos;
                });
            };
            BudgetController.prototype.fillBudgetYears = function (currentYear, years) {
                for (var i = 0; i < years; i++) {
                    this.budgetYears.push(currentYear + i);
                }
            };
            BudgetController.prototype.getBudgetCalendar = function () {
                var _this = this;
                this.selectedBudgetYear = this.calendar ? this.calendar.fiscalYear : this.currentYear;
                this.budgetCalendarService.getBudgetCalendar(this.selectedBudgetYear).then(function (result) {
                    _this.calendar = result;
                    $("#FiscalYearEndDate").attr("data-mindate", new Date(_this.calendar.fiscalYear, 0, 1).toString()).attr("data-maxdate", new Date(_this.calendar.fiscalYear + 1, 11, 31).toString());
                    _this.calendarCalculate();
                    _this.addPeriod();
                });
            };
            BudgetController.prototype.getCostCodes = function () {
                var _this = this;
                this.customerService.getBillTo("costcodes").success(function (result) {
                    _this.billTo = result;
                    _this.enforcementLevel = result.budgetEnforcementLevel;
                });
            };
            BudgetController.prototype.updateBudgetCalendar = function () {
                var _this = this;
                this.calendar.budgetPeriods = jQuery.map(this.calendar.budgetPeriods, function (d) {
                    if (d) {
                        return new Date(d.toString());
                    }
                    return undefined;
                });
                this.budgetCalendarService.updateBudgetCalendar(this.calendar).then(function (result) {
                    _this.displaySavedModel();
                    _this.calendarCalculate();
                    _this.addPeriod();
                });
            };
            BudgetController.prototype.displaySavedModel = function () {
                this.coreService.displayModal(angular.element("#budgets-saved-popup"));
            };
            BudgetController.prototype.updateBudgetEnforcementLevel = function () {
                var _this = this;
                this.customerService.updateEnforcementLevel({
                    budgetEnforcementLevel: this.billTo.budgetEnforcementLevel,
                    uri: this.billTo.uri
                }).then(function (result) {
                    _this.enforcementLevel = _this.billTo.budgetEnforcementLevel;
                    _this.displaySavedModel();
                });
            };
            BudgetController.prototype.addCostCode = function () {
                if (this.canAddCostCodeRow()) {
                    this.billTo.costCodes.push({ costCode: "" });
                }
            };
            BudgetController.prototype.canAddCostCodeRow = function () {
                if (!this.billTo) {
                    return false;
                }
                for (var i = 0; i < this.billTo.costCodes.length; i++) {
                    if (this.billTo.costCodes[i].costCode.length === 0) {
                        return false;
                    }
                }
                return true;
            };
            BudgetController.prototype.sortStatusColumn = function () {
                var _this = this;
                this.sortDirection *= -1;
                this.billTo.costCodes.sort(function (a, b) {
                    var row1SortValue = a.isActive, row2SortValue = b.isActive;
                    if (b.costCode === "" || a.costCode === "") {
                        return 0;
                    }
                    if (row1SortValue < row2SortValue) {
                        return -1 * _this.sortDirection;
                    }
                    if (row1SortValue > row2SortValue) {
                        return 1 * _this.sortDirection;
                    }
                    return 0;
                });
            };
            BudgetController.prototype.updateCostCodes = function () {
                var _this = this;
                this.customerService.updateBillTo({
                    costCodeTitle: this.billTo.costCodeTitle,
                    costCodes: this.billTo.costCodes,
                    uri: this.billTo.uri,
                }).then(function (result) {
                    _this.displaySavedModel();
                });
            };
            BudgetController.prototype.updatePeriods = function () {
                var tempDates = jQuery.map($("input.txt.startdate"), function (a) {
                    return a.value ? new Date(a.value) : undefined;
                });
                this.calendar.budgetPeriods = jQuery.grep(tempDates, function (x) {
                    return x != undefined;
                });
                this.calendar.fiscalYearEndDate = $("input#FiscalYearEndDate").val();
                this.calendarCalculate();
                this.addPeriod();
                this.$scope.$apply();
            };
            BudgetController.prototype.canAddPeriod = function () {
                if (this.calendar && this.calendar.budgetPeriods) {
                    for (var i = 0; i < this.calendar.budgetPeriods.length; i++) {
                        if (!this.calendar.budgetPeriods[i]) {
                            return false;
                        }
                    }
                    return this.calendar.budgetPeriods.length < 13;
                }
                return false;
            };
            BudgetController.prototype.assignCalendarMonths = function () {
                this.calendar.budgetPeriods = [];
                for (var i = 0; i < 12; i++) {
                    this.calendar.budgetPeriods.push(new Date(this.calendar.fiscalYear, i, 1));
                }
                this.calendarCalculate();
                this.addDateTimePicker();
            };
            BudgetController.prototype.calendarCalculate = function () {
                this.budgetEndPeriods = jQuery.grep(this.calendar.budgetPeriods, function (x) {
                    return x != undefined;
                });
                for (var i = 0; i < this.budgetEndPeriods.length; i++) {
                    if ((i === this.budgetEndPeriods.length - 1)) {
                        this.budgetEndPeriods[i] = this.getYearEnd(this.calendar.fiscalYear, this.calendar.fiscalYearEndDate);
                    }
                    else {
                        var t = new Date(this.budgetEndPeriods[i + 1].toString());
                        t.setDate(t.getDate() - 1);
                        this.budgetEndPeriods[i] = t;
                    }
                }
            };
            BudgetController.prototype.maintenanceViewBudget = function () {
                var _this = this;
                this.budgetService.getReviews(this.maintenanceUser.id, this.maintenanceShipTo.id, this.maintenanceBudgetYear, false).then(function (result) {
                    _this.maintenanceInfo = result;
                });
            };
            BudgetController.prototype.updateBudgets = function () {
                var _this = this;
                this.budgetService.updateBudget(this.maintenanceInfo).then(function (result) {
                    _this.displaySavedModel();
                });
            };
            BudgetController.prototype.switchFilterInput = function (selectedValue, param, tab) {
                if (selectedValue) {
                    if (param === "user" && tab === "maintenance") {
                        this.maintenanceShipTo = {};
                    }
                    if (param === "shipTo" && tab === "maintenance") {
                        this.maintenanceUser = {};
                    }
                    if (param === "user" && tab === "review") {
                        this.reviewShipTo = {};
                    }
                    if (param === "shipTo" && tab === "review") {
                        this.reviewUser = {};
                    }
                }
                else {
                    if (tab === "maintenance") {
                        this.maintenanceShipTo = {};
                        this.maintenanceUser = {};
                    }
                    if (tab === "review") {
                        this.reviewShipTo = {};
                        this.reviewUser = {};
                    }
                }
            };
            BudgetController.prototype.getEndDate = function (review) {
                if (review) {
                    var date = new Date(review.startDate);
                    date.setDate(date.getDate() - 1);
                    return date;
                }
                return this.getYearEnd(this.maintenanceInfo.fiscalYear, this.maintenanceInfo.fiscalYearEndDate);
            };
            BudgetController.prototype.reviewViewBudget = function () {
                var _this = this;
                this.budgetService.getReviews(this.reviewUser.id, this.reviewShipTo.id, this.reviewBudgetYear, true).then(function (result) {
                    _this.reviewInfo = result;
                });
            };
            BudgetController.prototype.removePeriod = function (value) {
                this.calendar.budgetPeriods.splice(value, 1);
                this.calendarCalculate();
                this.addPeriod();
            };
            BudgetController.prototype.getCalendarPeriodFromDate = function (index) {
                var date;
                if (index === 0) {
                    date = new Date(this.calendar.fiscalYear - 1, 11, 31);
                }
                else {
                    date = new Date(this.calendar.budgetPeriods[index - 1].toString());
                }
                date.setDate(date.getDate() + 1);
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                return date;
            };
            BudgetController.prototype.getCalendarPeriodToDate = function (index) {
                var date;
                if (index === this.calendar.budgetPeriods.length - 1 || !this.calendar.budgetPeriods[index + 1]) {
                    date = this.calendar.fiscalYearEndDate ? new Date(this.calendar.fiscalYearEndDate.toString()) : new Date(this.calendar.fiscalYear + 2, 0, 1);
                }
                else {
                    date = new Date(this.calendar.budgetPeriods[index + 1].toString());
                }
                date.setDate(date.getDate() - 1);
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                return date;
            };
            BudgetController.prototype.addPeriod = function () {
                if (this.canAddPeriod()) {
                    this.calendar.budgetPeriods.push(undefined);
                }
                this.addDateTimePicker();
            };
            BudgetController.prototype.addDateTimePicker = function () {
                var _this = this;
                this.$timeout(function () {
                    _this.datepicker(".datepicker", function () {
                        _this.updatePeriods();
                    });
                    _this.datepickerReset(".startdate, #FiscalYearEndDate");
                }, 0, false);
            };
            BudgetController.prototype.getYearEnd = function (fiscalYear, fiscalYearEndDate) {
                if (!fiscalYearEndDate) {
                    var date = new Date(fiscalYear, 11, 31);
                    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                    return date;
                }
                return fiscalYearEndDate;
            };
            /* date picker code is only used by this controller. others use the directive pick-a-date */
            BudgetController.prototype.pickadateMinMax = function (data) {
                // pickadate allows min/max values of undefined, int (ie. 30 days), or a date which should be passed in according to javascript "new Date()" documentation
                if (typeof data === "undefined")
                    return data;
                return isNaN(data) ? new Date(data) : Number(data);
            };
            BudgetController.prototype.datepicker = function (selector, onCloseCallback, onSetCallback) {
                if (typeof (selector) === "string")
                    selector = $(selector);
                var that = this;
                selector.each(function () {
                    var $this = $(this);
                    that.pickadateMinMax($this.attr("data-mindate"));
                    $this.pickadate({
                        format: "m/d/yyyy",
                        formatSubmit: "m/d/yyyy",
                        selectYears: true,
                        onOpen: function () {
                            $this.blur();
                        },
                        onClose: function () {
                            $this.blur();
                            if (onCloseCallback != undefined)
                                onCloseCallback();
                        },
                        onSet: function () {
                            if (onSetCallback != undefined)
                                onSetCallback();
                        },
                        min: that.pickadateMinMax($this.attr("data-mindate")),
                        max: that.pickadateMinMax($this.attr("data-maxdate"))
                    });
                });
            };
            BudgetController.prototype.datepickerReset = function (selector) {
                if (typeof (selector) === "string")
                    selector = $(selector);
                var that = this;
                selector.each(function () {
                    var $this = $(this);
                    var picker = $this.pickadate("picker");
                    picker.set("min", that.pickadateMinMax($this.attr("data-mindate")));
                    picker.set("max", that.pickadateMinMax($this.attr("data-maxdate")));
                    if ($this.attr("value")) {
                        picker.set("select", that.pickadateMinMax($this.attr("value")));
                    }
                    else {
                        picker.clear();
                    }
                });
            };
            BudgetController.$inject = ["$window", "$scope", "$timeout", "coreService", "budgetService", "budgetCalendarService", "accountService", "customerService"];
            return BudgetController;
        })();
        budget.BudgetController = BudgetController;
        angular.module("insite").controller("BudgetController", BudgetController);
    })(budget = insite.budget || (insite.budget = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.budget.controller.js.map