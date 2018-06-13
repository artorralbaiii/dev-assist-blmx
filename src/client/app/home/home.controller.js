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

        vm.customer = {};
        vm.customer.rndCustName = true;
        vm.customer.rndBalance = true;
        vm.customer.rndProduct = true;
        vm.customer.rndStatus = true;
        vm.customer.rndType = true;
        vm.customer.rndTransDate = true;
        vm.customer.rndAmt = true;

        if ($routeParams['id']) {
            vm.state = parseInt($routeParams['id']);
        }




    }
    
})();