var ionicTableModule = angular.module('ionicTable', ['ionic']);

ionicTableModule.directive('ionTable', ['$timeout', function ($timeout) {
  return {
    restrict: 'A',
    template: '<div class="table" ng-transclude="" ng-if="!reset">',
    transclude: true,
    link: function (scope, element, attr) {

      var existing = window.onresize;

      window.onresize = function () {
        if (existing) {existing()}
          $timeout(function(){scope.reset = true;});
          $timeout(function () {
            scope.reset = false;
            $timeout(setCellWidth);
          }, 100);
      };

      $timeout(setCellWidth);

      function setCellWidth() {
        var div = angular.element(angular.element(angular.element(element.children()[0]).children()[0]).children()[0]),
            selectElements = element.find('select'),
            uls = [],
            cellContainers = [],
            cellWidths = [],
            rows = [],
            cellWidths,
            widestCell = {
              width: null,
              index: null
            },
            widthsToUse = [],
            totalCellWidth = 0,
            tempCellWidth = 0,
            widthsToUseCopy,
            individualCell,
            individualWidth,
            tempCells,
            ulLength,
            singleUl,
            padding,
            oldRows,
            tempCellContainer,
            biggestCell,
            newCell,
            styleAttr,
            windowDifference;

        for (var ul in div.children()) {
          if (!isNaN(parseInt(ul))) {
            uls.push(angular.element(div.children()[ul]));
          }
        }

        for (ul in uls) {
          tempCellContainer = uls[ul];
          for (var li in tempCellContainer) {
            if (!isNaN(parseInt(li))) {
              cellContainers.push(angular.element(tempCellContainer.children()[li]));
            }
          }
        }

        for (var cellContainer in cellContainers) {
          tempCells = angular.element(cellContainers[cellContainer][0]).children();
          ulLength = tempCells.length;
          for (var i = 1; i <= ulLength; i++) {
            singleUl = [];
            for (li in tempCells) {
              if (!isNaN(parseInt(li))) {
                singleUl.push($(tempCells[li]));
              }
            }
          }
          rows.push(singleUl);
        }

        for (i = 0; i < ulLength; i++) {
          cellWidths.push({
            cellIndex: parseInt(i),
            widths: []
          });
        }

        for (var row in rows) {
          for (var cell in rows[row]) {
            individualCell = rows[row][cell];
            for (var cellWidth in cellWidths) {
              if (cellWidths[cellWidth].cellIndex === parseInt(cell)) {
                if (individualCell.has('select').length > 0) {
                  cellWidths[cellWidth].widths.push($(individualCell.children('select')).innerWidth());
                } else {
                  cellWidths[cellWidth].widths.push(individualCell.innerWidth());
                }
              }
            }
          }
        }

        for (cellWidth in cellWidths) {
          widthsToUse.push(Math.max.apply(Math, cellWidths[cellWidth].widths));
        }

        for (var widthToUse in widthsToUse) {
          if (parseInt(widthToUse) !== widthsToUse.length - 1) {
            totalCellWidth += widthsToUse[widthToUse];
          }
        }

        var windowDifference = window.innerWidth - totalCellWidth;

        if (windowDifference < 0) {
          widthsToUseCopy = angular.copy(widthsToUse);
          biggestCell = Math.max.apply(Math, widthsToUseCopy);
          widthsToUseCopy.splice(widthsToUseCopy.indexOf(biggestCell), 1);
          for (var tempWidths in widthsToUseCopy) {
            tempCellWidth += widthsToUseCopy[tempWidths];
          }
          newCell = window.innerWidth - tempCellWidth;
          widthsToUseCopy.splice(widthsToUse.indexOf(biggestCell), 0, newCell);
          angular.copy(widthsToUseCopy, widthsToUse);
        }

        for (widthToUse in widthsToUse) {
          for (row in rows) {
            if (parseInt(widthToUse) !== widthsToUse.length - 1) {
              rows[row][widthToUse].animate({width: widthsToUse[widthToUse] + 'px'}, 275);
            } else {
              if (windowDifference > 0 && windowDifference > widthsToUse[widthToUse]) {
                rows[row][widthToUse].animate({width: windowDifference + 'px'}, 275);
              } else {                
                rows[row][widthToUse].animate({width: widthsToUse[widthToUse] + 'px'}, 275);
              }
            }
          }
        }

        for (var selectElement in selectElements) {
          if (!isNaN(parseInt(selectElement))) {
            styleAttr = $(selectElements[selectElement]).parent().attr('style');
            styleAttr = parseInt(styleAttr.split(' ')[1].split('p')[0]);
            $(selectElements[selectElement]).animate({width: styleAttr - 1 + 'px'}, 275);
          }
        }

      }

    }
  }
}]);