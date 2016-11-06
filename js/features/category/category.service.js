(function () {
    'use strict';

    angular
        .module('app')
        .provider('Category', CategoryProvider);

    /* @ngInject */
    function CategoryProvider() {
        var endpoint = 'api/categories.json/:id';

        function setEndpoint(val) {
            endpoint = val;
        }

        function $get($resource) {
            return $resource(endpoint, { id: '@_id' }, {
                update: {
                    method: 'PUT'
                }
            });
        }

        $get.$inject = ['$resource'];

        return {
            setEndpoint: setEndpoint,
            $get: $get
        };
    }

})();

