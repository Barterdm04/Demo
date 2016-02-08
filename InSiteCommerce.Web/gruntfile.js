/// <vs BeforeBuild='sass:debug' SolutionOpened='watch:sass' />
module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        teamcity: {
            all: {}
        },
        sass: {
            debug: {
                options: {
                    style: "expanded",
                    compass: true
                },
                files: [{
                    expand: true,
                    src: ["**/*.scss"],
                    ext: ".css"
                }]
            }
        },
        watch: {
            sass: {
                files: "**/*.scss",
                tasks: ["sass:debug"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-teamcity");

    grunt.registerTask("default", ["teamcity", "watch"]);
};