(function () {
    'use strict';

    angular
        .module('app.ui.forms')
        .controller('FormsController', FormsController);

    /** @ngInject */
    FormsController.$inject=['Upload','$timeout'];
    function FormsController(Upload,$timeout) {
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
            step2: {
                dateOfInspection:new Date(),
                weatherCondition: [
                    {name:'Rain',value:false},
                    {name:'Cloudy',value:false},
                    {name:'Clear',value:false},
                    {name:'Dry',value:false}
                ],
                presentAtInspection:[
                    {name:'Buyer',value:false},
                    {name:"Buyer's agent",value:false},
                    {name:'Seller',value:false},
                    {name:"Seller's agent",value:false}
                ]
            },
            step3: {
                garageDoorOperatorModel:"Electric"
            },
            step4: {},
            step5: {}
        };
    vm.selectOptions=('Satisfactory, Not Applicable, None, See below')
        .split(',').map(function (state) {
            return { abbrev: state };
        });
        vm.basicForm = {};
        vm.formWizard = {};
        vm.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
        'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
        'WY').split(' ').map(function (state) {
            return {abbrev: state};
        });

        // Methods
        vm.sendForm = sendForm;
        vm.showDataDialog = showDataDialog;
        vm.submitHorizontalStepper = submitHorizontalStepper;
        vm.submitVerticalStepper = submitVerticalStepper;
        vm.uploadDocument=uploadDocument;
        vm.uploadDocuments=uploadDocuments;
        vm.convertBase64=convertBase64;
        vm.multiplesFiles=[];
        //////////

        /**
         * Submit horizontal stepper data
         * @param event
         */
        function submitHorizontalStepper(event) {
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
        function submitVerticalStepper(event) {
            // Show the model data in a dialog
            vm.showDataDialog(event, vm.verticalStepper);

            // Reset the form model
            vm.verticalStepper = {
                step1: {},
                step2: {},
                step3: {}
            };
        }
        function uploadDocument(file) {
            Upload.base64DataUrl(file).then(
                function (url) {
                    vm.verticalStepper.step1.frontSideHouse1 = url;
                    console.log(url);
                });
        }
        function convertBase64(file) {
            return Upload.base64DataUrl(file).then(
                function (url) {
                    console.log(url);
                    return url;
                });
        }
        function uploadDocuments(files) {
            console.log('Files' + files);
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    Upload.base64DataUrl(files[i]).then(
                        function (url) {
                            console.log(url);
                            vm.multiplesFiles.push(url);
                            console.log('Each one i' + url);
                        });
                    console.log('Each one' + files[i]);
                }
            }
        }
        vm.uploadFiles = function(files) {
            vm.files = files;

            Upload.base64DataUrl(files).then(function(urls){
                vm.multiplesFiles=urls;
                console.log(urls);
            });
            angular.forEach(files, function (file) {
                if (file && !file.$error) {
                    file.upload = Upload.upload({
                        url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                        file: file
                    });

                    file.upload.then(function (response) {
                        $timeout(function () {
                            file.result = response.data;
                        });
                        file.upload.base64DataUrl(files[i]).then(
                            function (url) {
                                console.log(url);
                                //vm.multiplesFiles.push(url);
                            });
                        console.log('Each one'+files[i]);
                    }, function (response) {
                        if (response.status > 0)
                            vm.errorMsg = response.status + ': ' + response.data;
                    });

                    file.upload.progress(function (evt) {
                        file.progress = Math.min(100, parseInt(100.0 *
                            evt.loaded / evt.total));
                    });
                }
            });
        };
        /**
         * Submit stepper form
         *
         * @param ev
         */
        function showDataDialog(ev, data) {
            // You can do an API call here to send the form to your server
            //var docDefinition = { content: 'This is an sample PDF printed with pdfMake' };
            var docDefinition = {
                header: {text: 'ALL FLORIDA INSPECTIONS & EXTERMINATING, INC.', style: 'header'},
                footer: function (page, pages) {
                    return  page + ' of ' + pages;
                },
                content: [
                    {text: 'COMPREHENSIVE INSPECTION REPORT', style: 'header'},
                    {text: 'Requested by: ' + vm.verticalStepper.step1.ownerName, style: 'header'},
                    {
                        image: vm.verticalStepper.step1.frontSideHouse1,
                        fit: [600, 600]
                    },
                    {text: vm.verticalStepper.step1.ownerAddress, style: 'anotherStyle'},
                    {
                        text: '5055 N.W. 96 Drive, Coral Springs, FL 33076 • Tel: 954-753-7886 •allfloridainspections.1@gmail.com',
                        style: 'anotherStyle'
                    },
                    {text: 'http://www.allfloridainspection.com/', style: 'anotherStyle', pageBreak: 'after'},
                    {
                        toc: {
                            title: {text: 'Table of Contents', style: 'header'}
                        }
                    },

                    {text: 'PROPERTY ADDRESS: '+vm.verticalStepper.step1.ownerAddress, style: 'anotherStyle'},
                    {text: 'DATE OF INSPECTION: '+vm.verticalStepper.step2.dateOfInspection, style: 'anotherStyle'},
                    {text: 'WEATHER CONDITIONS AT TIME OF INSPECTION : '+ getSelectedConditions(vm.verticalStepper.step2.weatherCondition), style: 'anotherStyle'},
                    {text: 'OWNER OCCUPIED : '+ vm.verticalStepper.step2.ownerOcuppied, style: 'anotherStyle'},
                    {text: 'PRESENT AT INSPECTION : '+ getSelectedConditions(vm.verticalStepper.step2.presentAtInspection), style: 'anotherStyle', pageBreak: 'after'},
                    GeneralNotesAndLiability(),
                    CostEstimates(),
                    structuralSystems(),
                    addPicturesToTheDocument(vm.multiplesFiles)
                ],
                styles: {
                    header: {
                        fontSize: 20,
                        bold: true,
                        alignment: 'center',
                        margin: [20,20]
                    },
                    anotherStyle: {
                        fontSize: 12,
                        italic: true,
                        alignment: 'center',
                        margin: [20,5,20,5]
                    },h6_header: {
                        fontSize: 9,
                        bold: true,
                        alignment: 'left',
                        margin:[0,20,0,0]
                    },p: {
                        fontSize: 9,
                        alignment: 'justify'
                    }
                }
            };
            console.log(docDefinition);
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
         * Return an string with the  conditions selected
         */
        function getSelectedConditions(list) {
            var selected = "";
            angular.forEach(list, function (value, key) {
                if (value.value == true)
                    selected += value.name + ', ';
            });
            return selected;
        }/**
         * Return second page "General Notes and Liability"
         */
        function GeneralNotesAndLiability() {
            return [
                {text: "GENERAL INFORMATION", style: "h6_header", tocItem: true},
                {
                    text: "All Florida Inspections & Exterminating, Inc. remains totally unbiased in its evaluation of the subject structure and in no way do we have any financial interest in said property. This inspection is limited to functional defects of the structure and its mechanical components which are visible and accessible, and which directly apply to your real estate contract at the time of the inspection. This inspection is not to be used to determine city/county/state building code compliance. It does not cover cosmetic or aesthetic items. The buyer is responsible for noting cosmetic deficiencies. It does not project life expectancy of any item, a satisfactory rating of any component or mechanical item is not a warranty of that item. All Florida Inspections & Exterminating, Inc. has identified as many deficiencies as we were able to reveal under the physical conditions which existed at the time of inspection and does not represent to have found all defective items. All Florida Inspections & Exterminating, Inc. accepts no responsibility or liability for defects discovered subsequent to the day of this inspection. Because our inspectors are not trained structural engineers, the buyer should not rely solely on this report for a purchase decision. For definitive structural information, a trained structural engineer should be consulted. This inspection and its cost reflects only what is stated in this report. Seawall, dock and septic tank inspections are not included in the report. This report identifies as many deficiencies possible as revealed under the physical conditions that exist at the time of inspection, and does not represent a complete identification of every defective item. It does not cover areas, which are enclosed or inaccessible or concealed, such as concealed piping, wiring, internal parts of appliances, motors, boilers and heaters. Future failure of mechanical components which are working at the time of the inspection cannot be predicted. Inspections may be conducted by licensed independent sub- contractors. THIS INSPECTION DOES NOT INCLUDE MOLD OR CHINESE DRYWALL.",
                    style: "p"
                },
                {text: "COMMENT KEY OR DEFINITIONS", style: "h6_header"},
                {
                    text: "The following definitions of comment descriptions represent this inspection report. Any recommendations by the inspector to repair or replace suggests a second opinion or further inspection by a qualified contractor. All costs associated with further inspection fees and repair or replacement of item, unit or component should be considered before you purchase the property. All comments by the inspector should be considered before purchasing this home.",
                    style: "p"
                },
                {text: "Inspected (IN)", style: "h6_header"},
                {
                    text: " I visually observed the item, component or unit and if no other comments were made then it appeared to be functioning as intended allowing for normal wear and tear.",
                    style: "p"
                },
                {text: "Not Inspected (NI)", style: "h6_header"},
                {
                    text: "I did not inspect this item, component or unit and made no representations of whether or not it was functioning as intended and will state a reason for not inspecting.",
                    style: "p"
                },
                {text: "Not Present (NP)", style: "h6_header"},
                {text: "The item, component or unit is not in this home or building.", style: "p"},

                {text: "Repair or Replace (RR)", style: "h6_header"},
                {
                    text: "This item, component or unit is not functioning as intended, or needs further inspection by a qualified contractor. Items, components or units that can be repaired to satisfactory condition may not need replacement.",
                    style: "p"
                },
                {text: "CONDITIONS LIMITING INSPECTION", style: "h6_header"},
                {
                    text: "The inspector shall have the right to NOT inspect any areas of the structure which shall be considered hazardous to their safety or health, or when access is restricted or limited to make normal observations. The safety of roof access is at the inspectors discretion. The inspector is not required to report on areas which are enclosed or inaccessible, areas concealed by wall covering, floor covering, furniture, equipment, personal items or any portion of the structure in which inspection would necessitate moving, defacing or taking apart any of the components.",
                    style: "p"
                },
                {text: "LIMITATION OF LIABILITY/LITIGATION COSTS & FORUM", style: "h6_header"},
                {
                    text: "The client agrees that the liability of the inspector is limited to the cost of the inspection service and no more. Further, if litigation should arise from this contract, then the forum for the same shall be Broward County, Florida; all associated fees and expenses incurred by the inspection company in enforcing the terms herein shall be paid by the client.",
                    style: "p"
                },
                {text: "FEES", style: "h6_header"},
                {
                    text: "All fees are due at the time of inspection unless prior arrangements have been made. Client will be responsible for payment whether purchase of property is completed or not. Client authorizes All Florida Inspections & Exterminating, Inc. to distribute and/or discuss the contents with the real estate agents, attorneys and lenders involved in this transaction.",
                    style: "p"
                }
            ];
        }
        /**
         * Return second page "General Notes and Liability"
         */
        function CostEstimates() {
            return [
                {text: "COST ESTIMATES", style: "h6_header", pageBreak: 'before', tocItem: true},
                {
                    text: "We do not guarantee the accuracy of any cost or repair estimates. Since All Florida Inspections & Exterminating, Inc. does no repairs, cost estimates are a professional opinion only based on a service call, parts and labor. Competitive estimates are recommended from those individual contractors who will make the repairs. All compliant corrections should be made only by licensed professional contractors who will warranty their work.",
                    style: "p"
                },
                {
                    columns: [
                        {text: ''},
                        {text: 'Structural/Mechanical:'},
                        {text: '1,000.00 - $1,200.00' },
                        {text: ''}
                    ]
                },
                {
                    columns: [
                        {text: ''},
                        {text: 'Major Appliances:'},
                        {text: '1,000.00 - $1,200.00' },
                        {text: ''}
                    ]
                },{
                    columns: [
                        {text: ''},
                        {text: 'Air Conditioning/Heating:'},
                        {text: '1,000.00 - $1,200.00' },
                        {text: ''}
                    ]
                },{
                    columns: [
                        {text: ''},
                        {text: 'Plumbing:'},
                        {text: '1,000.00 - $1,200.00' },
                        {text: ''}
                    ]
                },{
                    columns: [
                        {text: ''},
                        {text: 'Electrical:'},
                        {text: '1,000.00 - $1,200.00' },
                        {text: ''}
                    ]
                },{
                    columns: [
                        {text: ''},
                        {text: 'Sprinkler/Pool:'},
                        {text: '1,000.00 - $1,200.00' },
                        {text: ''}
                    ]
                },{
                    columns: [
                        {text: ''},
                        {text: 'Roof:'},
                        {text: '1,000.00 - $1,200.00' },
                        {text: ''}
                    ]
                },{
                    columns: [
                        {text: ''},
                        {text: 'WDO Inspection Report:'},
                        {text: '1,000.00 - $1,200.00' },
                        {text: ''}
                    ]
                },{
                    columns: [
                        {text: ''},
                        {text: 'Wood replacement:'},
                        {text: '1,000.00 - $1,200.00' },
                        {text: ''}
                    ]
                },{
                    columns: [
                        {text: ''},
                        {text: 'TOTAL:'},
                        {text: '11,000.00 - $17,200.00' },
                        {text: ''}
                    ]
                },{text:"NOTE: We recommend all repairs listed should be made only by licensed professional contractors who will warranty their work. We do not guarantee the accuracy of any cost or repair estimates. Cost estimates in the report are an educated opinion by the inspector and are supplied as a guide to the client to determine approximate cost of deficiencies. DO NOT rely on these figures for any type of negotiations or contract purposes, rely only on professional bids. We strongly recommend that three (3) bids be obtained for any repair and/or replacement.",style:"h6_header"}
                ]
        }

        /**
         * Return third and fourth page "Structural Systems"
         */
        function structuralSystems() {
            return [
                {text: "STRUCTURAL SYSTEMS", style: "h6_header", pageBreak: 'before', tocItem: true},
                {
                    text: "The Home Inspector shall observe structural components including foundations, ceilings and floors, roof walls, piers or columns. The home inspector shall describe the type of foundation, floor structure, ceiling structure, wall structure, columns or piers, roof structure. The home inspector shall: Report the methods used to observe under floor crawl spaces and attics; Probe and inspect structural components where deterioration is suspected; Enter under floor crawl spaces, basements, and attic spaces except when access is obstructed or unsafe, when entry could be destructive to the property, or when adverse or dangerous situations are suspected; and Report signs of abnormal or harmful water penetration into the building or signs of abnormal or harmful condensation on building components. The home inspector is not required to: Enter any area or perform any procedure that may be destructive to the property or its components or be dangerous to or adversely affect the health of the home inspector or other persons.", style: "p"
                },

                {text: "COMMENTS", style: "h6_header"},
                {
                    columns: [
                        {text: 'Dwelling'},
                        {text: vm.verticalStepper.step3.dwelling}
                    ]
                },{
                    columns: [
                        {text: 'Foundation'},
                        {text: vm.verticalStepper.step3.foundations}
                    ]
                },{
                    columns: [
                        {text: 'Construction'},
                        {text: vm.verticalStepper.step3.construction}
                    ]
                },{
                    columns: [
                        {text: 'Siding'},
                        {text: vm.verticalStepper.step3.siding}
                    ]
                },
                {text: "Mechanical operation of openings", style: "h6_header"},
                {
                    columns: [
                        {text: 'Doors (Interior & Exterior)'},
                        {text: vm.verticalStepper.step3.doors}
                    ]
                },{
                    columns: [
                        {text: 'Sliding doors'},
                        {text: vm.verticalStepper.step3.slidingDoors}
                    ]
                },{
                    columns: [
                        {text: 'Windows'},
                        {text: vm.verticalStepper.step3.windows}
                    ]
                },{
                    columns: [
                        {text: 'Walls'},
                        {text: vm.verticalStepper.step3.walls}
                    ]
                },{
                    columns: [
                        {text: 'Floors'},
                        {text: vm.verticalStepper.step3.floors}
                    ]
                },{
                    columns: [
                        {text: 'Stairways'},
                        {text: vm.verticalStepper.step3.stairways}
                    ]
                },{
                    columns: [
                        {text: 'Porches, balconies, Patio'},
                        {text: vm.verticalStepper.step3.porchesBalconiesPatio}
                    ]
                },{
                    columns: [
                        {text: 'Decks, and carports'},
                        {text: vm.verticalStepper.step3.decksCarports}
                    ]
                },{
                    columns: [
                        {text: 'Garage door operator(s)'},
                        {text: vm.verticalStepper.step3.garageDoorOperator}
                    ]
                },{
                    columns: [
                        {text: 'Garage door operator model'},
                        {text: vm.verticalStepper.step3.garageDoorOperatorModel}
                    ]
                },{
                    columns: [
                        {text: 'Fireplace/chimney'},
                        {text: vm.verticalStepper.step3.fireplaceChimney}
                    ]
                }, {text: vm.verticalStepper.step3.comments, pageBreak: 'after'}
            ]
        }

        function addPicturesToTheDocument(pictures) {
            var temp = [];
            for (var i = 0; i < pictures.length; i += 2) {
                var second = i + 1;
                temp.push({
                    columns: [{
                        image: pictures[i],
                        fit: [100, 100]
                    },
                        (pictures[second] !== undefined) ? {
                                image: pictures[second],
                                fit: [100, 100]
                            } : {}
                    ]
                });
            }
            // return {
            //     columns: temp
            // };
            return temp;
        }
        /**
         * Send form
         */
        function sendForm(ev) {
            // You can do an API call here to send the form to your server

            // Show the sent data.. you can delete this safely.
            $mdDialog.show({
                controller: function ($scope, $mdDialog, formWizardData) {
                    $scope.formWizardData = formWizardData;
                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    };
                },
                template: '<md-dialog>' +
                '  <md-dialog-content><h1>You have sent the form with the following data</h1><div><pre>{{formWizardData | json}}</pre></div></md-dialog-content>' +
                '  <md-dialog-actions>' +
                '    <md-button ng-click="closeDialog()" class="md-primary">' +
                '      Close' +
                '    </md-button>' +
                '  </md-dialog-actions>' +
                '</md-dialog>',
                parent: angular.element('body'),
                targetEvent: ev,
                locals: {
                    formWizardData: vm.formWizard
                },
                clickOutsideToClose: true
            });

            // Clear the form data
            vm.formWizard = {};
        }
    }
})();