'use strict';
(function () {
  var DEBOUNCE_TIME = 500;
  var lastTimeout;
  // Задаем нужные тыпы файлов и размер картинки в превью
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var PHOTO_WIDE = '150';
  /**
   * Функция обрабатывает полученный файл (проверяет картинка ли это) и
   * засовывает в нужное место методом, зависящим от флага
   * @param {file} file - файл фотки
   * @param {object} blockToPut - блок, куда закидываем фотку
   * @param {boolean} flagAppendMoreNotPlaceOne - Флаг, если Тру, то
   * добавляет картинку в своем отдельном дополнительном блоке img,
   * если Фалс - то прост к текущему блоку прописывает src.
   */
  var placeImageFileTo = function (file, blockToPut, flagAppendMoreNotPlaceOne) {
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        // Проверяем, что делаем - добавляем дополнительный или только один
        if (flagAppendMoreNotPlaceOne) {
          // Создаем элемент IMG с нужными атрибутами.
          var tempImgBlock = document.createElement('img');
          tempImgBlock.setAttribute('width', PHOTO_WIDE);
          tempImgBlock.src = reader.result;
          blockToPut.appendChild(tempImgBlock);
        } else {
          blockToPut.src = reader.result;
        }
      });
      reader.readAsDataURL(file);
    }
  };
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
    },
    /**
     * Функция по добавлению обработчика собитий на добавления разных фотографий
     * это не сама функция - обработчик событий.
     * она нужна для того, чтобы унифицировать установку именно обработчиков
     * в разные места по добавлению файлов
     * @param {object} InputBlockToListen - на каком объекте ждем
     * @param {object} blockToPut - куда вставляем фото
     * @param {boolean} flagAppendMoreNotPlaceOne - флаг отвечающий на вопрос, добавляем
     * мы дополнительную фотографию или просто вставляем одну единственную.
     * true - добавляем дополнительную.
     */
    initImageUploadTo: function (InputBlockToListen, blockToPut, flagAppendMoreNotPlaceOne) {
      /**
       * Функция - обработчик cобытия изменения поля инпут (ввод файлов)
       */
      var onChangeInput = function () {
        var file = InputBlockToListen.files[0];
        placeImageFileTo(file, blockToPut, flagAppendMoreNotPlaceOne);
      };
      InputBlockToListen.addEventListener('change', onChangeInput);
    },
    /**
     * Функция по добавлению обработчика собитий на добавления разных фотографий
     * методом Drag and Drop
     * это не сама функция - обработчик событий.
     * она нужна для того, чтобы унифицировать установку именно обработчиков
     * в разные места по добавлению файлов
     * @param {object} dropZoneLabelBlock - объект, куда кидаем файл мышкой
     * @param {object} blockToPut - объект, куда вставляем картинку
     * @param {boolean} flagAppendMoreNotPlaceOne
     * флаг отвечающий на вопрос, добавляем
     * мы дополнительную фотографию или просто вставляем одну единственную.
     * true - добавляем дополнительную.
     */
    initDragAndDropImageUploadTo: function (dropZoneLabelBlock, blockToPut, flagAppendMoreNotPlaceOne) {
      var onLabelDragenter = function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
      };
      var onLabelDragover = function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
      };
      var onLabelDrop = function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        var dt = evt.dataTransfer;
        var file = dt.files[0];
        placeImageFileTo(file, blockToPut, flagAppendMoreNotPlaceOne);
      };
      dropZoneLabelBlock.addEventListener('dragenter', onLabelDragenter);
      dropZoneLabelBlock.addEventListener('dragover', onLabelDragover);
      dropZoneLabelBlock.addEventListener('drop', onLabelDrop);
    }
  };
})();
