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
    down: 500
  };

  // Генерируем обявления
  var adsArrayRandom = window.data.generateAds();

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
    if (!status) {
      window.pin.drawPins(adsArrayRandom, mapBlock);
      // Вешаем обработчик клика по карте в поисках метки
      mapBlock.addEventListener('click', onMapClick);
    }
  };

  /**
   * Функция - обработчик события клика по кнопке
   * @param {object} evt - объектс с данными о событии
   */
  var onButtonMouseup = function (evt) {
    // Активируем все
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
          adsArrayRandom[addIndex], mapCardTemplate);
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

  // move

  var onButtonMouseDown = function (evtDown) {
    evtDown.preventDefault();
    var startPosition = {
      pageX: evtDown.pageX,
      layerX: evtDown.layerX,
      pageY: evtDown.pageY,
      layerY: evtDown.layerY
    };

    var onMouseMove = function (evtMove) {
      evtMove.preventDefault();
      var tempCoord = {};
      tempCoord.layerY = startPosition.layerY;
      tempCoord.layerX = startPosition.layerX;
      if (window.pin.address.getY(evtMove.pageY, tempCoord.layerY) > PIN_LIMIT.down) {
        tempCoord.pageY = startPosition.pageY;
        tempCoord.pageX = startPosition.pageX;
      } else {
        tempCoord.pageX = evtMove.pageX;
        tempCoord.pageY = evtMove.pageY;
        // tempCoord.layerY = evtMove.layerY;
        // tempCoord.layerX = evtMove.layerX;
      }
      var shift = {
        x: startPosition.pageX - tempCoord.pageX,
        y: startPosition.pageY - tempCoord.pageY
      };

      window.form.setAddress(window.pin.address.getX(tempCoord.pageX, tempCoord.layerX, mapBlock),
          window.pin.address.getY(tempCoord.pageY, tempCoord.layerY));

      startPosition = {
        pageX: tempCoord.pageX,
        layerX: tempCoord.layerX,
        pageY: tempCoord.pageY,
        layerY: tempCoord.layerY
      };
      // console.log('startPosition.x ' + startPosition.x + ' startPosition.y ' + startPosition.y);
      // console.log('shift X ' + shift.x + ' Y ' + shift.y);
      // console.log('X ' + window.pin.address.getX(tempPageX, tempLayerX, mapBlock) + ' Y '
      //   + window.pin.address.getY(tempPageY, tempLayerY));
      // console.log(' P X ' + evtMove.pageX + ' L X ' + evtMove.layerX + 'P Y ' + evtMove.pageY + ' L Y ' + evtMove.layerY);
      // console.log('Page Y ' + evtMove.pageY + ' tempPageY ' + tempPageY);
      // if ((evtMove.pageX - evtMove.layerX - Math.floor(mapBlock.getBoundingClientRect().left)) < 10) {
      //   debugger;
      // }
      window.pin.move(buttonOfMapActivation, shift);

    };
    var onMouseUpAfterMove = function () {
      mapBlock.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUpAfterMove);
    };

    mapBlock.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUpAfterMove);
  };
  buttonOfMapActivation.addEventListener('mousedown', onButtonMouseDown);
  // debugger;


  // Корректируем форму
  window.form.init();

})();

