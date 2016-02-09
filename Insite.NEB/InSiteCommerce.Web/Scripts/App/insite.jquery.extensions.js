﻿jQuery.fn.removePrefixedClasses = function (prefix) {
    var $this = $(this);

    var classAttr = $this.attr("class");
    if (classAttr === undefined || classAttr === null)
        classAttr = "";

    var classNames = classAttr.split(" "),
        className,
        newClassNames = [],
        i;

    for (i = 0; i < classNames.length; i++) {
        className = classNames[i];
        // if prefix not found at the beggining of class name
        if (className.indexOf(prefix) !== 0) {
            newClassNames.push(className);
            continue;
        }
    }

    $this.attr("class", newClassNames.join(" "));

    return this;
};

jQuery.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    jQuery.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || "");
        } else {
            o[this.name] = this.value || "";
        }
    });
    return o;
};

jQuery.fn.ajaxRefresh = function (callback) {
    var $this = this;
    jQuery.get(this.attr("data-refreshUrl"), function (html) {
        $this.html(html);
        if (typeof (callback) === "function") {
            callback();
        }
    });
};

jQuery.ajaxPostJson = function (url, json, callback) {
    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(json),
        contentType: "application/json; charset=utf-8",
        success: callback
    });
};

jQuery.fn.ajaxPostJson = function (json, callback) {
    var url = this.attr("action");
    if (url === "" || typeof (url) === "undefined") {
        url = this.attr("href");
    }
    $.ajaxPostJson(url, json, callback);
};

jQuery.fn.ajaxPost = function (callback) {
    jQuery.post(this.attr("action"), this.serialize(), callback);
};

jQuery.fn.ajaxGet = function (callback) {
    jQuery.get(this.attr("action"), this.serialize(), callback);
};

jQuery.loading = (function () {
    var isLoading = false;
    var $loading;
    var $pageOverlay;
    var $window;

    var that = {};

    that.showOverlay = function (onTop) {
        $pageOverlay = $("#pageOverlay");
        if ($pageOverlay.length === 0) {
            $("body").append("<div id='pageOverlay'></div>");
            $pageOverlay = $("#pageOverlay");
        }
        $pageOverlay.height(Math.max($("body").height(), $window.height())).width($window.width());
        $pageOverlay.fadeIn("fast");

        if (onTop) {
            $pageOverlay.css("z-index", "10000");
        }

        $pageOverlay.unbind("click").click(function (event) {
            event.stopPropagation();
        });
    };

    that.hideOverlay = function (moveToBackground) {
        if (moveToBackground && $pageOverlay)
            $pageOverlay.css("z-index", "");
        if (!moveToBackground && $pageOverlay) {
            $pageOverlay.css("z-index", "");
            $pageOverlay.fadeOut(function () { });
        }
    }

    that.show = function (onTop) {
        if (!isLoading) {
            isLoading = true;

            var html = "<div class='spinner'><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div>";

            $("body").append(html);
            $loading = $(".spinner");

            $window = $(window);

            var loadingTop = Math.round(($window.height() / 2) - ($loading.height() / 2) + $("html").scrollTop()) + "px";
            var loadingLeft = Math.round(($window.width() / 2) - ($loading.width() / 2)) + "px";
            that.showOverlay(onTop);
            $loading.css({ "top": loadingTop, "left": loadingLeft });
            $loading.fadeIn("fast");
        }
    };

    that.hide = function (hideOverlay) {
        that.hideOverlay(true);
        hideOverlay = typeof hideOverlay !== "undefined" ? hideOverlay : true;
        if (isLoading) {
            setTimeout(function () {
                isLoading = false;
                if (hideOverlay) {
                    that.hideOverlay();
                }

                $loading.fadeOut(function () {
                    $loading.remove();
                    $loading = null;
                });
            }, 300);
        }
    };

    return that;
})();