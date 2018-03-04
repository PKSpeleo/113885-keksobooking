'use strict';
(function () {
  var DEBOUNCE_TIME = 500;
  var lastTimeout;
  window.util = {
    /**
     * Функция устранения дребезга
     * @param {function} cb - колюбэк функции на которой устраняем дребезг
     */
    debounce: function (cb) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(cb, DEBOUNCE_TIME);
    }
  };
})();
