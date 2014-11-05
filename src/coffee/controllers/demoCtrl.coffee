angular.module('ngMegaTableDemo.Controllers')
  .controller 'DemoCtrl', (
      $rootScope,
      $scope,
      $location,
      $timeout,
      $routeParams,
      DataSrv
    ) ->
    $scope.selectItem = (itemId) ->
      alert 'selecting item with ID ' + itemId

    $scope.tableActions =
      addItem: $scope.selectItem

    $scope.tableOptions =
      changeEvent: 'data:changed'
      loadEvent: 'data:loading'
      actions:
        selectItem: $scope.selectItem
      columns: [
        type: 'static'
        label: 'Id'
        id: 'id'
        selector: 'id'
      ,
        type: 'static'
        label: 'Name'
        id: 'name'
        selector: 'name'
      ,
        type: 'static'
        label: 'Value'
        id: 'value'
        selector: 'value'
      ,
        type: 'action'
        actionLabel: 'Select Item'
        attributes: 'select-item'
        classes: 'btn btn-default'
        id: 'selectItem'
        selector: 'select-item'
        actionParams: 'id'
        actionParamsAttribute: 'select-item'
        action: 'selectItem'
      ]

    $scope.loadData = (size = 10, delay = 2000)->
      $rootScope.$broadcast 'data:loading'
      $timeout(->
        $scope.data = DataSrv.get size
        $rootScope.$broadcast 'data:changed', $scope.data
      , delay)

    return
