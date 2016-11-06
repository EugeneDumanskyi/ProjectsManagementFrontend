(function () {
    'use strict';

    angular.module('app').directive('projectCategory', projectCategory);

    projectCategory.$inject = [];

    /* @ngInject */
    function projectCategory() {
        return {
            bindToController: true,
            controller: CategoryController,
            controllerAs: 'cat',
            link: link,
            restrict: 'E',
            templateUrl: "js/features/category/category.view.html",
            scope: {
                category: '=',
                noItemsHint: '=',
                onDrop: '=',
                dropSuccessHandler: '='
            }
        };

        function link(scope, element, attrs) {
        }
    }

    CategoryController.$inject = ['$filter'];

    /* @ngInject */
    function CategoryController($filter) {
        var vm = this;

        vm.project = '';

        vm.addProject = function() {
            if(event.keyCode == 13 && vm.project && vm.category){
                vm.category.projects.push({
                    id:  Math.floor((Math.random() * Math.pow(2, 32)) + 1),
                    description: vm.project,
                    weight: 0
                });
                vm.project = '';
                vm.category.projects = $filter('orderBy')(vm.category.projects, ['-weight','description']);
                //TODO:  call some API to send the data to a server
            }
        };
    }

})();