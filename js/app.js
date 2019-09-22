(function () {
    'use-strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItems);

    NarrowItDownController.$inject = ['MenuSearchService'];

    function NarrowItDownController(MenuSearchService) {
        let ctrl = this;

        ctrl.input = "";

        ctrl.clicked = function () {
            let promise = MenuSearchService.getMatchedMenuItems(ctrl.input);

            promise.then(function (result) {
                ctrl.found = result;
            });
        };

        ctrl.removeItem = function (index) {
            ctrl.found.splice(index, 1);
        };
    }

    MenuSearchService.$inject = ['$http'];

    function MenuSearchService($http) {
        let service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: "GET",
                url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
            }).then(function (response) {
                let foundItems = response.data.menu_items;
                let filteredItems = [];

                if(searchTerm === "") {
                    return [];
                }

                for (let item of foundItems) {
                    if (item.description.indexOf(searchTerm) !== -1) {
                        filteredItems.push(item)
                    }
                }

                return filteredItems;
            })
        }
    }

    function FoundItems() {
        return {
            restrict: 'E',
            templateUrl: 'loader/itemsloaderindicator.template.html',
            scope: {
                foundItems: '<',
                onRemove: '&'
            },
            controller: NarrowItDownController,
            controllerAs: 'itemCtrl',
            bindToController: true
        };
    }
})();