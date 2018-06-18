'use strict';

(function () {
    angular.module('app.core')
        .factory('socketService', ['socketFactory', function (socketFactory) {
            return socketFactory();
        }]);
})();