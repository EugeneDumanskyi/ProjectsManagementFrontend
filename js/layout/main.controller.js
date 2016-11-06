(function () {
    'use strict';

    angular.module('app').controller('MainController', MainController);

    MainController.$inject = ['$scope', '$filter', 'Category'];

    /* @ngInject */
    function MainController($scope, $filter, Category) {
        var vm = this;

        /**
         * @typedef {object} Project
         *  @property {number} id
         *  @property {string} description
         *  @property {number} weight
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
                vm.categories[0].projects.push({
                    id:  Math.floor((Math.random() * Math.pow(2, 32)) + 1),
                    description: vm.project,
                    weight: 0}
                );
                vm.project = '';
                vm.categories[0].projects = $filter('orderBy')(vm.categories[0].projects, ['-weight','description']);
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

        vm.prevDropArray = [];

        vm.dropSuccessHandler = function($event, item, obj) {
            var array = obj.array;
            var index = array.indexOf(item);
            index !== -1 && vm.dropStarted && vm.prevDropArray !== array && array.splice(index, 1);
            vm.dropStarted = false;
        };

        var findElement = function (arr, el) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i].id === el.id) {
                    return i;
                }
            }
            return -1;
        };

        var resortArray = function (arr) {
            var sordedArr = $filter('orderBy')(arr, ['-weight','description']);
            arr.length = 0;
            [].push.apply(arr, sordedArr);
        };

        var dropToNewList = function (array, item, itemIndex) {
            if (itemIndex !== -1) {
                array[itemIndex].weight = array[0].weight + 1;
            } else {
                item.weight = array.length > 0 ? array[0].weight + 1 : 0;
                array.push(item);
            }
            resortArray(array);
        };

        var dropOnElement = function (array, srcItem, item, itemIndex) {
            var srcIndex = findElement(array, srcItem);
            if(srcIndex === -1) {
                return;
            }
            var newWeight = srcItem.weight + 2;

            for (var i = srcIndex; i >= 0; i--) {
                array[i].weight = newWeight++;
            }
            if (itemIndex !== -1) {
                array[itemIndex].weight = array[srcIndex].weight - 1;
            }
            else {
                item.weight = array[srcIndex].weight - 1;
                array.push(item);
            }
            resortArray(array);

        };

        vm.onDrop = function($event, item, obj){
            var array = obj.array;
            var srcItem = obj.srcItem;
            var itemIndex = findElement(array, item);
            vm.prevDropArray = array;
            vm.dropStarted = true;

            if(!srcItem) {
                dropToNewList(array, item, itemIndex);
            }
            else {
                dropOnElement(array, srcItem, item, itemIndex);
            }
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