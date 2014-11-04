angular.module('ngMegaTable.directives', [])
  .directive 'ngMegaTable', [
    '$templateCache',
    ($templateCache) ->
      return {
        templateUrl: 'ngMegaTable.html'
        restrict: 'AE'
        transclude: false
        replace: true
        scope:
          tableOptions: '='
        link: ($scope, $elem, $attrs, $ctrl) ->

          ###
            Creating a mega cell Handlebars helper.
            Context will be the item of data being used whilst
            options are the column options.

            We need both to extract the cell type and the data to be displayed.
          ###
          Handlebars.registerHelper 'megaTableCell', (context, options) ->
            cell = ''
            if options.type and options.type is 'static'
              cell = '<td>' + context[options.selector] + '</td>'
            else if options.type and options.type is 'action'
              cell = '<td><button class="' + options.classes + '" ' + options.attributes + '="' + context[options.actionParams] + '" >' + options.actionLabel + '</button></td>'
            cell
          opts = $scope.tableOptions
          $tbody = $elem.find 'tbody'
          $thead = $elem.find 'thead'
          $theadTemplate = Handlebars.compile $templateCache.get('ngMegaTableHead.html')
          $tbodyTemplate = Handlebars.compile $templateCache.get('ngMegaTableBody.html')
          $thead.replaceWith $theadTemplate(opts)
          console.info 'mega table loaded'

          ###
           Click Handling for mega table
          ###
          #Iterate over the columns array and pick out actions selectors and actions
          $elem.on 'click', (e)->
            if e and e.target and e.target.hasAttribute 'select-item'
              console.log 'invoke scope action'
              # console.log $scope.rowActions
              opts.actions.selectItem e.target.getAttribute('select-item')
              # $scope.rowAction

          ###
            Initialise templates and variables for table
          ###



          ###
            Handle data change event for table
          ###
          if opts.changeEvent is `undefined`
            throw new Error 'ngMegaTable: no data change event defined'
          else
            $scope.$on opts.changeEvent, (e, data) ->
              $scope.$apply ->
                if data.length is 0
                  $tbody.html $('<h4>No data currently available</h4>')
                else
                  opts.items = data
                  $tbody.replaceWith $($tbodyTemplate(opts))
              $scope.loading = false

          ###
            Handle loading event for table to apply CSS
          ###
          if opts.loadEvent is `undefined`
            throw new Error 'ngMegaTable: no data loading event defined'
          else
            $scope.$on opts.loadEvent, (e, data) ->
              $scope.loading = true

      }
  ]



angular.module 'ngMegaTable', ['ngMegaTable.directives']
