var insite = insite || {};

insite.incontext = function($) {
    "use strict";
    var internal = {};
    var that = insite.contentCore($, internal);
    var windowProxy = new Porthole.WindowProxy("/scripts/libraries/porthole/proxy.html");
    windowProxy.addEventListener(function (messageEvent) {
        switch (messageEvent.data.action) {
            case internal.signOut:
                angular.injector(["ng", "insite"]).get("sessionService").signOut().then(function () {
                        windowProxy.post({
                            action: internal.signOut
                        });
                    });
                
                break;
            case internal.rearrangeItems:
                $(".cms-rearrangeable").addClass("cms-rearrangingItems").find(".cms-zone").sortable({
                    handle: ".cms-moveHandle",
                    connectWith: ".cms-zone",
                    placeholder: "ui-sortable-placeholder",
                    cursorAt: { right: 10, top: 10 },
                    update: function (event, ui) {
                        internal.updateSortOrder(ui.item);
                    }
                });
                break;
            case internal.saveRearrange:
                that.showLoading();
                var zones = [];
                $(".cms-zone").each(function () {
                    var $zone = $(this);
                    zones.push({
                        Zone: $zone.attr("data-zone"),
                        ContentItemId: $zone.attr("data-contentItemId"),
                        Children: $.map($zone.find("> .cms-contentItem"), function (o) {
                            return {
                                ContentItemId: $(o).attr("data-contentItemId"),
                                SortOrder: $(o).attr("data-sortOrder")
                            };
                        })
                    });
                });

                $.ajaxPostJson(messageEvent.data.url, zones, function () {
                    that.hideLoading();
                    window.location = window.location;
                });
                break;
            default:
                console.log("Nothing set up to handle action" + messageEvent.data.action + " value: " + messageEvent.data.value);
                break;
        }

    });

    that.showLoading = function() {
        windowProxy.post({
            action: internal.showLoadingAction
        });
    };

    that.hideLoading = function() {
        windowProxy.post({
            action: internal.hideLoadingAction
        });
    };

    that.updateAdminShell = function (adminShellModel) {
        windowProxy.post({
            action: internal.updateAdminShellAction,
            value: adminShellModel
        });
    };

    that.loadShellModal = function (url) {
        windowProxy.post({
            action: internal.loadShellModalAction,
            value: { url: url }
        });
    };

    that.loadSlidePanel = function (url) {
        windowProxy.post({
            action: internal.loadSlidePanelAction,
            value: { url: url }
        });
    };

    that.checkPopupOverlap = function (popup) {
        var popupTop = popup.offset().top;
        if (popupTop < 0) {
            popup.addClass("pushDown");
            return;
        }
        var headerOffset = $("#header").offset();
        if (headerOffset) {
            var headerTop = headerOffset.top;
            if (headerTop > popupTop && ((headerTop - popupTop) < popup.height())) {
                popup.addClass("pushDown");
            }
        }
    };

    that.setup = function() {
        $(".cms-displayInfo").click(function (e) {
            e.preventDefault();
            var container = $(this).parents(".cms-contentItemInfo").toggleClass("cms-showInfoPop");
            if (container.hasClass("cms-showInfoPop")) {
                that.checkPopupOverlap(container.find(".cms-infoPop"));
            }
        });
        $(".cms-closeInfo").click(function (e) {
            e.preventDefault();
            var $el = $(this).parents(".cms-contentItemInfo").removeClass("cms-showInfoPop");
            $el.find(".cms-infoPop").removeClass("pushDown");
        });
        $(".cms-loadShellModal").click(function (e) {
            e.preventDefault();
            that.loadShellModal($(this).attr("href"));
        });
        $(".cms-loadSlidePanel").click(function (e) {
            e.preventDefault();
            that.loadSlidePanel($(this).attr("href"));
        });
    };

    return that;
}(jQuery);