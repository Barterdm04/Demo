var insite;
(function (insite) {
    var message;
    (function (_message) {
        "use strict";
        var MessageService = (function () {
            function MessageService($http, $q, coreService) {
                this.$http = $http;
                this.$q = $q;
                this.coreService = coreService;
                this.messageServiceUri = this.coreService.getApiUri("/api/v1/messages/");
            }
            MessageService.prototype.getMessages = function () {
                return this.$http.get(this.messageServiceUri);
            };
            MessageService.prototype.updateMessage = function (message) {
                return this.$http({
                    method: "PATCH",
                    url: message.uri,
                    data: message
                });
            };
            MessageService.$inject = ["$http", "$q", "coreService"];
            return MessageService;
        })();
        _message.MessageService = MessageService;
        angular.module("insite").service("messageService", MessageService);
    })(message = insite.message || (insite.message = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.message.service.js.map