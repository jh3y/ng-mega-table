ng-mega-table
================

An angular directive for handling mega data.

        <ng-mega-table table-options="<yourTableOptions>"></ng-mega-table>

This is a directive put together to show how you can overcome handling large datasets in angular by making use of templating using libraries like Handlebars.js

##Getting started
###Prerequisites
It is assumed that you have __bower__ and __node__ installed.


1. Clone the repo

        git clone https://github.com/jh3y/ng-mega-table

2. Navigate to repo and install dependencies

        cd ng-mega-table
        bower install
        npm install

3. Start hacking on `localhost:1987`!

        gulp

#That's it!

##Options
In order to use `ng-mega-table` you need to define an object containing table options that are then passed in via a table options attribute.

        <ng-mega-table table-options="<yourTableOptions>"></ng-mega-table>


###The options
* `changeEvent` - define string name for change event that table should listen out for to pick up data changes.
* `loadEvent`: - define string name for load event that table should listen out for to pick up when data is in process of changing.
* `actions` - an object whose keys are identifiers for actions that will be used by rows in the table. For example;

            actions: {
              'selectItem': $scope.selectItem
            }

* `columns` - an object array that defines table columns. Each column has it's own set of options. For example;

        columns: [
          {
            type: 'static'
            label: 'Id'
            id: 'id'
            key: 'id'
            style: 'width: 80px; max-width: 80px;'
          },
          {
            type: 'action'
            actionLabel: 'Select Item'
            attributes: 'select-item'
            classes: 'btn btn-default'
            id: 'selectItem'
            selector: 'select-item'
            actionParams: 'id'
            actionParamsAttribute: 'select-item'
            action: 'selectItem'
            style: 'width: 120px; max-width: 120px;'
          }
        ]

* `type` - ['static', 'action'] - defines the type of cell. Static displays data whereas action will render a button within the cell.
* `label` - String that defines the column title.
* `id` - String defining the column Id.
* `key` - String defining the data key to be used for grabbing data.
* `selector` - String defining the selector, either className or attribute to be used by generic click handling event.
* `action` - String defining action name to be invoked when action cell button is clicked.
* `actionParams` - The key of data to be used when setting value of action attribute for button within the action cell.
* `actionParamsAttribute` - String defining attribute to grab data from within click handler.
* `style` - Allows the setting of inline styles for table cells (particularly handy for setting column widths)
* `buttonText` - String defining action button text
* `buttonClasses` - String that defines class names for aciton button.
* `buttonAttributes` - String that defines attributes for action button.

Admittedly, that list of options is a little confusing. However, this is in the interest of a generic implementation. For example the following;

        {
          type: 'action'
          actionLabel: 'Select Item'
          attributes: 'select-item'
          classes: 'btn btn-default'
          id: 'selectItem'
          selector: 'select-item'
          actionParams: 'id'
          actionParamsAttribute: 'select-item'
          action: 'selectItem'
          style: 'width: 120px; max-width: 120px;'
        }

Will make use of Handlebars helpers to render a cell like

        <td style="width: 120px; max-width: 120px;">
          <button class="btn btn-default" select-item="<the id of the data item>">Select Item</button>
        </td>

##Hacking
`ng-mega-table` is created using `gulp`. Just running `gulp` will get you set up to develop `ng-mega-table`.

CoffeeScript, LESS, and Jade are used to develop `ng-mega-table`. The best way to tweak the tables behaviour and appearance is to just get stuck in and go through the code (there isn't much to it!). If you get stuck you can always leave an issue.

##Contributions and Suggestions
As always, feel free to tweet me or leave an issue!

@jh3y 2014
