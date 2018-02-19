'use strict';
// Количество объявлений
var ADS_QUANTITY = 8;

// Смещения для нахождения кончика метки - противоречит заданию,
// но соответствует реальности, отсчет от центра
var MAP_MARKER_X_OFFSET = 0;
var MAP_MARKER_Y_OFFSET = 35;

// Здесь храним исходные данные для генерации объявлений
var INITIAL_DATA = {
  avatarPathName: 'img/avatars/user0',
  avatarExtension: '.png',
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
  addressSeparator: ', ',
  priceMin: 1000,
  priceMax: 1000000,
  type: {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  },
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
  description: '',
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
var generateAds = function (variantsOfObject, adsQuantity) {
  var adsArray = [];
  var locationX;
  var locationY;
  for (var i = 0; i < adsQuantity; i++) {
    locationX = randomiseIntegerMinToMax(
        variantsOfObject.locationXMax, variantsOfObject.locationXMin);
    locationY = randomiseIntegerMinToMax(
        variantsOfObject.locationYMin, variantsOfObject.locationYMax);
    adsArray[i] = {
      author: {
        avatar: variantsOfObject.avatarPathName + (i + 1) + variantsOfObject.avatarExtension
      },
      offer: {
        title: variantsOfObject.title[i],
        address: locationX + variantsOfObject.addressSeparator + locationY,
        price: randomiseIntegerMinToMax(variantsOfObject.priceMin, variantsOfObject.priceMax),
        type: chooseRandomArrElement(Object.keys(variantsOfObject.type)),
        rooms: randomiseIntegerMinToMax(variantsOfObject.roomsMin, variantsOfObject.roomsMax),
        guests: randomiseIntegerMinToMax(variantsOfObject.guestsMin, variantsOfObject.guestsMax),
        checkin: chooseRandomArrElement(variantsOfObject.checkinCheckout),
        checkout: chooseRandomArrElement(variantsOfObject.checkinCheckout),
        features: cropArrayFromEnd(variantsOfObject.features),
        description: variantsOfObject.description,
        photos: mixArrayRandomly(variantsOfObject.photos)
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
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
 * @param {object} adObject - Объект с объявлением
 * @param {object} templateObject - Объект с шаблоном
 * @param {number} offsetX - отступ стрелки маркера по оси Х
 * @param {number} offsetY - отступ стрелки маркера по оси У
 * @return {IXMLDOMNode | Node} - баттан, который возвращается
 */
var createMapMarkerElement = function (adObject, templateObject, offsetX, offsetY) {
  // Задаем положение указателя со смещением
  var button = templateObject.cloneNode(true);
  button.style.left = (adObject.location.x - offsetX) + 'px';
  button.style.top = (adObject.location.y - offsetY) + 'px';
  // Цепляем картинку на указатель и задаем ей параметры
  var image = button.querySelector('img');
  image.setAttribute('src', adObject.author.avatar);
  image.setAttribute('width', '40');
  image.setAttribute('height', '40');
  image.setAttribute('draggable', 'false');
  return button;
};

/**
 * Функцию создает и заполняет блока маркеров DOM-элементами на основе массива JS-объектов
 * с применением шаблона
 * @param {array} ads - массив объектов объявлений
 * @param {object} templateBlock - блок шаблона, на основе которого мы создаем маркеры
 * @param {number} markerOffsetX - отступ маркера по оси Х
 * @param {number} markerOffsetY - отступ маркера по оси У
 * @return {DocumentFragment} - возвращает заполненный DOM блок с маркерами
 */
var createMapFragmentByMarkersWithTemplate = function (
    ads, templateBlock, markerOffsetX, markerOffsetY) {
  // Создаем блок
  var domBlock = document.createDocumentFragment();
  // Пишем в блок маркеры
  for (var j = 0; j < ads.length; j++) {
    domBlock.appendChild(createMapMarkerElement(
        ads[j], templateBlock, markerOffsetX, markerOffsetY));
  }
  return domBlock;
};

/**
 * Функция, заполняющая блок (из шаблона) элементами списка с картинками согласно исходному массиву
 * @param {object} listBlock - Блок, в котором работаем, созданный на основе шаблона
 * @param {array} picArray - Массив картинок, которыми заполняем блок
 */
var fillPopupPictureBlock = function (listBlock, picArray) {
  // Запоминаем шаблон элемента списка
  var liListElement = listBlock.querySelector('li');
  // Зачищаем список для простоты, чтобы не заморачиваться с первым элементом и кучей if
  while (listBlock.firstChild) {
    listBlock.removeChild(listBlock.firstChild);
  }
  // Используюя ранее запомненный шаблон, заполняем список картинок
  for (var i = 0; i < picArray.length; i++) {
    var newLiListElement = liListElement.cloneNode(true);
    newLiListElement.querySelector('img').setAttribute('src', picArray[i]);
    newLiListElement.querySelector('img').setAttribute('width', '70');
    listBlock.appendChild(newLiListElement);
  }
};

/**
 * Функция, отвчает на вопрос, есть ли нужный элемент в массиве
 * @param {string} value - элемент, наличие которого мы проверяем
 * @param {array} array - массив, в котором мы ищем элемент
 * @return {boolean} - true or false, есть ли элемент в массиве или нет
 */
var isInArray = function (value, array) {
  return array.indexOf(value) > -1;
};
/**
 * Функция, удаляет из блока шаблона лишние LI в зависимости от наличия класса в array
 * @param {object} listBlock - блок в котором работаем (шаблон) и удаляем лишнее
 * @param {array} array - массив фич текущего объявления,
 * согласно которому надо оставить или удалить
 */
var fillPopupFeaturesBlock = function (listBlock, array) {
  var liList = listBlock.querySelectorAll('.feature');
  for (var i = 0; i < liList.length; i++) {
    if (!isInArray(liList[i].classList[1].split('--')[1], array)) {
      listBlock.removeChild(liList[i]);
    }
  }
};
/**
 * функуия создает DOM элемент карточки на основе JS объекта, шаблона
 * и вариантов перевода;_
 * @param {object} adsObject - объкт объявления
 * @param {object} template - шаблон
 * @param {object} variantsOfType - некий шаблон для вариантов перевода
 * @return {ActiveX.IXMLDOMNode | Node} - возвращает заполненный блок
 */
var createMapCardElement = function (adsObject, template, variantsOfType) {
  // Создаем блок для заполнения
  var domBlock = document.createDocumentFragment();
  // Копирумем шаблон
  var newElement = template.cloneNode(true);
  // Правим заголовок
  newElement.querySelector('h3').textContent = adsObject.offer.title;
  // Правим адрес
  newElement.querySelector('p small').textContent = adsObject.offer.address;
  // Правим цену
  newElement.querySelector('.popup__price').textContent = adsObject.offer.price + ' ₽/ночь';
  // Правим тим жилища
  newElement.querySelector('h4').textContent = variantsOfType[adsObject.offer.type];
  // Ищем по 'p'
  var paragraphOfElement = newElement.querySelectorAll('p');
  // Правим данные о комнатах и гостях
  paragraphOfElement[2].textContent =
    adsObject.offer.rooms + ' комнаты для ' + adsObject.offer.guests + ' гостей';
  // Правим время заезда и выезда
  paragraphOfElement[3].textContent =
    'Заезд после ' + adsObject.offer.checkin + ', выезд до ' + adsObject.offer.checkout;
  // Правим фичи
  fillPopupFeaturesBlock(newElement.querySelector('.popup__features'), adsObject.offer.features);
  // Правим описание
  paragraphOfElement[4].textContent = adsObject.offer.description;
  // Правим картинки
  fillPopupPictureBlock(newElement.querySelector('.popup__pictures'), adsObject.offer.photos);
  // Меняе SRC....
  newElement.querySelector('.popup__avatar').setAttribute('src', adsObject.author.avatar);
  // Аппендим все в дом элемент
  domBlock.appendChild(newElement);
  // Возвращаем дом элемент
  return domBlock;
};

// Генерируем обявления
var adsArrayRandom = generateAds(INITIAL_DATA, ADS_QUANTITY);

// Активизируем карту
var mapBlock = document.querySelector('.map');
setOrRemoveClassMapFaded(mapBlock, true);

// находим шаблон
var templateFragment = document.querySelector('template').content;

// Находим шаблон маркеров
var mapMarketTemplateFragment = templateFragment.querySelector('.map__pin');

// Создаем и заполняем фрагмент маркеров объявлениями
var mapMarkersFragment = createMapFragmentByMarkersWithTemplate(
    adsArrayRandom, mapMarketTemplateFragment, MAP_MARKER_X_OFFSET, MAP_MARKER_Y_OFFSET);
// Находим, где отрисоовывать фрагмент маркеров
var mapMarker = mapBlock.querySelector('.map__pins');
// Отрисовываем маркеры там, где надо
mapMarker.appendChild(mapMarkersFragment);

// Находим шаблон для карточки
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
// Создаем и аполняем фрагмент катрочкой, уж извините - не функция, т.к. всего один вариант;)
var mapCardFragment = createMapCardElement(adsArrayRandom[0], mapCardTemplate, INITIAL_DATA.type);
// Находим, куда засовывать фрагмент с диалогом
var mapCard = document.querySelector('.map');
var mapFiltersContainer = document.querySelector('.map__filters-container');
// Отрисовываем там, где надо
mapCard.insertBefore(mapCardFragment, mapFiltersContainer);
