(function(){angular.module('ngMegaTable.directives', []).directive('ngMegaTable', [
  '$templateCache', function($templateCache) {
    return {
      templateUrl: 'ngMegaTable.html',
      restrict: 'AE',
      transclude: false,
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
        var $tbody, $tbodyTemplate, $thead, $theadTemplate, opts;
        Handlebars.registerHelper('megaTableCell', function(context, options) {
          var cell;
          cell = '';
          if (options.type && options.type === 'static') {
            cell = '<td>' + context[options.selector] + '</td>';
          } else if (options.type && options.type === 'action') {
            cell = '<td><button class="' + options.classes + '" ' + options.attributes + '="' + context[options.actionParams] + '" >' + options.actionLabel + '</button></td>';
          }
          return cell;
        });
        opts = $scope.tableOptions;
        $tbody = $elem.find('tbody');
        $thead = $elem.find('thead');
        $theadTemplate = Handlebars.compile($templateCache.get('ngMegaTableHead.html'));
        $tbodyTemplate = Handlebars.compile($templateCache.get('ngMegaTableBody.html'));
        $thead.replaceWith($theadTemplate(opts));
        console.info('mega table loaded');

        /*
         Click Handling for mega table
         */
        $elem.on('click', function(e) {
          if (e && e.target && e.target.hasAttribute('select-item')) {
            console.log('invoke scope action');
            return opts.actions.selectItem(e.target.getAttribute('select-item'));
          }
        });

        /*
          Initialise templates and variables for table
         */

        /*
          Handle data change event for table
         */
        if (opts.changeEvent === undefined) {
          throw new Error('ngMegaTable: no data change event defined');
        } else {
          $scope.$on(opts.changeEvent, function(e, data) {
            $scope.$apply(function() {
              if (data.length === 0) {
                return $tbody.html($('<h4>No data currently available</h4>'));
              } else {
                opts.items = data;
                return $tbody.replaceWith($($tbodyTemplate(opts)));
              }
            });
            return $scope.loading = false;
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

angular.module("ngMegaTable").run(["$templateCache", function($templateCache) {$templateCache.put("ngMegaTable.html","<div class=\"mega-table\"><table ng-class=\"{loading: loading}\"><thead></thead><tbody></tbody></table></div>");
$templateCache.put("ngMegaTableBody.html","<tbody class=\"ng-mega-table-body\">{{#items}}<tr>{{#../columns}}  \n{{#megaTableCell ../this this}}\n{{/megaTableCell}}\n{{/../columns}}</tr>{{/items}}</tbody>");
$templateCache.put("ngMegaTableHead.html","<thead><tr>{{#each columns}}<th id=\"{{this.id}}\">{{this.label}}</th>{{/each}}</tr></thead>");}]);}());