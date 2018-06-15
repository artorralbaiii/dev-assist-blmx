'use strict';

(function () {
    angular.module('app.home')
        .controller('Home', Home);

    Home.$inject = ['$routeParams', 'dataservice'];

    function Home($routeParams, dataservice) {
        var vm = this;
        vm.state =0; 
        vm.DEFAULT_SCR = 0;
        vm.FORM_SCR = 1;
        vm.submit = submit;

        vm.customer = {};
        vm.customer.rndCustName = true;
        vm.customer.rndBalance = true;
        vm.customer.rndProduct = true;
        vm.customer.rndStatus = true;
        vm.customer.rndTransType = true;
        vm.customer.rndTransDate = true;
        vm.customer.rndAmt = true;
        vm.customer.transCount = 1;
        vm.customer.custCount = 1;
        vm.customer.templateId = null;

        if ($routeParams['id']) {
            vm.state = parseInt($routeParams['id']);
        }

        function submit(data) {
            dataservice.createData(data)
                .then(function(data){
                    console.log(data);
                });
        }

    }
    
})();