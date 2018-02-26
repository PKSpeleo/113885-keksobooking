'use strict';
(function () {
  window.util = {
    /**
     * Генерируем случайнео целое число от минимума (вкл) до максимума (вкл)
     * @param {number} min - минимльное целое число (вкл)
     * @param {number} max - максимальное целое число (вкл)
     * @return {number} - случайное целое число
     */
    randomiseIntegerMinToMax: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Функция выбора случайных элеменов массива
     * @param {array} arr - массив
     * @return {*} - случайный элемент массива
     */
    chooseRandomArrElement: function (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },

    /**
     * Функция откидывания рандомного количества элементов массива с конца
     * @param {array} arr - массив от которого надо откинуть хваост
     * @return {array} - обрезанный с хвоста массив
     */
    cropArrayFromEnd: function (arr) {
      return arr.slice(0, window.util.randomiseIntegerMinToMax(0, arr.length));
    },

    /**
     * Функция, которая перемешивает массив!
     * @param {array} array - массив для перемешивания
     * @return {array} - возвращает перемешанный масив
     */
    mixArrayRandomly: function (array) {
      return array.slice().sort(function () {
        return window.util.randomiseIntegerMinToMax(0, 1);
      });
    }
  };
})();
