/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="insite.localstorage.factory.ts" />
module insite.core {
    "use strict";

    export class WindowSessionStorage implements IWindowStorage {

        constructor(protected $window: ng.IWindowService) {
        }

        set(key: string, value: string) {
            this.$window.sessionStorage[key] = value;
        }

        get(key: string, defaultValue: string): string {
            return this.$window.sessionStorage[key] || defaultValue;
        }

        setObject(key: string, value: any) {
            this.$window.sessionStorage[key] = JSON.stringify(value);
        }

        getObject(key: string): any {
            return JSON.parse(this.$window.sessionStorage[key] || "{}");
        }

        remove(key: string) {
            delete this.$window.sessionStorage[key];
        }

        removeAll() {
            this.$window.sessionStorage.clear();
        }

        count(): number {
            return this.$window.sessionStorage.length;
        }
    }

    factory.$inject = ["$window"];
    function factory($window: ng.IWindowService): WindowSessionStorage {
        return new WindowSessionStorage($window);
    }

    angular
        .module("insite")
        .factory("$sessionStorage", factory);
}