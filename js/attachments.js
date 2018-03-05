'use strict';
(function () {
  window.attachments = {
    /**
     * Функция инициализирует работу с прикладываемыми картинкаи
     * Поддерживает вставку фоток, вставку методом драг энд дроп и
     * сортировку методом драг энд дроп
     * @param {object} noticeFormBlock - блок форм
     */
    init: function (noticeFormBlock) {
      // Работа с файлами
      // Сначала ищем нужные места для аватарки
      var photoNoticeFormBlock = noticeFormBlock.querySelector('.notice__photo');
      var avatarFileChooseBlock = photoNoticeFormBlock.querySelector('input');
      // Прописываем имя инпуту, без которого не работает отправка
      avatarFileChooseBlock.setAttribute('name', 'avatar');
      var avatarImgBlock = photoNoticeFormBlock.querySelector('img');
      var avatarDropZoneBlock = noticeFormBlock.querySelector('.drop-zone');
      // Сбрасываем на стандартные значения аватарку
      if (!(avatarImgBlock.src === 'img/muffin.png')) {
        avatarImgBlock.src = 'img/muffin.png';
      }
      // Инициируем возможность загрузки файла обычным способом для аватарки
      window.util.initImageUploadTo(avatarFileChooseBlock, avatarImgBlock, false);
      window.util.initDragAndDropImageUploadTo(avatarDropZoneBlock, avatarImgBlock, false);

      // Ищим нужные места для фоток
      var photoFormBlock = noticeFormBlock.querySelector('.form__photo-container');
      var photoFileChooserBlock = photoFormBlock.querySelector('input');
      // Прописываем имя инпуту, без которого не работает отправка
      photoFileChooserBlock.setAttribute('name', 'photos');
      var photoDropZoneBlock = photoFormBlock.querySelector('.drop-zone');
      // Cбрасываем картинки в начальное соатояние если там что-то есть.
      var photoPrevieBlock = photoFormBlock.querySelector('.photo__preview');
      if (photoPrevieBlock) {
        photoFormBlock.removeChild(photoPrevieBlock);
      }
      // В размекте нет нужного блока для блока для вставки фото, поэтому создаем его сами;
      var tempPhotosBlock = document.createElement('div');
      tempPhotosBlock.setAttribute('class', 'photo__preview');
      photoFormBlock.appendChild(tempPhotosBlock);
      var photoToUploadBlock = photoFormBlock.querySelector('.photo__preview');
      // Инициируем возможность загрузки файлка обычным способом
      window.util.initImageUploadTo(photoFileChooserBlock, photoToUploadBlock, true);
      window.util.initDragAndDropImageUploadTo(photoDropZoneBlock, photoToUploadBlock, true);

      // Инициируем сортировку фоток драг анд дропом
      window.sorting.makeSortable(photoToUploadBlock);
    }
  };
})();
