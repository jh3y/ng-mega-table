angular.module('ngMegaTableDemo.Services')
  .factory 'DataSrv', [ ->
      generateData = (size = 5) ->
        data = []
        i = 0
        while i < size
          data.push
            name: 'myName'
            id: '#' + i
            value: i * 2
          i++
        data
      return {
          get: (size) ->
            generateData size
      }
  ]
