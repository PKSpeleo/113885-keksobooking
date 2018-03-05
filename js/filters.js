'use strict';
(function () {
  var housingType = {
    'any': 'any',
    'flat': 'flat',
    'house': 'house',
    'bungalo': 'bungalo'
  };
  var housingPrice = {
    'any': 'any',
    'low': {
      min: 0,
      max: 10000
    },
    'middle': {
      min: 10000,
      max: 50000
    },
    'high': {
      min: 50000,
      max: 100000000
    }
  };
  var housingRooms = {
    'any': 'any',
    '1': 1,
    '2': 2,
    '3': 3
  };
  var housingGuests = {
    'any': 'any',
    '1': 1,
    '2': 2
  };
  // Где же фильтры
  var filtersFormBlock = document.querySelector('.map__filters-container');
  // Ищем селекторы отдельно каждый, их все равно немного.
  var typeFilterBlock = filtersFormBlock.querySelector('#housing-type');
  var priceFilterBlock = filtersFormBlock.querySelector('#housing-price');
  var roomsFilterBlock = filtersFormBlock.querySelector('#housing-rooms');
  var guestsFilterBlock = filtersFormBlock.querySelector('#housing-guests');
  // Фичи так и быть найдем все сразу
  var featuresFilterBlocks = filtersFormBlock.querySelectorAll('input');

  /**
   * Функция фильтраыии объявления согласно мапе
   * @param {string} adValue - то, что в обявлении
   * @param {object} block - блок текущего фильтра
   * @param {object} map - мапа для фильтра;)
   * @return {boolean} - тру, если объявление проходит фильр
   */
  var filterByMap = function (adValue, block, map) {
    if ((map[block.value] === 'any') || (map[block.value] === (adValue))) {
      return true;
    } else {
      return ((adValue < map[block.value].max) && (adValue >= map[block.value].min));
    }
  };
  /**
   * Функция фильтации объявления согласно
   * @param {array} adFeatures - список фич
   * @param {object} block - блок с фильтром
   * @return {boolean} - тру, если подходит под фильтр
   */
  var filterByCheckBox = function (adFeatures, block) {
    return ((!block.checked) || ((adFeatures.includes(block.value)) && (block.checked)));
  };

  window.filters = {
    /**
     * Функция фильтрации
     * @param {array} adsArray - массив для фильтрации
     * @return {array} - массив отлфильтрованный
     */
    makeFiltration: function (adsArray) {
      /**
       * Функция, возвращающая флаг в зависимости, подходит ли данное объявление
       * под филтр
       * @param {object} ad - Объект одного объявления, которое мы проеряем
       * @return {boolean} - tru - подходит, false - не подходит
       */
      var filterAds = function (ad) {
        var flagType = filterByMap(ad.offer.type, typeFilterBlock, housingType);
        var flagPrice = filterByMap(ad.offer.price, priceFilterBlock, housingPrice);
        var flagRooms = filterByMap(ad.offer.rooms, roomsFilterBlock, housingRooms);
        var flagGuest = filterByMap(ad.offer.guests, guestsFilterBlock, housingGuests);
        var flagFeatures = true;
        featuresFilterBlocks.forEach(function (filter) {
          flagFeatures = flagFeatures && filterByCheckBox(ad.offer.features, filter);
        });
        return flagType && flagPrice && flagRooms && flagGuest && flagFeatures;
      };
      return adsArray.filter(filterAds);
    }
  };
})();
