/**
 * Created by corali.triana on 12/6/17.
 */

angular.module('fuse')
    .directive('priceRange', function() {
        return {
            restrict: 'E',
            scope: {
                step: '='
            },
            templateUrl: 'app/main/ui/forms/stepper-steps/price-range/price-range.html',
            controllerAs: 'vm',
            controller: function ($scope) {
                var vm=this;
                vm.step=$scope.step;
            }
        };
    });