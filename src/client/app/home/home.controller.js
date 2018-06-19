'use strict';
/* jshint ignore:start */
(function () {
    angular.module('app.home')
        .controller('Home', Home);

    Home.$inject = ['$routeParams', 'dataservice', 'templates', 'socketService'];

    function Home($routeParams, dataservice, templates, socketService) {
        var vm = this;
        vm.state = 0;
        vm.DEFAULT_SCR = 0;
        vm.FORM_SCR = 1;
        vm.DISPLAY_DATA_SCR = 2;
        vm.submit = submit;
        vm.loadTemplate = loadTemplate;

        vm.customers = templates;
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
        vm.searchTemplate = {
            templateName: ''
        };
        vm.sqlpath = '';

        vm.templates = templates;

        if ($routeParams['id']) {
            vm.state = parseInt($routeParams['id']);
        }

        function submit(data) {
            dataservice.createData(data)
                .then(function (data) {
                    console.log(data);
                    vm.state = 2;
                    vm.customers = data.data;
                    vm.sqlpath = data.file;
                    vm.templates.push(vm.customer);
                });
        }

        function loadTemplate(id, data) {
            var jsonData = JSON.parse(data);
            jsonData.transDate = new Date(jsonData.transDate);
            vm.customer = jsonData;
            vm.customer.templateId = id;
        }

        socketService.on('template-executed', function (data) {
            console.log(data);
        });

        socketService.on('load-form', function (data) {

            if (data.hasOwnProperty('status')) {
                if (data.status !== 'null') {
                    vm.customer.status = data.status;
                    vm.customer.rndStatus = false;
                }
            } else {
                vm.customer.rndStatus = true;
            }

            if (data.hasOwnProperty('balance')) {
                if (data.balance !== 0) {
                    vm.customer.balance = data.balance;
                    vm.customer.rndBalance = false;
                }
            } else {
                vm.customer.rndBalance = true;
            }

            if (data.hasOwnProperty('product')) {
                if (data.product !== 'null') {
                    vm.customer.product = data.product;
                    vm.customer.rndProduct = false;
                }
            } else {
                vm.customer.rndProduct = true;
            }

            if (data.hasOwnProperty('type')) {
                if (data.type !== 'null') {
                    vm.customer.type = data.type;
                    vm.customer.rndTransType = false;
                }
            } else {
                vm.customer.rndTransType = true;
            }

            if (data.hasOwnProperty('amt')) {
                if (data.amt !== 0) {
                    vm.customer.amt = data.amt;
                    vm.customer.rndAmt = false;
                }
            } else {
                vm.customer.rndAmt = true;
            }

            if (data.hasOwnProperty('transDate')) {
                if (data.transDate !== 'null') {
                    vm.customer.transDate = new Date(data.transDate);
                    vm.customer.rndTransDate = false;
                }
            } else {
                vm.customer.rndTransDate = true;
            }
            vm.customer.transDate = null;
            vm.state = vm.FORM_SCR;
        });

    }

})();

/* jshint ignore:end */