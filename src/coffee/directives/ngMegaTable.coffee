angular.module('ngMegaTableDemo.Directives')
  .directive 'ngMegaTable', [
    '$templateCache',
    ($templateCache) ->
      return {
        templateUrl: 'directives/ngMegaTable.html'
        restrict: 'AE'
        # require: 'ngModel'
        transclude: false
        replace: true
        scope:
          changeEvent: '@'
          loadEvent: '@'
        link: ($scope, $elem, $attrs, $ctrl) ->
          console.info 'mega table loaded'
          $tbodyTemplate = $templateCache.get 'directives/ngMegaTableBody.html'
          console.info 'template for tbody', $tbodyTemplate
          if $scope.changeEvent is `undefined`
            throw new Error 'ngMegaTable: no data change event defined'
          if $scope.loadEvent is `undefined`
            throw new Error 'ngMegaTable: no data loading event defined'
          $tbody = $elem.find 'tbody'
          $scope.loading = true
          $scope.$on 'data:changed', (e, data) ->
            $scope.loading = false
            $scope.$apply ->
              if data.length is 0
                $tbody.html $('<h4>No data currently available</h4>')
              else
                $tbody.html data.toString()
          # $elem
          #   .find('h4')
          #   .on 'blur', () ->
          #     $scope.$apply () ->
          #       $scope.todo.title = $elem.find('h4').html()
          #       console.info 'Todo title updated'
          # $elem
          #   .find('p')
          #   .on 'blur', () ->
          #     $scope.$apply () ->
          #       $scope.todo.content = $elem.find('p').html()
          #       console.info 'Todo content updated'
          # $ctrl.$render = () ->
            # $elem.find('h4').html $scope.todo.title
            # $elem.find('p').html $scope.todo.content
      }
  ]
