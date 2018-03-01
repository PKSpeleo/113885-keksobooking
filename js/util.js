'use strict';
(function () {
  window.util = {
    /**
     * Функция, отвчает на вопрос, есть ли нужный элемент в массиве
     * @param {string} value - элемент, наличие которого мы проверяем
     * @param {array} array - массив, в котором мы ищем элемент
     * @return {boolean} - true or false, есть ли элемент в массиве или нет
     */
    isInArray: function (value, array) {
      return array.indexOf(value) > -1;
    }
  };
})();
