var insite;
(function (insite) {
    var message;
    (function (_message) {
        "use strict";
        var MessageController = (function () {
            function MessageController($window, $scope, coreService, messageService) {
                this.$window = $window;
                this.$scope = $scope;
                this.coreService = coreService;
                this.messageService = messageService;
                this.readCount = 0;
                this.unreadCount = 0;
                this.showRead = true;
                this.init();
            }
            MessageController.prototype.init = function () {
                this.getMessages();
            };
            MessageController.prototype.isBlank = function (text) {
                return !text || text.trim() === "";
            };
            MessageController.prototype.getMessages = function () {
                var _this = this;
                this.messageService.getMessages().success(function (result) {
                    _this.messages = result.messages;
                    for (var index in _this.messages) {
                        if (_this.messages[index].isRead) {
                            _this.readCount++;
                        }
                        else {
                            _this.unreadCount++;
                        }
                    }
                });
            };
            MessageController.prototype.switchMessageStatus = function ($event, message) {
                message.isRead = !message.isRead;
                if (message.isRead) {
                    this.readCount++;
                    this.unreadCount--;
                }
                else {
                    this.readCount--;
                    this.unreadCount++;
                }
                this.messageService.updateMessage(message);
            };
            MessageController.prototype.switchShowRead = function () {
                this.showRead = !this.showRead;
            };
            MessageController.prototype.expand = function ($event, message) {
                message.isExpand = !message.isExpand;
            };
            MessageController.$inject = ["$window", "$scope", "coreService", "messageService"];
            return MessageController;
        })();
        _message.MessageController = MessageController;
        angular.module("insite").controller("MessageController", MessageController);
    })(message = insite.message || (insite.message = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.message.controller.js.map