(function(){angular.module('ngMegaTable.directives', []).directive('ngMegaTable', [
  '$templateCache', function($templateCache) {
    return {
      templateUrl: 'ngMegaTable.html',
      restrict: 'AE',
      transclude: true,
      replace: true,
      scope: {
        tableOptions: '='
      },
      link: function($scope, $elem, $attrs, $ctrl) {

        /*
          Creating a mega cell Handlebars helper.
          Context will be the item of data being used whilst
          options are the column options.
          We need both to extract the cell type and the data to be displayed.
         */
        var opts, renderTBody, renderTHead;
        Handlebars.registerHelper('megaTableCell', function(context, options) {
          var cell;
          cell = '';
          if (options.type && options.type === 'static') {
            cell = '<td style="' + options.style + '">' + context[options.key] + '</td>';
          } else if (options.type && options.type === 'action') {
            cell = '<td style="' + options.style + '"><button class="' + options.buttonClasses + '" ' + options.buttonAttributes + '="' + context[options.actionParams] + '" >' + options.buttonText + '</button></td>';
          }
          return cell;
        });
        renderTHead = function(opts) {
          var $thead, $theadTemplate;
          $thead = $elem.find('thead');
          $theadTemplate = Handlebars.compile($templateCache.get('ngMegaTableHead.html'));
          return $thead.replaceWith($theadTemplate(opts));
        };
        renderTBody = function(data) {
          var $tbody, $tbodyTemplate;
          $tbody = $elem.find('tbody');
          $tbodyTemplate = Handlebars.compile($templateCache.get('ngMegaTableBody.html'));
          $scope.$apply(function() {
            if (data.length === 0) {
              return $tbody.html($('<h4>No data currently available</h4>'));
            } else {
              opts.items = data;
              return $tbody.replaceWith($($tbodyTemplate(opts)));
            }
          });
          return $scope.loading = false;
        };

        /*
          Initialise templates and variables for table
         */
        opts = $scope.tableOptions;
        renderTHead(opts);

        /*
         Click Handling for mega table
         */
        $elem.on('click', function(e) {
          return [].forEach.call(opts.columns, function(column, index) {
            if (column.type && column.type === 'action') {
              if (e && e.target && e.target && (e.target.hasAttribute(column.selector) || e.target.className.indexOf(column.selector) !== -1)) {
                return opts.actions[column.action](e.target.getAttribute(column.actionParamsAttribute));
              }
            }
          });
        });

        /*
          Handle data change event for table
         */
        if (opts.changeEvent === undefined) {
          throw new Error('ngMegaTable: no data change event defined');
        } else {
          $scope.$on(opts.changeEvent, function(e, data) {
            return renderTBody(data);
          });
        }

        /*
          Handle loading event for table to apply CSS
         */
        if (opts.loadEvent === undefined) {
          throw new Error('ngMegaTable: no data loading event defined');
        } else {
          return $scope.$on(opts.loadEvent, function(e, data) {
            return $scope.loading = true;
          });
        }
      }
    };
  }
]);

angular.module('ngMegaTable', ['ngMegaTable.directives']);

angular.module("ngMegaTable").run(["$templateCache", function($templateCache) {$templateCache.put("ngMegaTable.html","<div class=\"mega-table\"><table><thead></thead></table><table ng-class=\"{loading: loading}\"><tbody></tbody></table></div>");
$templateCache.put("ngMegaTableBody.html","<tbody class=\"ng-mega-table-body\">{{#items}}<tr>{{#../columns}}  \n{{#megaTableCell ../this this}}\n{{/megaTableCell}}\n{{/../columns}}</tr>{{/items}}</tbody>");
$templateCache.put("ngMegaTableHead.html","<thead><tr>{{#each columns}}<th id=\"{{this.id}}\" style=\"{{this.style}}\">{{this.label}}</th>{{/each}}</tr></thead>");}]);}());