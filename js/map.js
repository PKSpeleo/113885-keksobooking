'use strict';
// Смещения для нахождения кончика метки - противоречит заданию,
// но соответствует реальности, отсчет от центра
var MAP_MARKER_OFFSET = {
  x: 0,
  y: 35
};

// Коды клавиатуры
var KEY_CODES = {
  enter: 13,
  esc: 27
};


/**
 * функцию создания DOM-элемента маркера на основе JS-объекта
 * @param {object} adObject - Объект с объявлением
 * @param {number} index - индекс объявления (для идентификации маркера)
 * @param {object} templateObject - Объект с шаблоном
 * @param {number} offsetX - отступ стрелки маркера по оси Х
 * @param {number} offsetY - отступ стрелки маркера по оси У
 * @return {IXMLDOMNode | Node} - баттан, который возвращается
 */
var createMapMarkerElement = function (adObject, index, templateObject, offsetX, offsetY) {
  // Задаем положение указателя со смещением
  var button = templateObject.cloneNode(true);
  button.style.left = (adObject.location.x - offsetX) + 'px';
  button.style.top = (adObject.location.y - offsetY) + 'px';
  button.dataset.addId = index.toString();
  // Цепляем картинку на указатель и задаем ей параметры
  var image = button.querySelector('img');
  image.setAttribute('src', adObject.author.avatar);
  image.setAttribute('width', '40');
  image.setAttribute('height', '40');
  image.setAttribute('draggable', 'false');
  return button;
};

/**
 * Функция создает и заполняет блок маркеров DOM-элементами на основе массива JS-объектов
 * с применением шаблона
 * @param {array} ads - массив объектов объявлений
 * @param {object} templateBlock - блок шаблона, на основе которого мы создаем маркеры
 * @param {object} markerOffset - отступ маркера по оси Х и Y в объекте
 * @return {DocumentFragment} - возвращает заполненный DOM блок с маркерами
 */
var createMapFragmentByMarkersWithTemplate = function (
    ads, templateBlock, markerOffset) {
  // Создаем блок
  var domBlock = document.createDocumentFragment();
  // Пишем в блок маркеры
  for (var j = 0; j < ads.length; j++) {
    domBlock.appendChild(createMapMarkerElement(
        ads[j], j, templateBlock, markerOffset.x, markerOffset.y));
  }
  return domBlock;
};

// Генерируем обявления
var adsArrayRandom = window.data.generateAds();

var mapBlock = document.querySelector('.map');
// setOrRemoveClassMapFaded(mapBlock, true);

// находим шаблон
var templateFragment = document.querySelector('template').content;

// Находим шаблон маркеров
var mapMarketTemplateFragment = templateFragment.querySelector('.map__pin');

// Находим, где отрисоовывать фрагмент маркеров
var mapMarker = mapBlock.querySelector('.map__pins');

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
 * Функция, отрисовывающая пины на карте
 * @param {boolean} status - рисуем или нет
 */
var drawPins = function (status) {
  if (!status) {
    // Создаем и заполняем фрагмент маркеров объявлениями
    var mapMarkersFragment = createMapFragmentByMarkersWithTemplate(
        adsArrayRandom, mapMarketTemplateFragment, MAP_MARKER_OFFSET);
    // Отрисовываем маркеры там, где надо
    mapMarker.appendChild(mapMarkersFragment);
    // Вешаем обработчик клика по карте в поисках метки
    mapBlock.addEventListener('click', onMapClick);
  }
};

/**
 * Функция акивации и деактивации страницы
 * @param {object} blockOfMap - блок карты
 * @param {object} blockOfForm - блок формы
 * @param {boolean} status - Если True - то видно, если False - то нет;)
 */
var activateAndDrawPins = function (blockOfMap, blockOfForm, status) {
  window.activation.setActiveOrInactivePage(blockOfMap, blockOfForm, status);
  drawPins(status);
};

/**
 * Функция - обработчик события клика по кнопке
 * @param {object} evt - объектс с данными о событии
 */
var onButtonMouseup = function (evt) {
  activateAndDrawPins(mapBlock, noticeForm, false);
  // прописываем в поле адрес положение мышки в момент клика
  addressField.setAttribute(
      'value', evt.pageX + ' , ' + evt.pageY);
  // Удаляем обработчики
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

// Находим поле ядреса
var addressField = document.querySelector('#address');
// Прописываем начальный адрес
document.querySelector('#address').setAttribute('value', '600, 375');

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

