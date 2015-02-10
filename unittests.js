/*global brackets, define, describe, beforeEach, afterEach, runs*/

define(function (require, exports, module) {
    "use strict";

    var SpecRunnerUtils = brackets.getModule("spec/SpecRunnerUtils"),
        FileUtils       = brackets.getModule("file/FileUtils");

    var extensionInfo   = JSON.parse(require("text!package.json")),
        testSuites = [
            //-build:from
            require("test/dist/Base-test"),
            require("test/dist/Logger-test")
            //-build:to
        ];

    describe(extensionInfo.title, function () {
        var testFolder = FileUtils.getNativeModuleDirectoryPath(module) + "/test/unittest-files/",
            testWindow;

        beforeEach(function () {

            runs(function () {
                SpecRunnerUtils.createTestWindowAndRun(this, function (w) {
                    testWindow = w;
                });
            });

            runs(function () {
                SpecRunnerUtils.loadProjectInTestWindow(testFolder);
            });

        });

        afterEach(function () {

            testWindow = null;
            SpecRunnerUtils.closeTestWindow();

        });

        function getTestWindow() {
            return testWindow;
        }

        function getModule(moduleName) {
            return testWindow[extensionInfo.name][moduleName];
        }

        testSuites.forEach(function (testSuite) {
            testSuite(getTestWindow, getModule);
        });

    });
});
