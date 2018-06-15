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
                controllerAs: 'vm',
                resolve: {
                    templates: ['dataservice', function (dataservice) {
                        return dataservice.getTemplates();
                    }]
                }
            })
            .otherwise({ redirectTo: '/' });
    }
})();