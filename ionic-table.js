'use strict';

var ionicTableModule = angular.module('ionic-table', [])

.config(function () {  
  $('<style type="text/css">.item-select,.table-select{position:' +
    'relative}.item-select select,.table-select select{-webkit-' +
    'appearance:none;appearance:none;position:absolute;top:0;bottom:0;' +
    'right:0;padding:0 48px 0 16px;max-width:65%;border:none;' +
    'background:#fff;color:#333;text-indent:.01px;text-overflow:"";' +
    'white-space:nowrap;font-size:14px;cursor:pointer;direction:rtl}' +
    '.item-select select::-ms-expand,.table-select select::-ms-expand' +
    '{display:none}.item-select option,.table-select option{direction:' +
    'ltr}.item-select:after,.table-select:after{position:absolute;top:' +
    '50%;right:16px;margin-top:-3px;width:0;height:0;border-top:5px ' +
    'solid;border-right:5px solid transparent;border-left:5px solid ' +
    'transparent;color:#999;content:"";pointer-events:none}.item-light.' +
    'table-select select,.item-select.item-light select{background:' +
    '#fff;color:#444}.item-select.item-stable select,.item-stable.' +
    'table-select select{background:#f8f8f8;color:#444}.item-select' +
    '.item-stable .input-label,.item-select.item-stable:after,.item-' +
    'stable.table-select .input-label,.item-stable.table-select:after' +
    '{color:#656565}.item-positive.table-select select,.item-select' +
    '.item-positive select{background:#387ef5;color:#fff}.item-positive' +
    '.table-select .input-label,.item-positive.table-select:after,' +
    '.item-select.item-positive .input-label,.item-select.item-positive' +
    ':after{color:#fff}.item-calm.table-select select,.item-select' +
    '.item-calm select{background:#11c1f3;color:#fff}.item-calm' +
    '.table-select .input-label,.item-calm.table-select:after,' +
    '.item-select.item-calm .input-label,.item-select.item-calm:after' +
    '{color:#fff}.item-assertive.table-select select,.item-select.item-' +
    'assertive select{background:#ef473a;color:#fff}.item-assertive' +
    '.table-select .input-label,.item-assertive.table-select:after,' +
    '.item-select.item-assertive .input-label,.item-select' +
    '.item-assertive:after{color:#fff}.item-balanced.table-select ' +
    'select,.item-select.item-balanced select{background:#33cd5f;' +
    'color:#fff}.item-balanced.table-select .input-label,.item-' +
    'balanced.table-select:after,.item-select.item-balanced ' +
    '.input-label,.item-select.item-balanced:after{color:#fff}.item-' +
    'energized.table-select select,.item-select.item-energized select' +
    '{background:#ffc900;color:#fff}.item-energized.table-select ' +
    '.input-label,.item-energized.table-select:after,.item-select' +
    '.item-energized .input-label,.item-select.item-energized:after' +
    '{color:#fff}.item-royal.table-select select,.item-select' +
    '.item-royal select{background:#886aea;color:#fff}.item-royal' +
    '.table-select .input-label,.item-royal.table-select:after,' +
    '.item-select.item-royal .input-label,.item-select.item-royal:' +
    'after{color:#fff}.item-dark.table-select select,.item-select' +
    '.item-dark select{background:#444;color:#fff}.item-dark' +
    '.table-select .input-label,.item-dark.table-select:after,' +
    '.item-select.item-dark .input-label,.item-select.item-dark:after' +
    '{color:#fff}.table *{font-size:14px}.table .table-row:first-child' +
    '{margin-top:-2px}.table .table-head{background:#ddd;text-align:' +
    'center;color:#000}.table ul{display:-webkit-box;display:flex}' +
    '.table ul li{display:inline-block;padding:16px;' +
    'white-space:normal}.table li:not(:last-child){border-right:1px ' +
    'solid #ddd}.table-row{padding:0}.table-select, .table-input{overflow:' +
    'hidden}.table-select select, .table-input input{max-width:none;padding' +
    '-right:35px}.icon-only{position:relative;text-align:center}.icon-only i,' +
    '.icon-only span{font-size:32px;width:100%;position:absolute;' +
    'top:calc(50% - 14px);left:0}.table-input input{text-align:center ' +
    '!important}</style>')
  .appendTo('head');

  (function($,sr){
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            };

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    }
    // smartresize 
    jQuery.fn[sr] = function(fn){  return fn ? this
      .bind('resize', debounce(fn)) : this.trigger(sr); };

  })(jQuery,'smartresize');

})

.run(function ($rootScope) {
  // Keyboard events
  window.addEventListener('native.keyboardshow', function () {
    $rootScope.$broadcast('keyboard:show');
  });
  window.addEventListener('native.keyboardhide', function () {
    $rootScope.$broadcast('keyboard:hide');
  });
})

.directive('ionTable', ['$timeout', '$ionicScrollDelegate',
  function ($timeout, $ionicScrollDelegate) {
  return {
    restrict: 'A',
    template: '<div class="table" ng-transclude="">',
    transclude: true,
    link: function (scope, element, attr) {

      var exceptionShown,
          rows = [],
          selectElements = element.find('select'),
          inputElements = element.find('input'),
          resizeWithException = 0;

      scope.$on('modal.shown', function () {
        exceptionShown = true;
      });
      scope.$on('modal.hidden', function () {
        resizeWithException = 0;
        exceptionShown = false;
      });
      scope.$on('modal.removed', function () {
        resizeWithException = 0;
        exceptionShown = false;
      });
      scope.$on('popover.shown', function () {
        exceptionShown = true;
      });
      scope.$on('popover.hidden', function () {
        resizeWithException = 0;
        exceptionShown = false;
      });
      scope.$on('popover.removed', function () {
        resizeWithException = 0;
        exceptionShown = false;
      });
      scope.$on('keyboard:show', function () {
        exceptionShown = true;
        console.log('keyboard show');
      });
      scope.$on('keyboard:hide', function () {
        resizeWithException = 0;
        exceptionShown = false;
        console.log('keyboard hide');
      });
      
      scope.$on('resizeTable', function () {
        resetWidth();
      });

      $(window).smartresize(function () {
        if (!exceptionShown) {
          resetWidth();
        }
      });
      $(window).smartresize(function () {
        if (exceptionShown) {
          resizeWithException++;
          if (resizeWithException > 1) {
            resetWidth();
          }
        }
      });

      $timeout(setCellWidth);

      function setCellWidth() {
        var div = angular.element(angular.element(angular
          .element(element.children()[0]).children()[0]).children()[0]),
            uls = [],
            cellContainers = [],
            cellWidths = [],
            widestCell = {
              width: null,
              index: null
            },
            widthsToUse = [],
            totalCellWidth = 0,
            widthOfAllCells = 0,
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
              cellContainers.push(angular.element(tempCellContainer
                .children()[li]));
            }
          }
        }

        for (var cellContainer in cellContainers) {
          tempCells = angular.element(cellContainers[cellContainer][0])
          .children();
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
          if (rows[row].length > 1) {
            for (var cell in rows[row]) {
              individualCell = rows[row][cell];
              for (var cellWidth in cellWidths) {
                if (cellWidths[cellWidth].cellIndex === parseInt(cell)) {
                  if (individualCell.has('select').length > 0) {
                    cellWidths[cellWidth].widths.push($(individualCell
                      .children('select')).innerWidth());
                  } else {
                    cellWidths[cellWidth].widths.push(individualCell
                      .innerWidth());
                  }
                }
              }
            }
          }
        }

        for (cellWidth in cellWidths) {
          widthsToUse.push(Math.max.apply(Math, cellWidths[cellWidth].widths));
        }

        biggestCell = Math.max.apply(Math, widthsToUse);
        
        for (var widthToUse in widthsToUse) {
          widthOfAllCells += widthsToUse[widthToUse];
        }

        newCell = biggestCell + window.innerWidth - widthOfAllCells;
        widthsToUse[widthsToUse.indexOf(biggestCell)] = newCell;

        for (widthToUse in widthsToUse) {
          for (row in rows) {
            if (rows[row].length > 1) {
              rows[row][widthToUse]
              .innerWidth(widthsToUse[widthToUse]);
            } else {
              rows[row][0].css('max-width', 'none');
              rows[row][0].innerWidth(window.innerWidth);
            }
          }
        }

        for (var selectElement in selectElements) {
          if (!isNaN(parseInt(selectElement))) {
            styleAttr = $(selectElements[selectElement]).parent().attr('style');
            styleAttr = parseInt(styleAttr.split(' ')[1].split('p')[0]);
            $(selectElements[selectElement])
            .innerWidth(styleAttr - 1);
          }
        }

        for (var inputElement in inputElements) {
          if (!isNaN(parseInt(inputElement))) {
            styleAttr = $(inputElements[inputElement]).parent().attr('style');
            styleAttr = parseInt(styleAttr.split(' ')[1].split('p')[0]);
            $(inputElements[inputElement])
            .innerWidth(styleAttr - 1);
          }
        }

        $ionicScrollDelegate.resize();

      }

      function resetWidth() {
        for (var row in rows) {
          if (rows[row].length > 1) {
            for (var cell in rows[row]) {
              rows[row][cell].innerWidth('auto');
            }
          }
        }
        setCellWidth();
      }

    }
  }
}]);