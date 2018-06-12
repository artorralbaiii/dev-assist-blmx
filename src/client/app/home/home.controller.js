'use strict';

(function () {
    angular.module('app.home')
        .controller('Home', Home);

    Home.$inject = ['$routeParams'];

    function Home($routeParams) {
        var vm = this;
        vm.state =0; 
        vm.DEFAULT_SCR = 0;
        vm.FORM_SCR = 1;

        if ($routeParams['id']) {
            vm.state = parseInt($routeParams['id']);
        }


    }
    
})();