angular.module('ngMegaTable.directives', [])
  .directive 'ngMegaTable', [
    '$templateCache',
    ($templateCache) ->
      return {
        templateUrl: 'ngMegaTable.html'
        restrict: 'AE'
        transclude: true
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
              cell = '<td style="' + options.style + '">' + context[options.selector] + '</td>'
            else if options.type and options.type is 'action'
              cell = '<td style="' + options.style + '"><button class="' + options.classes + '" ' + options.attributes + '="' + context[options.actionParams] + '" >' + options.actionLabel + '</button></td>'
            cell

          renderTHead = (opts) ->
            $thead = $elem.find 'thead'
            $theadTemplate = Handlebars.compile $templateCache.get('ngMegaTableHead.html')
            $thead.replaceWith $theadTemplate(opts)

          renderTBody = (data) ->
            $tbody = $elem.find 'tbody'
            $tbodyTemplate = Handlebars.compile $templateCache.get('ngMegaTableBody.html')
            $scope.$apply ->
              if data.length is 0
                $tbody.html $('<h4>No data currently available</h4>')
              else
                opts.items = data
                $tbody.replaceWith $($tbodyTemplate(opts))
            $scope.loading = false

          ###
            Initialise templates and variables for table
          ###
          opts = $scope.tableOptions
          renderTHead opts

          ###
           Click Handling for mega table
          ###
          $elem.on 'click', (e) ->
            [].forEach.call opts.columns, (column, index) ->
              if column.type and column.type is 'action'
                if e and e.target and e.target and (e.target.hasAttribute(column.selector) or e.target.className.indexOf(column.selector) isnt -1)
                  opts.actions[column.action] e.target.getAttribute(column.actionParamsAttribute)


          ###
            Handle data change event for table
          ###
          if opts.changeEvent is `undefined`
            throw new Error 'ngMegaTable: no data change event defined'
          else
            $scope.$on opts.changeEvent, (e, data) ->
              renderTBody data

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
