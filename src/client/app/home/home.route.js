'use strict';

(function () {
    angular.module('app.home')
        .config(getRoutes);

    getRoutes.$inject = ['$routeProvider', '$locationProvider'];

    function getRoutes($routeProvider, $locationProvider) {
        $routeProvider
            .when('/:id?', {
                templateUrl: 'app/home/home.html',
                controller: 'Home',
                controllerAs: 'vm'
            })
            .otherwise({ redirectTo: '/' });
    }
})();