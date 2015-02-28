/*global module,require*/

var fs = require("fs");
var glob = require("glob");

module.exports = function (grunt) {
    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        watch: {
            files: ["Gruntfile.js", "src/**/*.{jsx,es6}", "test/spec/**/*.{jsx,es6}"],
            tasks: ["build"]
        },
        jshint: {
            files: ["Gruntfile.js", "src/**/*.{js,jsx,es6}", "test/spec/**/*.{js,jsx,es6}"],
            options: {
                jshintrc: true,
                ignores: ["src/thirdparty/**/*.{js,jsx,es6}"]
            }
        },
        lineending: {
            src: {
                options: {
                    eol: "lf",
                    overwrite: true
                },
                files: {
                    "": [
                        "src/**/*.*"
                    ]
                }
            }
        },
        wrap: {
            browserpolyfill: {
                src: "node_modules/babel/browser-polyfill.js",
                dest: "dist/browser-polyfill.js",
                options: {
                    wrapper: ["(function () { if (window.regeneratorRuntime) { return; }", "}());\n"]
                }
            },
            co: {
                src: "node_modules/co/index.js",
                dest: "src/thirdparty/co.es6",
                options: {
                    wrapper: ["// https://www.npmjs.com/package/co", "export default module.exports;\n"]
                }
            }
        },
        "babel": {
            options: {
                sourceMap: true,
                modules: "amd",
                blacklist: ["regenerator"]
            },
            src: {
                files: [{
                    expand: true,
                    cwd   : "src/",
                    src   : [ "**/*.{jsx,es6}" ],
                    dest  : "dist/",
                    ext   : ".js"
                }]
            },
            testSpec: {
                files: [{
                    expand: true,
                    cwd   : "test/spec/",
                    src   : [ "**/*.{jsx,es6}" ],
                    dest  : "test/dist/",
                    ext   : ".js"
                }]
            }
        },
        "string-replace": {
            main: {
                files: {
                    "main.js": "main.js"
                },
                options: {
                    replacements: [{
                        pattern: /\/\/-build:from[\s\S]*\/\/-build:to/,
                        replacement: function () {
                            var lines = [];
                            
                            var files = glob.sync("dist/**/*.js")
                                .map(function (file) {
                                    file = file.replace(/\.js$/, "");
                                    
                                    var key = file.match(/^dist\/(.*)$/)[1];
                                    key = "testObj[\"" + key + "\"]";
                                    return key + " = require(\"" + file + "\");";
                                });
                            
                            lines = lines.concat(files);
                            
                            // build marks
                            lines.unshift("//-build:from");
                            lines.push("//-build:to");
                            
                            // indentation
                            lines = lines.map(function (l, i) {
                                return i !== 0 ? "        " + l : l;
                            });
                            
                            return lines.join("\n");
                        }
                    }]
                }
            },
            unittests: {
                files: {
                    "unittests.js": "unittests.js"
                },
                options: {
                    replacements: [{
                        pattern: /\/\/-build:from[\s\S]*\/\/-build:to/,
                        replacement: function () {
                            var files = fs.readdirSync("test/dist/");

                            // ignore non .js files
                            files = files.filter(function (f) { return f.match(/.js$/); });

                            // construct the require string
                            files = files.map(function (f) {
                                f = f.match(/^([\s\S]*).js$/);
                                return "require(\"test/dist/" + f[1] + "\")";
                            });
                            files = files.join(",\n");

                            // add build marks
                            files = [files];
                            files.unshift("//-build:from");
                            files.push("//-build:to");
                            files = files.join("\n");

                            // fix indentation
                            files = files.split("\n").map(function (l, i) {
                                return i !== 0 ? "            " + l : l;
                            }).join("\n");

                            return files;
                        }
                    }]
                }
            }
        },
        zip: {
            main: {
                dest: "<%= pkg.name %>.zip",
                src: [
                    "dist/**",
                    "nls/**",
                    "styles/**",
                    "LICENSE",
                    "*.js",
                    "*.json",
                    "*.md"
                ]
            }
        }
    });

    grunt.registerTask("test", ["jshint"]);
    grunt.registerTask("prebuild", ["wrap", "lineending"]);
    grunt.registerTask("build", ["babel", "string-replace"]);
    grunt.registerTask("package", ["test", "prebuild", "build", "zip"]);
    grunt.registerTask("default", ["prebuild", "build", "watch"]);

};
