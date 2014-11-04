angular.module('ngMegaTableDemo')
  .config ($routeProvider) ->
    $routeProvider.when("/",
      templateUrl: "views/demo.html"
    ).otherwise redirectTo: "/"
