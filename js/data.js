'use strict';
(function () {
  // Количество объявлений
  var ADS_QUANTITY = 8;

  // Мапа для типов жидищь
  var FlatType = {
    TRANSLATE: {
      flat: 'Квартира',
      house: 'Дом',
      bungalo: 'Бунгало'
    }
  };

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
  window.data = {
    /**
     * Функция создания массива объектов объявлений с данными
     * @return {Array} - возвращает массив объектов объявлений
     */
    generateAds: function () {
      var adsArray = [];
      var locationX;
      var locationY;
      for (var i = 0; i < ADS_QUANTITY; i++) {
        locationX = window.util.randomiseIntegerMinToMax(
            INITIAL_DATA.locationXMax, INITIAL_DATA.locationXMin);
        locationY = window.util.randomiseIntegerMinToMax(
            INITIAL_DATA.locationYMin, INITIAL_DATA.locationYMax);
        adsArray[i] = {
          author: {
            avatar: INITIAL_DATA.avatarPathName + (i + 1) + INITIAL_DATA.avatarExtension
          },
          offer: {
            title: INITIAL_DATA.title[i],
            address: locationX + INITIAL_DATA.addressSeparator + locationY,
            price: window.util.randomiseIntegerMinToMax(INITIAL_DATA.priceMin, INITIAL_DATA.priceMax),
            type: window.util.chooseRandomArrElement(Object.keys(FlatType.TRANSLATE)),
            rooms: window.util.randomiseIntegerMinToMax(INITIAL_DATA.roomsMin, INITIAL_DATA.roomsMax),
            guests: window.util.randomiseIntegerMinToMax(INITIAL_DATA.guestsMin, INITIAL_DATA.guestsMax),
            checkin: window.util.chooseRandomArrElement(INITIAL_DATA.checkinCheckout),
            checkout: window.util.chooseRandomArrElement(INITIAL_DATA.checkinCheckout),
            features: window.util.cropArrayFromEnd(INITIAL_DATA.features),
            description: INITIAL_DATA.description,
            photos: window.util.mixArrayRandomly(INITIAL_DATA.photos)
          },
          location: {
            x: locationX,
            y: locationY
          }
        };
      }
      return adsArray;
    }
  };
})();
