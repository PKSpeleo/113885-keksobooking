'use strict';
(function () {
  var INIT_ADDRESS = {
    x: 600,
    y: 352
  };
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

  // Генерируем обявления
  // var adsArrayRandom = window.data.generateAds();
  var adsArray = [];

  var onLoad = function (dataFromServer) {
    adsArray = dataFromServer;
    window.pin.drawPins(adsArray, mapBlock);
    debugger;
    // Вешаем обработчик клика по карте в поисках метки
    mapBlock.addEventListener('click', onMapClick);
  };

  var onError = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('error-window');
    node.style = 'z-index: 100; text-align: center; background-color: red; padding: 50px;';
    node.style.position = 'fixed';
    node.style.transform = 'translate(-50%, -50%)';
    node.style.top = '200px';
    node.style.width = '800px';
    node.style.left = '50%';
    node.style.fontSize = '30px';
    node.style.color = 'white';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
    var hideErrorWindow = function () {
      document.querySelector('.error-window').remove();
    };
    window.setTimeout(hideErrorWindow, 5000);
  };


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
      mapBlock.removeChild(mapBlock.querySelector('.popup'));
      document.removeEventListener('keydown', onDocumentKeydown);
    }
  };

  // Находим кнопку активации карты
  var buttonOfMapActivation = document.querySelector('.map__pin--main');

  /**
   * Функция акивации и деактивации страницы и рисования пинов
   * @param {object} blockOfMap - блок карты
   * @param {object} blockOfForm - блок формы
   * @param {boolean} status - Если True - то видно, если False - то нет;)
   */
  var activateAndDrawPins = function (blockOfMap, blockOfForm, status) {
    window.activation.setActiveOrInactivePage(blockOfMap, blockOfForm, status);
  };

  /**
   * Функция - обработчик события клика по кнопке
   * @param {object} evt - объектс с данными о событии
   */
  var onButtonMouseup = function (evt) {
    // Активируем все
    window.backend.download(onLoad, onError);
    activateAndDrawPins(mapBlock, noticeForm, false);
    // прописываем в поле адрес положение мышки в момент клика
    window.form.setAddress(window.pin.address.getX(evt.pageX, evt.layerX, mapBlock),
        window.pin.address.getY(evt.pageY, evt.layerY));
    buttonOfMapActivation.removeEventListener('mouseup', onButtonMouseup);
    buttonOfMapActivation.removeEventListener('keydown', onButtonKeydown);
  };

  /**
   * Функция - обработчик события нажатия клавиши ENTER на кнопке активации карты
   * @param {object} evt - объект с данными о собитии
   */
  var onButtonKeydown = function (evt) {
    if (evt.keyCode === KEY_CODES.enter) {
      window.backend.download(onLoad, onError);
      window.activation.setActiveOrInactivePage(mapBlock, noticeForm, false);
      // Удаляем обработчики
      buttonOfMapActivation.removeEventListener('mouseup', onButtonMouseup);
      buttonOfMapActivation.removeEventListener('keydown', onButtonKeydown);
    }
  };

  // Для начала делаем страницу неактивной.
  window.activation.setActiveOrInactivePage(mapBlock, noticeForm, true);

  // Прописываем начальный адрес
  // document.querySelector('#address').setAttribute('value', '600, 375');
  // debugger;
  window.form.setAddress(INIT_ADDRESS.x, INIT_ADDRESS.y);

  // Вешаем обработчик на нажатие клавиши ENTER по кнопке активации карты
  buttonOfMapActivation.addEventListener('keydown', onButtonKeydown);

  // Вешаем обработчик событий на клик по кнопке активации карты
  buttonOfMapActivation.addEventListener('mouseup', onButtonMouseup);

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
      var mapCardFragment = window.card.createMapCardElement(
          adsArray[addIndex], mapCardTemplate);
      // Находим, куда засовывать фрагмент с диалогом
      var mapFiltersContainer = document.querySelector('.map__filters-container');
      // Проверяем, открыта ли карточка. Если открыта, то удаляем перед отрисовкой новой.
      // Удаляем из отображения, а уже ПОТОМ отрисовываем карточку (код ниже)

      if (mapBlock.querySelector('.popup')) {
        mapBlock.removeChild(mapBlock.querySelector('.popup'));
      }
      // Отрисовываем там, где надо
      mapBlock.insertBefore(mapCardFragment, mapFiltersContainer);
      // Вешаем обработчик на клавишу ESC по всей карте
      document.addEventListener('keydown', onDocumentKeydown);

    } else if (evt.target.className === 'popup__close') {
      // Если кликнули по кнопке закрытия карточки - удаляем ее
      mapBlock.removeChild(mapBlock.querySelector('.popup'));
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
    var onMouseUpAfterMove = function () {
      mapBlock.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUpAfterMove);
    };

    // Навешиваем обработчик на движение мыши
    mapBlock.addEventListener('mousemove', onMouseMove);

    // Навешиваем обработчик на отпускание кнопки мыши
    document.addEventListener('mouseup', onMouseUpAfterMove);
  };

  // Навешиваем обработчик на нажатие кнопки мыши
  buttonOfMapActivation.addEventListener('mousedown', onButtonMouseDown);

  // Корректируем форму
  window.form.init();
})();

