'use strict';
(function () {
  var DOWNLOAD_URL = 'https://js.dump.academy/keksobooking/data';

  window.backend = {
    /**
     * Функция получения данных с сервера
     * @param {function} onLoad - функция обратного вызова,
     * которая срабатывает при успешном выполнении запроса.
     * @param {function} onError - функция обратного вызова,
     * которая срабатывает при неуспешном выполнении запроса
     */
    download: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 10000; // 10s

      xhr.open('GET', DOWNLOAD_URL);
      xhr.send();
    },
    /**
     * Функция отправки данных на сервер
     * @param {object} data - объект FormData, который содержит данные формы,
     * которые будут отправлены на сервер;
     * @param {function} onLoad - функция обратного вызова,
     * которая срабатывает при успешном выполнении запроса.
     * @param {function} onError - функция обратного вызова,
     * которая срабатывает при неуспешном выполнении запроса
     */
    upload: function (data, onLoad, onError) {

    }
  };
})();
