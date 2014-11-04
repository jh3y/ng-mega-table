angular.module('ngMegaTableDemo.Controllers')
  .controller 'DemoCtrl', (
      $rootScope,
      $scope,
      $location,
      $timeout,
      $routeParams,
      DataSrv
    ) ->

    $scope.loadData = (size = 10, delay = 2000)->
      $timeout(->
        $scope.data = DataSrv.get size
        console.log $scope.data
        $rootScope.$broadcast 'data:changed', $scope.data
      , delay)

    return
