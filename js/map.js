'use strict';
(function () {
  // Коды клавиатуры
  var KEY_CODES = {
    enter: 13,
    esc: 27
  };

  // Орграничения положения пина на карте
  var PIN_LIMIT = {
    up: 150,
    down: 500,
    left: 0,
    right: 1200
  };

  // Сколько висит окно с ошибкой
  var TIMEOUT_FOR_ERROR = 10000;

  // Пусть будет видна во всем map.js!
  var adsArrayOriginal = [];
  var adsArrayForOnMapClick = [];
  var adsArrayFiltered = [];

  // Ищим блок с картой
  var mapBlock = document.querySelector('.map');


  // Находмм где у нас формы
  var noticeForm = document.querySelector('.notice__form');

  /**
   * Функция обработчика события нажатия кнопки ESC - акрывает карточку
   * @param {object} evt - объектс с данными о событии
   */
  var onDocumentKeydown = function (evt) {
    if (evt.keyCode === KEY_CODES.esc) {
      window.card.close(mapBlock);
      document.removeEventListener('keydown', onDocumentKeydown);
    }
  };

  // Находим кнопку активации карты
  var buttonOfMapActivation = document.querySelector('.map__pin--main');

  /**
   * Функция акивации и деактивации страницы
   * @param {object} blockOfMap - блок карты
   * @param {object} blockOfForm - блок формы
   * @param {boolean} deactivation - Если True - то деактивирована, если False - активирована;)
   */
  var deactivateAllPage = function (blockOfMap, blockOfForm, deactivation) {
    fadeMap(blockOfMap, deactivation);
    window.form.blockFormFields(blockOfForm, deactivation);
    window.form.fadeFormFields(blockOfForm, deactivation);
  };

  /**
   * Функция, которая скрывает или показывает блок карты, удаляя или добавляя
   * класс 'map--faded'
   * @param {object} block - блок для манипуляций
   * @param {boolean} deactivation - видно или нет
   */
  var fadeMap = function (block, deactivation) {
    if (deactivation) {
      block.classList.add('map--faded');
    } else {
      block.classList.remove('map--faded');
    }
  };

  /**
   * Функция, объединяющкая действия при нажатии энтера и клика
   */
  var loadAndActivateMap = function () {
    // Качаем объявлеия
    window.backend.download(onLoad, onError);
    // Активируем всю страницу
    deactivateAllPage(mapBlock, noticeForm, false);
    // Удаляем обработчики нажатия клавы
    buttonOfMapActivation.removeEventListener('keydown', onButtonKeydown);
  };

  /**
   * Функция - обработчик события нажатия клавиши ENTER на кнопке активации карты
   * @param {object} evt - объект с данными о собитии
   */
  var onButtonKeydown = function (evt) {
    if (evt.keyCode === KEY_CODES.enter) {
      loadAndActivateMap();
    }
  };

  // Для начала делаем страницу неактивной.
  deactivateAllPage(mapBlock, noticeForm, true);

  // Вешаем обработчик на нажатие клавиши ENTER по кнопке активации карты
  buttonOfMapActivation.addEventListener('keydown', onButtonKeydown);

  // Находим шаблон для карточки
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

  /**
   * Функция - обработчик клика по карте, в поисках клика по метке или картинки в метке
   * @param {object} evt - объект с данными о собитии
   */
  var onMapClick = function (evt) {
    // Спрашиваем, а ярлычек ли это (в него тыкаем или в картинку, которая в ней)
    // Плюс убиваем второго зайца - отбиваемся от 'click' идущем сразу за 'mousedown':)
    // Это вместо preventDefault
    if (evt.target.className === 'map__pin' ||
      evt.target.parentNode.className === 'map__pin') {
      // Вытаскиваем номер объявления из атрибутов кнопки;)
      var addIndex = evt.target.dataset.addId ||
        evt.target.parentNode.dataset.addId;
      // Создаем и заполняем фрагмент катрочкой, уж извините - не функция, т.к. всего один вариант;)
      var mapCardFragment = window.card.createMapElement(
          adsArrayForOnMapClick[addIndex], mapCardTemplate);
      // Находим, куда засовывать фрагмент с диалогом
      var mapFiltersContainer = document.querySelector('.map__filters-container');
      // Проверяем, открыта ли карточка. Если открыта, то удаляем перед отрисовкой новой.
      // Удаляем из отображения, а уже ПОТОМ отрисовываем карточку (код ниже)
      window.card.close(mapBlock);
      // Отрисовываем там, где надо
      mapBlock.insertBefore(mapCardFragment, mapFiltersContainer);
      // Вешаем обработчик на клавишу ESC по всей карте
      document.addEventListener('keydown', onDocumentKeydown);

    } else if (evt.target.className === 'popup__close') {
      // Если кликнули по кнопке закрытия карточки - удаляем ее
      window.card.close(mapBlock);
      // Удаляем обработчик нажатия на ESC
      document.removeEventListener('keydown', onDocumentKeydown);
    }
  };

  /**
   * Функция - обработчик события движения начиная с нажатия кнопки мыши
   * @param {object} evtDown - объект с данными о событии нажатия
   */
  var onButtonMouseDown = function (evtDown) {
    // На всякий пожарный
    evtDown.preventDefault();

    // Запоминаем начальные координаты клика
    var startPosition = {
      // Где нажали относительно страницы
      pageX: evtDown.pageX,
      pageY: evtDown.pageY,
      // Где нажали относительно нажатого элемента
      layerX: evtDown.layerX,
      layerY: evtDown.layerY
    };

    /**
     * Функция - обработчик событияя движения мыши
     * @param {object} evtMove - объект с данными о событии
     */
    var onMouseMove = function (evtMove) {
      // На всякий пожарный
      evtMove.preventDefault();
      // Просто создали
      var tempCoord = {};

      // Проверяем на то, в нужных ли пределах наша метка
      if ((window.pin.address.getY(evtMove.pageY, startPosition.layerY) > PIN_LIMIT.down) ||
        (window.pin.address.getY(evtMove.pageY, startPosition.layerY) < PIN_LIMIT.up) ||
        (window.pin.address.getX(evtMove.pageX, startPosition.layerX, mapBlock) < PIN_LIMIT.left) ||
        (window.pin.address.getX(evtMove.pageX, startPosition.layerX, mapBlock) > PIN_LIMIT.right)) {
        // Если за пределами, то используем старые координаты
        tempCoord.pageY = startPosition.pageY;
        tempCoord.pageX = startPosition.pageX;
      } else {
        // Если в пределах - то используем новые координаты
        tempCoord.pageX = evtMove.pageX;
        tempCoord.pageY = evtMove.pageY;
      }
      // Вычисляем смещение. Если новые - то смещаемся. Если старые - то нет.
      var shift = {
        x: startPosition.pageX - tempCoord.pageX,
        y: startPosition.pageY - tempCoord.pageY
      };

      // Заполняем поле адреса
      window.form.setAddress(window.pin.address.getX(tempCoord.pageX, startPosition.layerX, mapBlock),
          window.pin.address.getY(tempCoord.pageY, startPosition.layerY));

      // Переназначем опорные координаты
      startPosition.pageX = tempCoord.pageX;
      startPosition.pageY = tempCoord.pageY;

      // Двигаем пин с помощью вычесленных ранее смещений
      window.pin.move(buttonOfMapActivation, shift);
    };

    /**
     * Функция - обработчик события отпускания мыши после движения
     */
    var onDocumentMouseUp = function () {
      if (mapBlock.classList.contains('map--faded')) {
        loadAndActivateMap();
      }
      mapBlock.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onDocumentMouseUp);
    };

    // Навешиваем обработчик на движение мыши
    mapBlock.addEventListener('mousemove', onMouseMove);

    // Навешиваем обработчик на отпускание кнопки мыши
    document.addEventListener('mouseup', onDocumentMouseUp);
  };

  // Навешиваем обработчик на нажатие кнопки мыши
  buttonOfMapActivation.addEventListener('mousedown', onButtonMouseDown);

  // Корректируем форму
  window.form.init();

  /**
   * Функция, запускаемая успешному окончанию скачивания
   * @param {object} dataFromServer - объект с данными ответа сервера
   */
  var onLoad = function (dataFromServer) {
    adsArrayOriginal = dataFromServer;
    adsArrayForOnMapClick = adsArrayOriginal;
    window.pin.draw(adsArrayOriginal, mapBlock);
    // Вешаем обработчик клика по карте в поисках метки
    mapBlock.addEventListener('click', onMapClick);
  };

  /**
   * Функция рисует сообщение с текстом
   * @param {string} errorMessage - текст сообщения
   */
  var onError = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('error-window');
    node.style = 'z-index: 100; text-align: center; background-color: red; padding: 50px;';
    node.style.position = 'fixed';
    node.style.left = '50%';
    node.style.transform = 'translate(-50%, -50%)';
    node.style.top = '150px';
    node.style.width = '800px';
    node.style.fontSize = '30px';
    node.style.color = 'white';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
    var hideErrorWindow = function () {
      document.querySelector('.error-window').remove();
    };
    window.setTimeout(hideErrorWindow, TIMEOUT_FOR_ERROR);
  };

  /**
   * Функция сброса всего в исходное состояние
   */
  var resetAll = function () {
    noticeForm.reset();
    filtersForm.reset();
    window.form.init();
    window.pin.resetMain(buttonOfMapActivation);
    deactivateAllPage(mapBlock, noticeForm, true);
    window.pin.deleteAllSimilarPins(mapBlock);
    window.card.close(mapBlock);
    // Вешаем обработчик на нажатие клавиши ENTER по кнопке активации карты
    buttonOfMapActivation.addEventListener('keydown', onButtonKeydown);
    // Навешиваем обработчик на нажатие кнопки мыши
    buttonOfMapActivation.addEventListener('mousedown', onButtonMouseDown);
  };

  /**
   * Функция, запускаемая при успешной отправке данных
   */
  var onUpload = function () {
    resetAll();
  };

  /**
   * Функця - обработчик события клика по отправке
   * @param {object} evt - объект с данными о событии.
   */
  var onNoticeFormSubmit = function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(noticeForm), onUpload, onError);
  };

  // Навешиваем обработчик события на кнопку подтердить отпраку
  noticeForm.addEventListener('submit', onNoticeFormSubmit);

  // Где же кнопка сброса
  var resetButton = noticeForm.querySelector('.form__reset');

  /**
   * Функция - обработчик события клика по сбросу
   * @param {object} evt - объект с данными о событии
   */
  var onResetButtonClick = function (evt) {
    evt.preventDefault();
    resetAll();
  };
  // Вешаем обработчик на клик по сбросу
  resetButton.addEventListener('click', onResetButtonClick);

  // Где у нас форма с фильтами
  var filtersForm = document.querySelector('.map__filters');
  var onFiltersFormChange = function () {
    var filtrate = function () {
      adsArrayFiltered = window.filters.makeFiltration(adsArrayOriginal);
      window.pin.deleteAllSimilarPins(mapBlock);
      window.pin.draw(adsArrayFiltered, mapBlock);
      adsArrayForOnMapClick = adsArrayFiltered;
      window.card.close(mapBlock);
    };
    window.util.debounce(filtrate);
  };
  filtersForm.addEventListener('change', onFiltersFormChange);

})();

