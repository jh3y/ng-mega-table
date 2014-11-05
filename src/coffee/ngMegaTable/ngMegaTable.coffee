###
  ng-mega-table : https://github.com/jh3y/ng-mega-table
  Licensed under the MIT license
  Jhey Tompkins (c) 2014.

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
###

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
              cell = '<td style="' + options.style + '">' + context[options.key] + '</td>'
            else if options.type and options.type is 'action'
              cell = '<td style="' + options.style + '"><button class="' + options.buttonClasses + '" ' + options.buttonAttributes + '="' + context[options.actionParams] + '" >' + options.buttonText + '</button></td>'
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
