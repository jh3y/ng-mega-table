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
        key: 'id'
        style: 'width: 80px; max-width: 80px;'
      ,
        type: 'static'
        label: 'Name'
        id: 'name'
        key: 'name'
        style: 'width: 80px; max-width: 80px;'
      ,
        type: 'static'
        label: 'Value'
        id: 'value'
        key: 'value'
        style: 'width: 80px; max-width: 80px;'
      ,
        type: 'action'
        buttonText: 'Select Item'
        buttonAttributes: 'select-item'
        buttonClasses: 'btn btn-default'
        id: 'selectItem'
        selector: 'select-item'
        actionParams: 'id'
        actionParamsAttribute: 'select-item'
        action: 'selectItem'
        style: 'width: 120px; max-width: 120px;'
      ]

    $scope.loadData = (size = 10, delay = 2000)->
      $rootScope.$broadcast 'data:loading'
      if $scope.dataSize and $scope.dataSize.trim() isnt ''
        if !isNaN parseInt($scope.dataSize, 10)
          size = $scope.dataSize
      $timeout(->
        $scope.data = DataSrv.get size
        $rootScope.$broadcast 'data:changed', $scope.data
      , delay)

    return
