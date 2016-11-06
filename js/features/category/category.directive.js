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

    CategoryController.$inject = [];

    /* @ngInject */
    function CategoryController() {
        var vm = this;

        vm.project = '';

        vm.addProject = function() {
            if(event.keyCode == 13 && vm.project && vm.category){
                vm.category.projects.push({description: vm.project});
                vm.project = '';
                //TODO:  call some API to send the data to a server
            }
        };
    }

})();