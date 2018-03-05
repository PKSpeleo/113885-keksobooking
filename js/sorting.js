'use strict';
(function () {
  window.sorting = {
    makeSortable: function (mainElement) {
      var dragElement;
      var nextElement;

      // Фнукция отвечающая за сортировку
      var onElementDragover = function (evt) {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'move';

        var target = evt.target;
        if (target && target !== dragElement && target.nodeName === 'IMG') {
          // Сортируем
          var rect = target.getBoundingClientRect();
          var next = (evt.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
          mainElement.insertBefore(dragElement, next && target.nextSibling || target);
        }
      };

      // Окончание сортировки
      var onElementDragged = function (evt) {
        evt.preventDefault();

        mainElement.removeEventListener('dragover', onElementDragover, false);
        mainElement.removeEventListener('dragend', onElementDragged, false);
      };

      var onRootDragStart = function (evt) {
        // Запоминаем элемент который будет перемещать
        dragElement = evt.target;
        nextElement = dragElement.nextSibling;

        // Пописываемся на события при dnd
        mainElement.addEventListener('dragover', onElementDragover, false);
        mainElement.addEventListener('dragend', onElementDragged, false);

      };
      // Начало сортировки
      mainElement.addEventListener('dragstart', onRootDragStart, false);
    }
  };
})();
