module.exports = function(grunt) {
<<<<<<< HEAD
    var configSetup = require('../dev-ui/tasks/config.js');

    configSetup(grunt);

    grunt.loadNpmTasks('openlmis-ui');

=======
    grunt.loadNpmTasks('openlmis-ui');

    grunt.option('applicationDirectories', [
        '/openlmis/openlmis-requisition-ui'
        ]);
>>>>>>> 458733be78d66af110dbc43fdf2e1a1cdda94296
};
