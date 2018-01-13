(function () {
    'use strict';

    angular
        .module('app.ui.forms')
        .controller('FormsController', FormsController);

    /** @ngInject */
    FormsController.$inject = ['Upload', '$timeout', 'deviceDetector'];
    function FormsController(Upload, $timeout, deviceDetector) {
        var vm = this;
        // Data
        vm.horizontalStepper = {
            step1: {},
            step2: {},
            step3: {},
            step4: {},
            step5: {}
        };
        vm.currentYear=(new Date()).getFullYear();
        vm.verticalStepper = {
            step1: {
                name: 'Owner'
            },
            step2: {
                name: 'General Considerations',
                dateOfInspection: new Date(),
                weatherCondition: [
                    {name: 'Rain', value: false},
                    {name: 'Cloudy', value: false},
                    {name: 'Clear', value: false},
                    {name: 'Dry', value: false}
                ],
                presentAtInspection: [
                    {name: 'Buyer', value: false},
                    {name: "Buyer's agent", value: false},
                    {name: 'Seller', value: false},
                    {name: "Seller's agent", value: false}
                ]
            },
            step3: {
                name: 'Structural Systems',
                garageDoorOperatorModel: "Electric",
                picturesAndroid: []
            },
            step4: {name: 'Appliances'},
            step5: {name: 'Air Conditioning, Heating and Venting Systems'},
            step6: {name: 'Plumbing System'},
            step7: {name: 'Electrical System'},
            step8: {
                name: 'Sprinklers and Pool',
                contains: [],
                equipment: [],
                sprinklerSystem:[],
                waterSource:[],
                sprinklerEquipment:[]
            },
            step9: {
                name: 'Roof',
                mainRoofCovering:[],
                mainRoofPitch:[],
                secondaryRoofCovering:[],
                secondaryRoofPitch:[],
                atticAccess:[],
                atticInsulationVentilation:[],
                roofStructure:[],
                woodWork:[],
                leaks:[],
                brokenTiles:[],
                rollRoofing:[],
                eveEdge:[]
            }
        };

        setDefaults(vm);
        vm.selectOptions = ('Satisfactory,Not Applicable,None,See below')
            .split(',').map(function (state) {
                return {abbrev: state};
            });
        vm.typeOfSystemOptions = ('Central,Split or package or wall').split(',').map(function (state) {
                return {abbrev: state};
            });
        vm.typeOfSourceOptions = ('Electric, Gas, Solar').split(',').map(function (state) {
                return {abbrev: state};
            });
        vm.typeOfDwellingOptions = ('One Story Single Family, Two Story Single Family, Town House, Villa, Condo, Commercial, Duplex, Triplex, Fourplex, Fiveplex').split(',').map(function (state) {
                return {abbrev: state};
            });
        vm.typeOfConstructionOptions = ('Slab, Crawl, CBS, Frame, Other').split(',').map(function (state) {
                return {abbrev: state};
            });
        vm.typeOfSidingOptions = ('Stucco, Brick, Wood, Stone, Other').split(',').map(function (state) {
                return {abbrev: state};
            });
        vm.typeOfPipingOptions = ('Copper, PVC, CPVC, Polybutylene, OthGalav./Iron').split(',').map(function (state) {
                return {abbrev: state};
            });
        vm.typeOfWaterSupplyOptions = ('Public, Well').split(',').map(function (state) {
                return {abbrev: state};
            });
        vm.typeOfSewerOptions = ('Public, Septic Tank').split(',').map(function (state) {
                return {abbrev: state};
            });
        vm.typeOfElecticServiceOptions = ('Overhead, Underground').split(',').map(function (state) {
                return {abbrev: state};
            });
        vm.typeOfElecticOutletOptions = ('2 Prong, 3 Prong ground').split(',').map(function (state) {
                return {abbrev: state};
            });
        vm.typeOfElecticSwitchesOptions = ('Silent, Toggle, Interior, Exterior').split(',').map(function (state) {
                return {abbrev: state};
            });
        vm.poolContainsOptions = ['Filter',' Motor and pump',' Visible Cracks',' Visible Piping',' Skimmers'];
        vm.poolEquipmentOptions = ['Lights Working',' Finish worn', 'Finish stained', 'Heater', 'Pump Timer'];
        vm.sprinklerSystemOptions = ['Motor and Pump', 'Cyclomatic Valve', 'Solenoid Valve', 'Timer'];
        vm.sprinklerWaterSourceOptions = ['Public', 'Canal', 'Lake', 'Well'];
        vm.sprinklerEquipmentOptions = ['Heads','Piping'];
        vm.poolWaterLevelOptions = ('Normal, High, Low, Clouded').split(',').map(function (state) {
                return state;
            });

        vm.roofCoveringOptions = ['S-type Cement Tile','Flat Cement Tile', '25# Shingle', '3 Tab Shingle', 'Wood Shake', 'Roll Roofing', 'Tar & Gravel'];
        vm.roofPitchOptions=['Steep', 'Medium', 'Shallow', 'Flat', 'Gable', 'Hip', 'Mansard'];
        vm.atticAccessOptions=['Inspected', 'Personal Storage', 'Limited', 'No Access', 'Parpet Wall'];
        vm.atticInsulationVentilationOptions=['Blown', 'Batts', 'Roll', 'Roof of Turbines', 'Soffit Screen vents', 'Power Vents'];
        vm.roofStructureOptions=['General Condition', 'Valleys', 'Gravel stop', 'Drip Edge', 'Flashing', 'Skylights','Other'];
        vm.woodWorkOptions=['Trusses', 'Rafters', 'Beams', 'Roof Sheathing', 'Soffits', 'Fascia Boards', 'Chimney'];
        vm.leaksOptions=['In side of Attic', 'Inside of Structure', 'Viewed from Above', 'Fascias and Soffits', 'Other'];
        vm.brokenTilesOptions=['General Condition', 'Broken/Miss Field Tiles', 'Cracked Field Tiles', 'Loose Field Tiles', 'Mortar', 'Loose Ridge Tiles', 'Broken/Miss Ridge Tiles'];
        vm.rollRoffingOptions=['General Conditions', 'Damaged', 'Missing', 'Exposed Nails', 'Evidence of water intrusion', 'Deteriorated', 'Cracked', 'Eroded'];
        vm.EveEdgeOptions=['Cracked', 'Eroded', 'Deteriorated', 'Roof Sheathing', 'Soffits', 'Fascia Boards'];
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
        vm.uploadDocument = uploadDocument;
        vm.uploadDocuments = uploadDocuments;
        vm.convertBase64 = convertBase64;
        vm.uploadDocumentOneByOne = uploadDocumentOneByOne;
        vm.removeElementInArray = removeElementInArray;
        vm.multiplesFiles = [];
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
            // vm.verticalStepper = {
            //     step1: {},
            //     step2: {},
            //     step3: {},
            //     step4: {},
            //     step5: {},
            //     step6: {},
            //     step7: {},
            //     step8: {}
            // };
        }

        function uploadDocument(file) {
            Upload.base64DataUrl(file).then(
                function (url) {
                    vm.verticalStepper.step1.frontSideHouse1 = url;
                });
        }

        function uploadDocumentOneByOne(file, step) {
            Upload.base64DataUrl(file).then(
                function (url) {
                    if (url !== null) {
                        vm.multiplesFiles[step] = [];
                        vm.multiplesFiles[step].push(url);///
                    }
                });
        }

        function removeElementInArray(array, element) {
            const index = array.indexOf(element);

            if (index !== -1) {
                array.splice(index, 1);
            }
        }

        function convertBase64(file) {
            return Upload.base64DataUrl(file).then(
                function (url) {
                    return url;
                });
        }

        function uploadDocuments(files, step) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    Upload.base64DataUrl(files[i]).then(
                        function (url) {
                            vm.multiplesFiles[step] = [];
                            vm.multiplesFiles[step].push(url);
                        });
                }
            }
        }

        vm.uploadFiles = function (files) {
            vm.files = files;

            Upload.base64DataUrl(files).then(function (urls) {
                vm.multiplesFiles = urls;
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
                                //vm.multiplesFiles.push(url);
                            });
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

        vm.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
            }
        };

        vm.exists = function (item, list) {
            return list.indexOf(item) > -1;
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
                    return page + ' of ' + pages;
                },
                content: [
                    {text: 'COMPREHENSIVE INSPECTION REPORT', style: 'header'},
                    {text: 'Requested by: ' + vm.verticalStepper.step1.ownerName, style: 'header'},
                    {
                        image: vm.verticalStepper.step1.frontSideHouse1,
                        fit: [550, 550]
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

                    {text: 'PROPERTY ADDRESS: ' + vm.verticalStepper.step1.ownerAddress, style: ['anotherStyle','margin_top']},
                    {text: 'DATE OF INSPECTION: ' + vm.verticalStepper.step2.dateOfInspection, style: 'anotherStyle'},
                    {
                        text: 'WEATHER CONDITIONS AT TIME OF INSPECTION : ' + getSelectedConditions(vm.verticalStepper.step2.weatherCondition),
                        style: 'anotherStyle'
                    },
                    {
                        text: 'OWNER OCCUPIED : ' + (vm.verticalStepper.step2.ownerOcuppied == undefined || vm.verticalStepper.step2.ownerOcuppied == false) ? 'No' : 'Yes',
                        style: 'anotherStyle'
                    },
                    {
                        text: 'PRESENT AT INSPECTION : ' + getSelectedConditions(vm.verticalStepper.step2.presentAtInspection),
                        style: 'anotherStyle',
                        pageBreak: 'after'
                    },
                    GeneralNotesAndLiability(),
                    CostEstimates(),
                    structuralSystems(),
                    estimatedCost(vm.verticalStepper.step3),
                    addPicturesToTheDocument(vm.multiplesFiles['3']),
                    appliances(),
                    estimatedCost(vm.verticalStepper.step4),
                    addPicturesToTheDocument(vm.multiplesFiles['4']),
                    airConditioningHeatingAndVentingSystems(),
                    estimatedCost(vm.verticalStepper.step5),
                    addPicturesToTheDocument(vm.multiplesFiles['5']),
                    plumbingSystems(),
                    estimatedCost(vm.verticalStepper.step6),
                    addPicturesToTheDocument(vm.multiplesFiles['6']),
                    electricalSystems(),
                    estimatedCost(vm.verticalStepper.step7),
                    addPicturesToTheDocument(vm.multiplesFiles['7']),
                    poolAndSprinklerSystems(),
                    estimatedCost(vm.verticalStepper.step8),
                    addPicturesToTheDocument(vm.multiplesFiles['8']),
                    roof(),
                    estimatedCost(vm.verticalStepper.step9),
                    addPicturesToTheDocument(vm.multiplesFiles['9'])
                ],
                styles: {
                    header: {
                        fontSize: 20,
                        bold: true,
                        alignment: 'center',
                        margin: [20, 20]
                    },
                    anotherStyle: {
                        fontSize: 12,
                        italic: true,
                        alignment: 'center',
                        margin: [20, 5, 20, 5]
                    },
                    h6_header: {
                        fontSize: 12,
                        bold: true,
                        alignment: 'left',
                        margin: [0, 20, 0, 0]
                    },
                    p: {
                        fontSize: 10,
                        alignment: 'justify'
                    },
                    p_header: {
                        fontSize: 10,
                        bold: true,
                        alignment: 'left'
                    },
                    margin_top:{
                        margin: [0, 20, 0, 0]
                    }
                }
            };
            // console.log(docDefinition);
            // if(vm.deviceDetector.os.android){
            //     pdfMake.createPdf(docDefinition).download();
            // }
            // else {
            console.log(docDefinition);
            console.log(JSON.stringify(docDefinition));
            pdfMake.createPdf(docDefinition).open();
            //}

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
        }


        function beautifyArray(list) {
            var selected = "";
            angular.forEach(list, function (value, key) {
                    selected += value + ', ';
            });
            return selected;
        }
        /**
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
                    text: "I visually observed the item, component or unit and if no other comments were made then it appeared to be functioning as intended allowing for normal wear and tear.",
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
                    text: "",
                    style: 'margin_top'
                },
                tableOfEstimates(),
                {
                    text: "NOTE: We recommend all repairs listed should be made only by licensed professional contractors who will warranty their work. We do not guarantee the accuracy of any cost or repair estimates. Cost estimates in the report are an educated opinion by the inspector and are supplied as a guide to the client to determine approximate cost of deficiencies. DO NOT rely on these figures for any type of negotiations or contract purposes, rely only on professional bids. We strongly recommend that three (3) bids be obtained for any repair and/or replacement.",
                    style: "h6_header"
                }
            ]
        }

        function tableOfEstimates() {
            var response = [];
            var minTotal = 0;
            var maxTotal = 0;
            angular.forEach(vm.verticalStepper, (function (item, index) {
                if (item.minRange !== undefined && item.maxRange !== undefined) {
                    minTotal += item.minRange;
                    maxTotal += item.maxRange;
                    response.push({
                        columns: [
                            {text: ''},
                            {text: item.name, style:'p_header'},
                            {text: '$' + item.minRange + ' - $' + item.maxRange , style:'p_header'},
                            {text: ''}
                        ]
                    })
                }
            }));
            response.push({
                columns: [
                    {text: ''},
                    {text: 'TOTALS', style:'p_header'},
                    {text: '$' + minTotal + ' - $' + maxTotal, style:'p_header'},
                    {text: ''}
                ]
            });
            return response;
        }

        /**
         * Return third and fourth page "Structural Systems"
         */
        function structuralSystems() {
            return [
                {text: "STRUCTURAL SYSTEMS", style: "h6_header", pageBreak: 'before', tocItem: true},
                {
                    text: "The Home Inspector shall observe structural components including foundations, ceilings and floors, roof walls, piers or columns. The home inspector shall describe the type of foundation, floor structure, ceiling structure, wall structure, columns or piers, roof structure. The home inspector shall: Report the methods used to observe under floor crawl spaces and attics; Probe and inspect structural components where deterioration is suspected; Enter under floor crawl spaces, basements, and attic spaces except when access is obstructed or unsafe, when entry could be destructive to the property, or when adverse or dangerous situations are suspected; and Report signs of abnormal or harmful water penetration into the building or signs of abnormal or harmful condensation on building components. The home inspector is not required to: Enter any area or perform any procedure that may be destructive to the property or its components or be dangerous to or adversely affect the health of the home inspector or other persons.",
                    style: "p"
                },

                {text: "COMMENTS", style: "h6_header"},
                {
                    columns: [
                        {text: 'Dwelling', style:'p_header'},
                        {text: vm.verticalStepper.step3.dwelling}
                    ]
                }, {
                    columns: [
                        {text: 'Foundation' , style:'p_header'},
                        {text: vm.verticalStepper.step3.foundations}
                    ]
                }, {
                    columns: [
                        {text: 'Construction', style:'p_header'},
                        {text: vm.verticalStepper.step3.construction}
                    ]
                }, {
                    columns: [
                        {text: 'Siding', style:'p_header'},
                        {text: vm.verticalStepper.step3.siding}
                    ]
                },
                {text: "Mechanical operation of openings", style: "h6_header"},
                {
                    columns: [
                        {text: 'Doors (Interior & Exterior)', style:'p_header'},
                        {text: vm.verticalStepper.step3.doors}
                    ]
                }, {
                    columns: [
                        {text: 'Sliding doors', style:'p_header'},
                        {text: vm.verticalStepper.step3.slidingDoors}
                    ]
                }, {
                    columns: [
                        {text: 'Windows', style:'p_header'},
                        {text: vm.verticalStepper.step3.windows}
                    ]
                }, {
                    columns: [
                        {text: 'Walls', style:'p_header'},
                        {text: vm.verticalStepper.step3.walls}
                    ]
                }, {
                    columns: [
                        {text: 'Floors', style:'p_header'},
                        {text: vm.verticalStepper.step3.floors}
                    ]
                }, {
                    columns: [
                        {text: 'Stairways', style:'p_header'},
                        {text: vm.verticalStepper.step3.stairways}
                    ]
                }, {
                    columns: [
                        {text: 'Porches, balconies, Patio', style:'p_header'},
                        {text: vm.verticalStepper.step3.porchesBalconiesPatio}
                    ]
                }, {
                    columns: [
                        {text: 'Decks, and carports', style:'p_header'},
                        {text: vm.verticalStepper.step3.decksCarports}
                    ]
                }, {
                    columns: [
                        {text: 'Garage door operator(s)', style:'p_header'},
                        {text: vm.verticalStepper.step3.garageDoorOperator}
                    ]
                }, {
                    columns: [
                        {text: 'Garage door operator model', style:'p_header'},
                        {text: vm.verticalStepper.step3.garageDoorOperatorModel}
                    ]
                }, {
                    columns: [
                        {text: 'Fireplace/chimney', style:'p_header'},
                        {text: vm.verticalStepper.step3.fireplaceChimney}
                    ]
                },
                deficiencies(vm.verticalStepper.step3.deficiencies)
            ]
        }

        /**
         * Return page "Appliances"
         */
        function appliances() {
            return [
                {text: "APPLIANCES", style: "h6_header", pageBreak: 'before', tocItem: true},
                {
                    text: "Our inspection of major appliances in the kitchen is a combined visual and functional inspection. Power must be supplied to operate appliances. Calibrations to cooking equipment are not evaluated. Please take note that dishwashers can fail at any time due to their complexity. Our purpose is to determine if the system is free of leaks and/or excessive corrosion. Please note that this is beyond the scope of this inspection to operate valves or disconnect supply hoses to these     appliances as they can leak at any time and should be considered a part of normal maintenance.",
                    style: "p"

                },
                {text: "Observed Deficiencies and Notes:", style: "h6_header"},
                {
                    columns: [
                        {text: 'Range/cooktop/ovens', style:'p_header'},
                        {text: vm.verticalStepper.step4.rangeCooktopOvens, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Range Exhaust Vent', style:'p_header'},
                        {text: vm.verticalStepper.step4.rangeExhaustVent, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Refrigerator', style:'p_header'},
                        {text: vm.verticalStepper.step4.refrigerator, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Freezer', style:'p_header'},
                        {text: vm.verticalStepper.step4.freezer, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Icemaker', style:'p_header'},
                        {text: vm.verticalStepper.step4.icemaker, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Ice dispenser', style:'p_header'},
                        {text: vm.verticalStepper.step4.iceDispenser, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Chilled water', style:'p_header'},
                        {text: vm.verticalStepper.step4.chilledWater, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Dishwasher', style:'p_header'},
                        {text: vm.verticalStepper.step4.dishwasher, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Microwave Oven', style:'p_header'},
                        {text: vm.verticalStepper.step4.microwaveOven, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Trash Compactor', style:'p_header'},
                        {text: vm.verticalStepper.step4.trashCompactor, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Mechanical Exhaust Vents and Heaters', style:'p_header'},
                        {text: vm.verticalStepper.step4.mechanicalExhaustVents, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Washer', style:'p_header'},
                        {text: vm.verticalStepper.step4.washer, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Dryer', style:'p_header'},
                        {text: vm.verticalStepper.step4.dryer, style: "p"}
                    ]
                },
                deficiencies(vm.verticalStepper.step4.deficiencies)
            ]
        }

        /**
         * Return page "AIR CONDITIONING, HEATING AND VENTING SYSTEMS"
         */
        function airConditioningHeatingAndVentingSystems() {
            return [
                {
                    text: "AIR CONDITIONING, HEATING AND VENTING SYSTEMS",
                    style: "h6_header",
                    pageBreak: 'before',
                    tocItem: true
                },
                {
                    text: "This inspection determines operating temperatures and exterior condition of the air conditioning and heating systems. All ducts are checked for functional flow. Cover panels are not removed by our personnel. We are unable to determine the condition of sealed systems, i.e. air conditioners; however, temperatures of both the heating and cooling system are noted at the time of inspection. Although temperatures may be satisfactory at time of inspection, this is not to imply that your system is leak free or that it determines the sizing and/or balancing of your system. It is beyond the scope of this inspection to ignite pilot lights or to engage gas should the heating system be gas operated. It is beyond the scope of this inspection to dismantle or inspect internal components of heat exchangers and heating systems. Your local utility company will provide this service upon request. Wall units are checked for cooling only. No warranty is expressed or implied. WE RECOMMEND ALL AIR CONDITIONING UNITS SHOULD BE SERVICED TWICE A YEAR.",
                    style: "p"
                },
                {text: "COOLING EQUIPMENT", style: "h6_header"},
                {
                    columns: [
                        {text: 'Location', style:'p_header'},
                        {text: vm.verticalStepper.step5.CElocation, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Manufacturer', style:'p_header'},
                        {text: vm.verticalStepper.step5.CEmanufacturer, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Year', style:'p_header'},
                        {text: vm.verticalStepper.step5.CEyear, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: ' Temperature acceptable', style:'p_header'},
                        {text: (vm.verticalStepper.step5.CEtemperatureAcceptable !== undefined) ? vm.verticalStepper.step5.CEtemperatureAcceptable : false,  style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Temperature Return', style:'p_header'},
                        {text: vm.verticalStepper.step5.CEtemperatureReturn, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Temperature Register', style:'p_header'},
                        {text: vm.verticalStepper.step5.CEtemperatureRegister, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Type of System', style:'p_header'},
                        {text: vm.verticalStepper.step5.CEtypeOfSystem, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Energy Source', style:'p_header'},
                        {text: vm.verticalStepper.step5.CEenergySource, style: "p"}
                    ]
                },
                {text: "Heating", style: "h6_header"},
                {
                    columns: [
                        {text: 'Temperature Return', style:'p_header'},
                        {text: vm.verticalStepper.step5.HtemperatureReturn, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Temperature Register', style:'p_header'},
                        {text: vm.verticalStepper.step5.HtemperatureRegister, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Type of System', style:'p_header'},
                        {text: vm.verticalStepper.step5.HtypeOfSystem, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Energy Source', style:'p_header'},
                        {text: vm.verticalStepper.step5.HenergySource, style: "p"}
                    ]
                },
                deficiencies(vm.verticalStepper.step5.deficiencies)
            ]
        }

        /**
         * Return page "PLUMBING SYSTEM"
         */
        function plumbingSystems() {
            return [
                {text: "PLUMBING SYSTEM", style: "h6_header", pageBreak: 'before', tocItem: true},
                {
                    text: "This inspection is a visual and functional review of the plumbing system at the time of inspection. This inspection observes water pressure, functional flow and drainage at all fixtures and faucets throughout the structure. Supply and drain lines are checked visually, where accessible. Please note that it is beyond the scope of this inspection to detect leakage, size or condition of non-visible and/or concealed piping, detention/retention ponds, area hydrology or the presence of underground water. Grading and drainage was examined around the foundation perimeter only. Information as to where this property lies in reference to the flood plain is not determined by this inspection. Plumbing code compliance is not evaluated. Sewage systems and wells are not inspected or noted. We recommend inspection of all septic systems and wells by a licensed contractor.",
                    style: "p"
                },
                {
                    text: "NOTES: The plumbing and drainage system will be compromised in properties left vacant and unused for an extended period of time.",
                    style: "p"
                },
                {
                    text: "X-ray inspection by a licensed plumbing company is recommended for houses built prior to 1995. They are likely to have cast iron pipes and are therefore susceptible to leaks.",
                    style: "p"
                },
                {text: "WATER SUPPLY SYSTEM AND FIXTURES", style: "h6_header"},
                {
                    columns: [
                        {text: 'Main Water Supply', style:'p_header'},
                        {text: vm.verticalStepper.step6.mainWaterSupply, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Sewer', style:'p_header'},
                        {text: vm.verticalStepper.step6.sewer, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Supply Piping', style:'p_header'},
                        {text: vm.verticalStepper.step6.supplyPiping, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Drain Piping', style:'p_header'},
                        {text: vm.verticalStepper.step6.drainPiping, style: "p"}
                    ]
                },
                {text: "Water Heater", style: "h6_header"},
                {
                    columns: [
                        {text: 'Location', style:'p_header'},
                        {text: vm.verticalStepper.step6.location, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Manufacturer', style:'p_header'},
                        {text: vm.verticalStepper.step6.manufacturer, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Year', style:'p_header'},
                        {text: vm.verticalStepper.step6.year, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Capacity', style:'p_header'},
                        {text: vm.verticalStepper.step6.capacity, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Energy Source', style:'p_header'},
                        {text: vm.verticalStepper.step6.energySource, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Safety Valves', style:'p_header'},
                        {text: vm.verticalStepper.step6.safetyValves, style: "p"}
                    ]
                }, {
                    columns: [
                        {text: 'Utility Sink', style:'p_header'},
                        {text: vm.verticalStepper.step6.utilitySink, style: "p"}
                    ]
                },
                deficiencies(vm.verticalStepper.step6.deficiencies)
            ]
        }

        /**
         * Return page "ELECTRICAL SYSTEMS"
         */
        function electricalSystems() {
            return [
                {text: "ELECTRICAL SYSTEMS", style: "h6_header", pageBreak: 'before', tocItem: true},
                {
                    text: "This inspection covers the functional evaluation of the visible wiring, fixtures and electrical devices in areas which are accessible at the time of inspection. This inspection is not intended to discover building code violations or check for adequacy of service, sizing of conductors, or conductor material. For safety reasons, panel covers and fuses cannot be removed by inspector. Light fixtures found not working are usually noted as not operational. Electrically operated sprinkler, exterior lighting or pool timer controls are checked on “manual” switch setting. Security systems, intercom systems and security lighting are not within the scope of this inspection.",
                    style: "p"
                }, {
                    text: "It is beyond the scope of the inspection to determine present or future sufficiency of service capacity amperage, voltage, or the capacity of the electrical system; perform voltage drop calculations; determine accuracy of the labeling; operate and verify effectiveness of overcurrent devices.",
                    style: "p"
                },
                {
                    columns: [
                        {text: 'Main Service Disconnect', style:['p_header', 'margin_top']},
                        {text: vm.verticalStepper.step7.mainServiceDisconnect, style: ['p', 'margin_top']}
                    ]
                },
                {
                    columns: [
                        {text: 'Volts', style:'p_header'},
                        {text: vm.verticalStepper.step7.volts, style: "p"}
                    ]
                },
                {
                    columns: [
                        {text: 'Location', style:'p_header'},
                        {text: vm.verticalStepper.step7.location, style: "p"}
                    ]
                },
                {
                    columns: [
                        {text: 'Service Entrance Type', style:'p_header'},
                        {text: vm.verticalStepper.step7.serviceEntranceType, style: "p"}
                    ]
                },
                {
                    columns: [
                        {text: 'Type of wiring', style:'p_header'},
                        {text: vm.verticalStepper.step7.typeOfWiring, style: "p"}
                    ]
                },
                {
                    columns: [
                        {text: 'Circuit breakers', style:'p_header'},
                        {text: vm.verticalStepper.step7.circuitBreakers, style: "p"}
                    ]
                },
                {
                    columns: [
                        {text: 'GFI breakers', style:'p_header'},
                        {text: vm.verticalStepper.step7.GFIBreakers, style: "p"}
                    ]
                },
                {
                    columns: [
                        {text: 'Smoke alarm', style:'p_header'},
                        {text: vm.verticalStepper.step7.smokeAlarm, style: "p"}
                    ]
                },
                {
                    columns: [
                        {text: 'Ceiling fan/s', style:'p_header'},
                        {text: vm.verticalStepper.step7.ceilingFans, style: "p"}
                    ]
                },
                {
                    columns: [
                        {text: ' Are appliances grounded?', style:'p_header'},
                        {text: (vm.verticalStepper.step7.appliancesGrounded == undefined || vm.verticalStepper.step7.appliancesGrounded == false) ? 'No' : 'Yes', style: "p"}
                    ]
                },
                {
                    columns: [
                        {text: 'Doorbell', style:'p_header'},
                        {text: (vm.verticalStepper.step7.doorbell == undefined || vm.verticalStepper.step7.doorbell == false) ? 'No' : 'Yes', style: "p"}
                    ]
                },
                {
                    columns: [
                        {text: 'Electric outlets', style:'p_header'},
                        {text: vm.verticalStepper.step7.electricOutlets, style: "p"}
                    ]
                },
                {
                    columns: [
                        {text: 'Switches', style:'p_header'},
                        {text: vm.verticalStepper.step7.switches, style: "p"}
                    ]
                },
                deficiencies(vm.verticalStepper.step7.deficiencies)
            ]
        }

        /**
         * Return page "POOL SYSTEMS/LAWN AND GARDEN SPRINKLER SYSTEMS"
         */
        function poolAndSprinklerSystems() {
            return [
                {
                    text: "POOL SYSTEMS/LAWN AND GARDEN SPRINKLER SYSTEMS",
                    style: "h6_header",
                    pageBreak: 'before',
                    tocItem: true
                },
                {
                    text: "Please note that our review of the swimming pool and/or sprinkler system is to determine if any systems are functional atthe time of inspection.",
                    style: "p"
                }, {
                    text: "An item noted with a [ S ] indicates that they have been inspected and were found to be in satisfactory condition. An item noted with a [ X ] indicates that they have been inspected and were found to be deficient. An item noted with a [U] was unable to be inspected. [ Y ] = Yes and [ N ] = No . All deficiencies are noted at the lower portion of each page. Please read each page carefully.",
                    style: "p"
                },
                {text: "Swimming Pool:", style: "h6_header"},
                {
                    text: "This inspection is an above-water surface, visual inspection only. Pools are not checked for leaks. Although we check for visible cracks, a definitive test for leakage cannot be done without monitoring the changing water level. Inspector does not dismantle filter or other components; self-cleaning systems, nor is the chemical composition of the water checked. Be advised, chemical analysis, filter tank; interior, accessories, diving boards, ladders, etc. are beyond the scope of this inspection.",
                    style: "p"
                },
                {
                    columns: [
                        {text: 'Pool', style: ['p_header', 'margin_top']},
                        {text: (vm.verticalStepper.step8.pool)?beautifyArray(vm.verticalStepper.step8.contains):'N/A', style: ['p','margin_top']}
                    ]
                },
                {
                    columns: [
                        {text: 'Water Level', style: 'p_header'},
                        {text: (vm.verticalStepper.step8.pool)?vm.verticalStepper.step8.poolWaterLevel: 'N/A', style: "p"}
                    ]
                },
                {
                    columns: [
                        {text: 'Pool Equipment and Finish', style: 'p_header'},
                        {text: (vm.verticalStepper.step8.pool)?beautifyArray(vm.verticalStepper.step8.equipment):'N/A', style: "p"}
                    ]
                },
                {text: "Be advised,", style: "h6_header"},
                {
                    text: "1. POOL MUST BE MONITORED FOR LEAKS.",
                    style: "p"
                },
                {
                    text: "2. Spas and/or pool heating equipment are beyond the scope of this inspection due to the amount of concealed piping, complexity and extended time involved in evaluating their operation. Recommend unit be turned and left on 24 hours prior to the final walk through to verify proper operation. Consult seller for operating instructions and any maintenance requirements.",
                    style: "p"
                },
                {text: "Irrigation System:", style: "h6_header"},
                {
                    text: "The inspection is not a guarantee or warranty of the sprinkler system or its future use. It is based solely on what is visible at the time of inspection. This inspection covers above ground only and does not guarantee the condition of well, water source, or piping.",
                    style: "p"
                },
                {
                    columns: [
                        {text: 'Sprinkler System', style: ['p_header', 'margin_top']},
                        {text: (vm.verticalStepper.step8.sprinkler)?beautifyArray(vm.verticalStepper.step8.sprinklerSystem):'N/A', style:[ 'p','margin_top']}
                    ]
                },
                {
                    columns: [
                        {text: 'Water Source', style: 'p_header'},
                        {text: (vm.verticalStepper.step8.sprinkler)?beautifyArray(vm.verticalStepper.step8.waterSource):'N/A', style: "p"}
                    ]
                },
                {
                    columns: [
                        {text: 'Equipment', style: 'p_header'},
                        {text: (vm.verticalStepper.step8.sprinkler)?beautifyArray(vm.verticalStepper.step8.sprinklerEquipment):'N/A', style: "p"}
                    ]
                },
                {
                    columns: [
                        {text: 'Number of Zones', style: 'p_header'},
                        {text: (vm.verticalStepper.step8.sprinkler)?vm.verticalStepper.step8.numberOfZones:'N/A', style: "p"}
                    ]
                },
                deficiencies(vm.verticalStepper.step8.deficiencies)
            ]
        }

        /**
         * Return Deficiencies
         */
        function deficiencies(deficiencies) {
            return [
                {text: (deficiencies !== undefined) ? 'Deficiencies' : '', style: ['p_header', 'margin_top']},
                {text: (deficiencies !== undefined) ? deficiencies : '', style: ['p']}
            ];
        }

        /**
         * Return page "ROOF"
         */
        function roof() {
            return [
                {
                    text: "ROOF",
                    style: "h6_header",
                    pageBreak: 'before',
                    tocItem: true
                },
                {
                    text: "This is a visual inspection of the roofing system which is accessible at the time of inspection and as such it is strictly intended to determine if portions are missing and/or deteriorating (which can result in leakage). It is beyond the scope of this inspection to determine if underlayment and decking hidden from view are leak free. This inspection is intended to reflect the condition of the roof structure under weather conditions the day of the inspection. This inspection is not intended to determine building code compliance. The safety of roof access is at the inspectors’ discretion. This roof inspection is not a warranty.",
                    style: "p"
                },
                {
                    text: "This inspection is not meant to determine the remaining life of the roof covering, age of the roof covering, identify latent hail damage, determine the number of layers of roof covering material, or provide an exhaustive list of previous repairs and locations of water penetrations/leakage. Roof covering life expectancies can vary depending on several factors (i.e. sun, wind, rain, etc.). The visual inspection of the roof covering thus does not preclude the possibility of leakage. The roof covering will be viewed from the ground if the inspector may damage the roof covering or cannot safely reach or stay on the roof surface.",
                    style: "p"
                },
                {
                    text: "It is considered beyond the scope of this inspection and unsafe to enter attics and unfinished spaces where access is less than 22&quot; x 30&quot;, head room is less than 30&quot;, operate power ventilators, or provide an exhaustive list of locations of water penetrations.",
                    style: "p"
                },
                {
                    text: "Aluminum covers and outbuildings are not within the scope of this inspection.", style: "p"
                },
                {
                    columns: [
                        {text: 'Main Roof Covering', style: ['p_header', 'margin_top']},
                        {text: beautifyArray(vm.verticalStepper.step9.mainRoofCovering), style: ['p', 'margin_top']}
                    ]
                },
                {
                    columns: [
                        {text: 'Main Roof Pitch', style: 'p_header'},
                        {text: beautifyArray(vm.verticalStepper.step9.mainRoofPitch), style: "p"}
                    ]
                },
                {
                    columns: [
                        {text: 'Secondary Roof Covering', style: 'p_header'},
                        {text: (vm.verticalStepper.step9.secondaryRoof) ? beautifyArray(vm.verticalStepper.step9.secondaryRoofCovering) : 'N/A', style: "p"}
                    ]
                },
                {
                    columns: [
                        {text: 'Secondary Roof Pitch', style: 'p_header'},
                        {text: (vm.verticalStepper.step9.secondaryRoof) ? beautifyArray(vm.verticalStepper.step9.secondaryRoofPitch) : 'N/A', style: "p"}
                    ]
                }, {

                    columns: [
                        {text: 'Attic Access', style: 'p_header'},
                        {text: beautifyArray(vm.verticalStepper.step9.atticAccess), style: "p"}
                    ]
                },{

                    columns: [
                        {text: 'Attic Insulation/Ventilation', style: 'p_header'},
                        {text: beautifyArray(vm.verticalStepper.step9.atticInsulationVentilation), style: "p"}
                    ]
                },{

                    columns: [
                        {text: 'Roof/Attic Structure', style: 'p_header'},
                        {text: beautifyArray(vm.verticalStepper.step9.roofStructure), style: "p"}
                    ]
                },{

                    columns: [
                        {text: 'Woodwork', style: 'p_header'},
                        {text: beautifyArray(vm.verticalStepper.step9.woodWork), style: "p"}
                    ]
                },{

                    columns: [
                        {text: 'Evidence of Leaks', style: 'p_header'},
                        {text: beautifyArray(vm.verticalStepper.step9.leaks), style: "p"}
                    ]
                },{

                    columns: [
                        {text: 'Tiles', style: 'p_header'},
                        {text: beautifyArray(vm.verticalStepper.step9.brokenTiles), style: "p"}
                    ]
                },{

                    columns: [
                        {text: 'Shingles/ Roll Roofing', style: 'p_header'},
                        {text: beautifyArray(vm.verticalStepper.step9.rollRoofing), style: "p"}
                    ]
                },{

                    columns: [
                        {text: "Eve Edge/ Tie In's", style: 'p_header'},
                        {text: beautifyArray(vm.verticalStepper.step9.eveEdge), style: "p"}
                    ]
                },
                {
                    text: "Age Projections", style: "h6_header"
                },
                {
                    text:"Your roof’s approximate life expectancy is based on accepted industry standards.",
                    style:'p'
                },
                {
                    text: "The structure was built in "+vm.verticalStepper.step1.yearsOld+ " That makes it "+(vm.currentYear-vm.verticalStepper.step1.yearsOld)+" years old.", style: "p"
                },
                {
                    text: "Roof actual age is "+vm.verticalStepper.step9.mainRoofAge, style: "p"
                },
                {
                    text: "Main roof has a remaining life expectancy of "+calculateRoofExpectansyLive(vm.verticalStepper.step9.mainRoofAge, vm.verticalStepper.step9.mainRoofCovering)+" years.", style: "p"
                },
                {
                    text: "Secondary roof has a remaining life expectancy of "+calculateRoofExpectansyLive(vm.verticalStepper.step9.secondaryRoofAge, vm.verticalStepper.step9.secondaryRoofCovering)+" years.", style: "p"
                },
                deficiencies(vm.verticalStepper.step9.deficiencies)
            ]
        }

        function addPicturesToTheDocument(pictures) {
            if (pictures !== undefined) {
                var temp = [];
                for (var i = 0; i < pictures.length; i += 2) {
                    var second = i + 1;
                    temp.push({
                        columns: [{
                            image: pictures[i],
                            fit: [250, 250]
                        },
                            (pictures[second] !== undefined) ? {
                                    image: pictures[second],
                                    fit: [250, 250]
                                } : {}
                        ]
                    });
                }
                return temp;
            } else return {};
        }

        function estimatedCost(step) {
            return (step.minRange !== undefined) ? {
                    columns: [
                        {text: ''},
                        {
                            text: "Estimated cost of repairs: $" + step.minRange + " - $" + step.maxRange,
                            pageBreak: 'after',
                            style:'p_header'
                        }
                    ]
                } : {};
        }

        function calculateRoofExpectansyLive(currentAge, covering) {
            var expectedLife = 30;
            angular.forEach(covering, function (item) {
                if (item == '25# Shingle' || item == '3 Tab Shingle') {
                    expectedLife = 15;
                }
            });
            return currentAge-expectedLife;
        }
        function setDefaults(vm) {
            vm.verticalStepper.step8.poolWaterLevel='Normal';
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