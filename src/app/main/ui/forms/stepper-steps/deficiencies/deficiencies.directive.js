/**
 * Created by corali.triana on 12/6/17.
 */

angular.module('fuse')
    .directive('deficiencies', function() {
        return {
            restrict: 'E',
            scope: {
                step: '=',
                stepNumber: '=',
                picturesArray: '='
            },
            templateUrl: 'app/main/ui/forms/stepper-steps/deficiencies/deficiencies.html',
            controllerAs: 'vm',
            controller: function ($scope, deviceDetector, Upload) {
                var vm=this;
                vm.step=$scope.step;
                vm.stepNumber=$scope.stepNumber;
                vm.picturesArray=$scope.picturesArray;
                vm.deviceDetector = deviceDetector;
                vm.uploadDocuments=uploadDocuments;
                vm.uploadDocumentOneByOne=uploadDocumentOneByOne;
                vm.removeElementInArray=removeElementInArray;

                function uploadDocuments(files, step) {
                    if (files && files.length) {
                        for (var i = 0; i < files.length; i++) {
                            console.log(files[i]);
                            Upload.resize(files[i], 100, 100, 0.5).then(
                                function (resizedFile) {
                                    console.log(resizedFile);
                                    Upload.base64DataUrl(resizedFile).then(
                                        function (url) {
                                            if (vm.picturesArray[step] == undefined) {
                                                vm.picturesArray[step] = [];
                                            }
                                            vm.picturesArray[step].push(url);

                                        })
                                }
                            )
                        }
                    }
                }
                function uploadDocumentOneByOne(file, step) {
                    Upload.base64DataUrl(file).then(
                        function (url) {
                            if (url !== null) {
                                if(vm.picturesArray[step]==undefined){
                                    vm.picturesArray[step]=[];
                                }
                                vm.picturesArray[step].push(url);///
                            }
                        });
                }

                function removeElementInArray(array, element) {
                    const index = array.indexOf(element);

                    if (index !== -1) {
                        array.splice(index, 1);
                    }
                }
            }
        };
    });