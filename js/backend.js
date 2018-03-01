'use strict';
(function () {
  // Адреса откуда и куда качать
  var DOWNLOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';
  // Время для выдачи ошибки без ответа
  var TIMEOUT = 10000;
  // Коды ошибок
  var SUCCESSFUL_CODE = 200;
  var ERROR_CODE = {
    '301': 'Ресурс переезал навсегда',
    '302': 'Ресуср переехал временно',
    '400': 'Неправильный запрос',
    '403': 'У Вас нехватает прав',
    '404': 'Запрашиваемый ресур не найден'
  };

  /**
   * Функция DRY - тобы не писать ниже повторы
   * @param {object} xhr - xhr:)
   * @param {function} onLoad - колбек для удачного варианта
   * @param {function} onError - колбек для выдачи ошибки
   */
  var makeLoadToDirection = function (xhr, onLoad, onError) {
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESSFUL_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Код состояни: ' + xhr.status + ' ' + xhr.statusText + ERROR_CODE[xhr.status]);
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
