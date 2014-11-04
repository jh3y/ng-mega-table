angular.module('ngMegaTableDemo')
  .config ($routeProvider) ->
    $routeProvider.when("/",
      templateUrl: "demo.html"
    ).otherwise redirectTo: "/"
