/*global brackets, define, window*/

define(function (require) {
    "use strict";

    // register es6 as javascript file extension in Brackets
    var LanguageManager = brackets.getModule("language/LanguageManager");
    if (LanguageManager.getLanguageForExtension("es6") == null) {
        LanguageManager.getLanguageForExtension("js").addFileExtension("es6");
    }

    require("dist/browser-polyfill");
    require("dist/main")();

    if (window.isBracketsTestWindow) {
        var extensionInfo = JSON.parse(require("text!package.json"));
        var testObj = window[extensionInfo.name] = {};
        /*jshint sub:true*/
        //-build:from
        testObj["browser-polyfill"] = require("dist/browser-polyfill");
        testObj["class/Logger"] = require("dist/class/Logger");
        testObj["main"] = require("dist/main");
        testObj["thirdparty/co"] = require("dist/thirdparty/co");
        //-build:to
        /*jshint sub:false*/
    }

});
