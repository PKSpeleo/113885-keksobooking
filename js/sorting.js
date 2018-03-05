'use strict';
(function () {
  window.sorting = {
    /**
     * Функция инициализации сортировки картинок методом Drag and Drop
     * @param {object} mainElement - блок, в котором можно мешать картинки
     */
    makeSortable: function (mainElement) {
      var dragElement;
      var nextElement;

      /**
       * Функция - оброботчик собития Dragover
       * @param {object} evt - объект с данными о собити
       */
      var onElementDragover = function (evt) {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'move';

        var target = evt.target;
        if (target && target !== dragElement && target.nodeName === 'IMG') {
          // Сортируем
          var rect = target.getBoundingClientRect();
          nextElement = (((evt.clientY - rect.top) / (rect.bottom - rect.top)) > 0.5)
            ? target.nextSibling : target;
          mainElement.insertBefore(dragElement, nextElement);
        }
      };

      /**
       * Функция - обработчик события Dragend
       * @param {object} evt - объект с данными о событии.
       */
      var onElementDragend = function (evt) {
        evt.preventDefault();
        mainElement.removeEventListener('dragover', onElementDragover, false);
        mainElement.removeEventListener('dragend', onElementDragend, false);
      };

      /**
       * Функция - обработчик события Dragstart
       * @param {object} evt - объект с данными о событии.
       */
      var onElementDragstart = function (evt) {
        // Запоминаем элемент который будет перемещать
        dragElement = evt.target;
        // Ограничиваем тип перетаскивания
        evt.dataTransfer.effectAllowed = 'move';
        // Пописываемся на события при dnd
        mainElement.addEventListener('dragover', onElementDragover, false);
        mainElement.addEventListener('dragend', onElementDragend, false);

      };
      // Начало сортировки - вешаем обработчик на dragstart
      mainElement.addEventListener('dragstart', onElementDragstart, false);
    }
  };
})();
