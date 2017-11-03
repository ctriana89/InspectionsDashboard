(function ()
{
    'use strict';

    angular
        .module('app.ui.forms')
        .controller('FormsController', FormsController);

    /** @ngInject */
    function FormsController($mdDialog)
    {
        var vm = this;

        // Data
        vm.horizontalStepper = {
            step1: {},
            step2: {},
            step3: {},
            step4: {},
            step5: {}
        };

        vm.verticalStepper = {
            step1: {},
            step2: {},
            step3: {},
            step4: {},
            step5: {}
        };

        vm.basicForm = {};
        vm.formWizard = {};
        vm.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
        'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
        'WY').split(' ').map(function (state)
        {
            return {abbrev: state};
        });

        // Methods
        vm.sendForm = sendForm;
        vm.showDataDialog = showDataDialog;
        vm.submitHorizontalStepper = submitHorizontalStepper;
        vm.submitVerticalStepper = submitVerticalStepper;

        //////////

        /**
         * Submit horizontal stepper data
         * @param event
         */
        function submitHorizontalStepper(event)
        {
            // Show the model data in a dialog
            vm.showDataDialog(event, vm.horizontalStepper);

            // Reset the form model
            vm.horizontalStepper = {
                step1: {},
                step2: {},
                step3: {},
                step4: {},
                step5: {}
            };
        }

        /**
         * Submit vertical stepper data
         *
         * @param event
         */
        function submitVerticalStepper(event)
        {
            // Show the model data in a dialog
            vm.showDataDialog(event, vm.verticalStepper);

            // Reset the form model
            vm.verticalStepper = {
                step1: {},
                step2: {},
                step3: {},
                step4: {},
                step5: {}
            };
        }

        /**
         * Submit stepper form
         *
         * @param ev
         */
        function showDataDialog(ev, data)
        {
            // You can do an API call here to send the form to your server
          //var docDefinition = { content: 'This is an sample PDF printed with pdfMake' };
          var docDefinition = {
          content: [
            { text: 'All Florida Inspection & Exterminating, Inc', style: 'header' },
            'By Garry',
            { text: 'Property Owner: '+vm.verticalStepper.step1.firstname+' '+vm.verticalStepper.step1.lastname, style: 'anotherStyle' },
            { text: 'Address: '+vm.verticalStepper.step2.address, style: [ 'header', 'anotherStyle' ] },
            { text: 'Buyers: '+vm.verticalStepper.step3.firstname+' '+vm.verticalStepper.step3.lastname, style: 'anotherStyle' },
            { text: 'Date of inspection: '+vm.verticalStepper.step4.date, style: [ 'header', 'anotherStyle' ] },

          ],

          styles: {
            header: {
              fontSize: 22,
              bold: true
            },
            anotherStyle: {
              fontSize: 12,
              italic: true,
              alignment: 'left'
            }
          }
        };

          pdfMake.createPdf(docDefinition).open();

            // // Show the sent data.. you can delete this safely.
            // $mdDialog.show({
            //     controller         : function ($scope, $mdDialog, formWizardData)
            //     {
            //         $scope.formWizardData = formWizardData;
            //         $scope.closeDialog = function ()
            //         {
            //             $mdDialog.hide();
            //         };
            //     },
            //     template           : '<md-dialog>' +
            //     '  <md-dialog-content><h1>You have sent the form with the following data</h1><div><pre>{{formWizardData | json}}</pre></div></md-dialog-content>' +
            //     '  <md-dialog-actions>' +
            //     '    <md-button ng-click="closeDialog()" class="md-primary">' +
            //     '      Close' +
            //     '    </md-button>' +
            //     '  </md-dialog-actions>' +
            //     '</md-dialog>',
            //     parent             : angular.element('body'),
            //     targetEvent        : ev,
            //     locals             : {
            //         formWizardData: data
            //     },
            //     clickOutsideToClose: true
            // });
        }

        /**
         * Send form
         */
        function sendForm(ev)
        {
            // You can do an API call here to send the form to your server

            // Show the sent data.. you can delete this safely.
            $mdDialog.show({
                controller         : function ($scope, $mdDialog, formWizardData)
                {
                    $scope.formWizardData = formWizardData;
                    $scope.closeDialog = function ()
                    {
                        $mdDialog.hide();
                    };
                },
                template           : '<md-dialog>' +
                '  <md-dialog-content><h1>You have sent the form with the following data</h1><div><pre>{{formWizardData | json}}</pre></div></md-dialog-content>' +
                '  <md-dialog-actions>' +
                '    <md-button ng-click="closeDialog()" class="md-primary">' +
                '      Close' +
                '    </md-button>' +
                '  </md-dialog-actions>' +
                '</md-dialog>',
                parent             : angular.element('body'),
                targetEvent        : ev,
                locals             : {
                    formWizardData: vm.formWizard
                },
                clickOutsideToClose: true
            });

            // Clear the form data
            vm.formWizard = {};
        }
    }
})();