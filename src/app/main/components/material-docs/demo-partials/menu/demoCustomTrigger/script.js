angular
  .module('menuDemoCustomTrigger', ['ngMaterial'])
  .config(function($mdIconProvider) {
    $mdIconProvider
      .iconSet('call', 'assets/angular-material-assets/img/icons/sets/communication-icons.svg', 24);
  });
