'use strict';
// Количество объявлений
var ADS_QUANTITY = 8;
// Объявляем массив объявлений
var adsArrayRandom = [];

// Здесь храним временные данные для генерации объявлений
var variantsOf = {
  avatar: 'img/avatars/user{{xx}}.png',
  avatarSeparator: '{{xx}}',
  title: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный ' +
  'прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый ' +
  'негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
  address: '',
  priceMin: 1000,
  priceMax: 1000000,
  type: ['flat', 'house', 'bungalo'],
  roomsMin: 1,
  roomsMax: 5,
  guestsMin: 1,
  guestsMax: 10,
  checkinCheckout: ['12:00', '13:00', '14:00'],
  features: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  description: '',
  photos: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', '' +
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg', '' +
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
  // photos: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
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
 * @return {string} - случайный элемент массива
 */
var chooseRandomArrElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};
/**
 * Функция урезания массива с конца
 * @param {array} arr - массив от которого надо откинуть хваост
 * @return {array} - обрезанный с хвоста массив
 */
var cropArrayFromEnd = function (arr) {
  return arr.slice(0, randomiseIntegerMinToMax(0, arr.length));
};
var splitStringBySeparatorToArray = function (string, separator) {
  var arr = [];
  string.split(separator).forEach(function (arrElement, indexOfElement) {
    arr[indexOfElement] = arrElement;
  });
  return arr;
};
/**
 * Функция, которая перемешивает массив!
 * @param {array} array - массив для перемешивания
 * @return {Array} - возвращает перемешанный масив
 */
var mixArray = function (array) {
  var temp;
  var randomIndex;
  var mixedArray = [];
  // если писать просто mixedArray = array, то передается по ссылке чтоли?
  for (var a = 0; a < array.length; a++) {
    mixedArray[a] = array[a];
  }
  for (var k = 0; k < mixedArray.length; k++) {
    randomIndex = randomiseIntegerMinToMax(k, mixedArray.length - 1);
    temp = mixedArray[k];
    mixedArray[k] = mixedArray[randomIndex];
    mixedArray[randomIndex] = temp;
  }
  return mixedArray;
};
/**
 * Функция создания массива объявлений с данными
 * @param {object} variantsOfObject - объект с вариантами содержимого объявлений
 * @param {number} adsQuantity - количество объявлений
 * @return {Array} - возвращает массив объектов объявлений
 */
var generateArrOfAds = function (variantsOfObject, adsQuantity) {
  var adsArray = [];
  var avatar = splitStringBySeparatorToArray(variantsOfObject.avatar, variantsOfObject.avatarSeparator);
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
        description: '',
        photos: mixArray(variantsOfObject.photos)
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
adsArrayRandom = generateArrOfAds(variantsOf, ADS_QUANTITY);

