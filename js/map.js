'use strict';
// Количество объявлений
var ADS_QUANTITY = 8;

// Смещения для нахождения кончика метки - противоречит заданию, но соответствует реальности, отсчет от центра
var MAP_MARKER_X_OFFSET = 0;
var MAP_MARKER_Y_OFFSET = 35;

// Здесь храним временные данные для генерации объявлений
var VARIANTS_OF = {
  avatar: 'img/avatars/user{{xx}}.png',
  avatarSeparator: '{{xx}}',
  title: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  address: '',
  priceMin: 1000,
  priceMax: 1000000,
  type: [
    'flat',
    'house',
    'bungalo'
  ],
  roomsMin: 1,
  roomsMax: 5,
  guestsMin: 1,
  guestsMax: 10,
  checkinCheckout: [
    '12:00',
    '13:00',
    '14:00'
  ],
  features: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],
  description: 'Описание должно быть пустым!!!',
  photos: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ],
  locationXMin: 300,
  locationXMax: 900,
  locationYMin: 150,
  locationYMax: 500
};

/**
 * Генерируем случайнео целое число от минимума (вкл) до максимума (вкл)
 * @param {number} min - минимльное целое число (вкл)
 * @param {number} max - максимальное целое число (вкл)
 * @return {number} - случайное целое число
 */
var randomiseIntegerMinToMax = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Функция выбора случайных элеменов массива
 * @param {array} arr - массив
 * @return {*} - случайный элемент массива
 */
var chooseRandomArrElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Функция откидывания рандомного количества элементов массива с конца
 * @param {array} arr - массив от которого надо откинуть хваост
 * @return {array} - обрезанный с хвоста массив
 */
var cropArrayFromEnd = function (arr) {
  return arr.slice(0, randomiseIntegerMinToMax(0, arr.length));
};

/**
 * Функция, которая перемешивает массив!
 * @param {array} array - массив для перемешивания
 * @return {array} - возвращает перемешанный масив
 */
var mixArrayRandomly = function (array) {
  return array.slice().sort(function () {
    return randomiseIntegerMinToMax(0, 1);
  });
};

/**
 * Функция создания массива объектов объявлений с данными
 * @param {object} variantsOfObject - объект с вариантами содержимого объявлений
 * @param {number} adsQuantity - количество объявлений
 * @return {Array} - возвращает массив объектов объявлений
 */
var generateArrOfAds = function (variantsOfObject, adsQuantity) {
  var adsArray = [];
  var avatar = variantsOfObject.avatar.split(variantsOfObject.avatarSeparator);
  for (var i = 0; i < adsQuantity; i++) {
    adsArray[i] = {
      author: {
        avatar: avatar[0] + '0' + (i + 1) + avatar[1]
      },
      offer: {
        title: variantsOfObject.title[i],
        address: '',
        price: randomiseIntegerMinToMax(variantsOfObject.priceMin, variantsOfObject.priceMax),
        type: chooseRandomArrElement(variantsOfObject.type),
        rooms: randomiseIntegerMinToMax(variantsOfObject.roomsMin, variantsOfObject.roomsMax),
        guests: randomiseIntegerMinToMax(variantsOfObject.guestsMin, variantsOfObject.guestsMax),
        checkin: chooseRandomArrElement(variantsOfObject.checkinCheckout),
        checkout: chooseRandomArrElement(variantsOfObject.checkinCheckout),
        features: cropArrayFromEnd(variantsOfObject.features),
        description: variantsOfObject.description,
        photos: mixArrayRandomly(variantsOfObject.photos)
      },
      location: {
        x: randomiseIntegerMinToMax(variantsOfObject.locationXMax, variantsOfObject.locationXMin),
        y: randomiseIntegerMinToMax(variantsOfObject.locationYMin, variantsOfObject.locationYMax)
      }
    };
    adsArray[i].offer.address = adsArray[i].location.x + ', ' + adsArray[i].location.y;
  }
  return adsArray;
};

/**
 * Функция, которая скрывает или показывает блок, удаляя или добавляя
 * класс 'map--faded'
 * @param {object} block - блок для манипуляций
 * @param {boolean} status - видно или нет
 */
var setOrRemoveClassMapFaded = function (block, status) {
  if (status) {
    block.classList.remove('map--faded');
  } else {
    block.classList.add('map--faded');
  }
};

/**
 * функцию создания DOM-элемента маркера на основе JS-объекта
 * @param {object} adsObject - Объект с объявлением
 * @param {number} offsetX - отступ по оси Х
 * @param {number} offsetY - отступ по оси У
 * @return {HTMLButtonElement} - баттан, который возвращается
 */
var createMapMarkerElement = function (adsObject, offsetX, offsetY) {
  var newMarker = document.createElement('button');
  newMarker.style.left = (adsObject.location.x - offsetX) + 'px';
  newMarker.style.top = (adsObject.location.y - offsetY) + 'px';
  newMarker.className = 'map__pin';
  var newMarkerImg = document.createElement('img');
  newMarkerImg.setAttribute('src', adsObject.author.avatar);
  newMarkerImg.setAttribute('width', '40');
  newMarkerImg.setAttribute('height', '40');
  newMarkerImg.setAttribute('draggable', 'false');
  newMarker.appendChild(newMarkerImg);
  return newMarker;
};

/**
 * Функцию заполнения блока маркеров DOM-элементами на основе массива JS-объектов
 * @param {array} ads - массив объектов объявлений
 * @param {object} domBlock - блок, куда все запкидываем
 * @param {number} markerOffsetX - отступ маркера по оси Х
 * @param {number} markerOffsetY - отступ маркера по оси У
 */
var fillMapFragmentByMarkers = function (ads, domBlock, markerOffsetX, markerOffsetY) {
  for (var j = 0; j < ADS_QUANTITY; j++) {
    domBlock.appendChild(createMapMarkerElement(ads[j], markerOffsetX, markerOffsetY));
  }
};

/**
 * Функция, переводящая с английского на русский;)
 * @param {string} offerType - строка на английском
 * @return {string} - строка на русском
 */
var translateOfferToRus = function (offerType) {
  if (offerType === 'flat') {
    return 'Квартира';
  } else if (offerType === 'bungalo') {
    return 'Бунгало';
  } else if (offerType === 'house') {
    return 'Дом';
  } else {
    return 'Незивестно что';
  }
};

/**
 * функция генерации элемента блока в стиле ki ищ списка фич
 * @param {string} arrayElement - элемент массива
 * @return {HTMLLIElement} - возвращает блок для вставки в стиле списка
 */
var generateFeatureLi = function (arrayElement) {
  var newElement = document.createElement('li');
  newElement.className = 'feature feature--' + arrayElement;
  return newElement;
};

/**
 * функция генерации блока в стиле img из элемента списка картинок
 * @param {string} arrayElement - элемент массива
 * @return {HTMLImageElement} - возвращает блок для вставки в стиле списка
 */
var generatePictureLi = function (arrayElement) {
  var newElement = document.createElement('li').appendChild(document.createElement('img'));
  newElement.setAttribute('src', arrayElement);
  newElement.setAttribute('width', '70');
  return newElement;
};

/**
 * Функция, которая берет блок и заполняет его элементамми из массива, применяя к ним функцию.
 * @param {object} listBlock - блок для заполнения
 * @param {array} array - массив
 * @param {function} specialFunction - специальная функция для обработки массива
 */
var fillBlockByArrayWithFunction = function (listBlock, array, specialFunction) {
  while (listBlock.firstChild) {
    listBlock.removeChild(listBlock.firstChild);
  }
  for (var w = 0; w < array.length; w++) {
    listBlock.appendChild(specialFunction(array[w]));
  }
};

/**
 * функуия создает DOM элемент карточки на основе JS объекта и шаблона
 * @param {object} adsObject - объкт объявления
 * @param {object} template - шаблон
 * @return {ActiveX.IXMLDOMNode | Node} - возвращает заполненный блок
 */
var createMapCardElement = function (adsObject, template) {
  var newElement = template.cloneNode(true);
  newElement.querySelector('h3').textContent = adsObject.offer.title;
  newElement.querySelector('p small').textContent = adsObject.offer.address;
  newElement.querySelector('.popup__price').textContent = adsObject.offer.price + ' ₽/ночь';
  newElement.querySelector('h4').textContent = translateOfferToRus(adsObject.offer.type);
  var paragraphOfElement = newElement.querySelectorAll('p');
  paragraphOfElement[2].textContent = adsObject.offer.rooms + ' комнаты для ' +
    adsObject.offer.guests + ' гостей';
  paragraphOfElement[3].textContent = 'Заезд после ' + adsObject.offer.checkin +
    ', выезд до ' + adsObject.offer.checkout;
  // var listPopupFeatures = newElement.querySelector('.popup__features');
  fillBlockByArrayWithFunction(newElement.querySelector('.popup__features'), adsObject.offer.features, generateFeatureLi);
  paragraphOfElement[4].textContent = adsObject.offer.description;
  fillBlockByArrayWithFunction(newElement.querySelector('.popup__pictures'), adsObject.offer.photos, generatePictureLi);
  // Меняе SRC....
  newElement.querySelector('.popup__avatar').setAttribute('src', adsObject.author.avatar);
  return newElement;
};

// Генерируем обявления
var adsArrayRandom = generateArrOfAds(VARIANTS_OF, ADS_QUANTITY);

// Активизируем карту
var mapBlock = document.querySelector('.map');
setOrRemoveClassMapFaded(mapBlock, true);

// Создаем фрагмент для маркеров
var mapMarkerFragment = document.createDocumentFragment();
// Заполняем фрагмент маркеров объявлениями
fillMapFragmentByMarkers(adsArrayRandom, mapMarkerFragment, MAP_MARKER_X_OFFSET, MAP_MARKER_Y_OFFSET);
// Отрисовываем фрагмент там, где надо;)
var mapMarker = mapBlock.querySelector('.map__pins');
mapMarker.appendChild(mapMarkerFragment);

// Создаем фрагмент для карточки
var mapCardFragment = document.createDocumentFragment();
// Заполняем фрагмент катрочкой, уж извините - не функция, т.к. всего один вариант;)
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
mapCardFragment.appendChild(createMapCardElement(adsArrayRandom[0], mapCardTemplate));
// Заменяем диалог на фрагмент
var mapCard = document.querySelector('.map');
var mapFiltersContainer = document.querySelector('.map__filters-container');
mapCard.insertBefore(mapCardFragment, mapFiltersContainer);
