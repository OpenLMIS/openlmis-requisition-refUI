(function() {

    'use strict';

    angular
        .module('openlmis-auth')
        .directive('openlmisDownload', directive);

    directive.$inject = ['$window', 'accessTokenFactory'];

    function directive($window, accessTokenFactory) {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                url: '=openlmisDownload'
            }
        };
        return directive;

        function link(scope, element) {
            element.bind('click', function() {
                $window.location = accessTokenFactory.addAccessToken(scope.url);
            });
        }
    }

})();
