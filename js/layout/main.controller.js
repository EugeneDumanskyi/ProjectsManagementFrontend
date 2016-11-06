(function () {
    'use strict';

    angular.module('app').controller('MainController', MainController);

    MainController.$inject = ['$scope', 'Category'];

    /* @ngInject */
    function MainController($scope, Category) {
        var vm = this;

        /**
         * @typedef {object} Project
         *  @property {string} description
         */

        /**
         * @typedef {object} ProjectCategory
         *  @property {string} name
         *  @property {Project[]} projects
         */

        /**
         * @type {ProjectCategory[]}
         */
        vm.categories = [];

        vm.project = '';
        vm.category = '';
        vm.total = 0;
        vm.noItemsHint = 'the list is empty';

        // load initial data...
        (function loadItems() {
            Category.query().$promise
                .then(function (items) {
                    vm.categories = items;
                })
                .catch(function (err) {
                    console.error(err && err.statusText);
                });
        })();

        vm.addProject = function() {
            if(event.keyCode == 13 && vm.project && vm.categories.length > 0){
                vm.categories[0].projects.push({description: vm.project});
                vm.project = '';
                //TODO:  call some API to send the data to a server
            }
        };

        vm.addCategory = function() {
            if(event.keyCode == 13 && vm.category){
                vm.categories.push({
                    name: vm.category,
                    projects: []
                });
                vm.category = '';
                //TODO:  call some API to send the data to a server
            }
        };

        vm.dropSuccessHandler = function($event, item, array){
            var index = array.indexOf(item);
            index !== -1 && array.splice(index, 1);
        };

        vm.onDrop = function($event, $data, array){
            array.push($data);
        };

        $scope.$watch(function () {
            return vm.categories;
        }, function () {
            // calculate column's class
            if(vm.categories.length > 0 && 12 % vm.categories.length === 0) {
                vm.cols = 12 / vm.categories.length;
            }
            else {
                vm.cols =  Math.floor(12/vm.categories.length) || 1;
            }
            // calculate total number of projects
            var total = 0;
            for (var i = 0, len = vm.categories.length; i < len; i++) {
                total += vm.categories[i].projects.length;
            }
            vm.total = total;
        }, true);

    }

})();