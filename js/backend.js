'use strict';
(function () {
  var DOWNLOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 10000;

  var makeLoadToDirection = function (xhr, onLoad, onError) {
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

    xhr.timeout = TIMEOUT;
  };
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
      makeLoadToDirection(xhr, onLoad, onError);
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
      var xhr = new XMLHttpRequest();
      makeLoadToDirection(xhr, onLoad, onError);
      xhr.open('POST', UPLOAD_URL);
      xhr.send(data);
    }
  };
})();
