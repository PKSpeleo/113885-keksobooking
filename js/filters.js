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
  var filtersFormBlock = document.querySelector('.map__filters-container');
  var typeFilterBlock = filtersFormBlock.querySelector('#housing-type');
  var priceFilterBlock = filtersFormBlock.querySelector('#housing-price');
  var roomsFilterBlock = filtersFormBlock.querySelector('#housing-rooms');
  var guestsFilterBlock = filtersFormBlock.querySelector('#housing-guests');
  var featuresFilerBlocks = filtersFormBlock.querySelectorAll('input');

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
  var filterByCheckBox = function (adFeatures, block) {
    debugger;
    return ((!block.checked) || ((adFeatures.includes(block.value)) && (block.checked)));
  };

  // А здесь мой разум меня покинул :(((
  window.filters = {
    makeNewFiltration: function (evt, adsArray, filtersForm) {
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
        var flagGuest = filterByMap(ad.offer.guests, guestsFilterBlock, housingRooms);
        var flagFeatures = filterByCheckBox(ad.offer.features, featuresFilerBlocks[0]);
        var totalFlag = flagType && flagPrice && flagRooms && flagGuest && flagFeatures;
        return totalFlag;
      };
      return adsArray.filter(filterAds);
    },
    makeFiltration: function (evt, adsArray, filtersForm) {
      var typeFilter = filtersForm.querySelector('#housing-type');
      var priceFilter = filtersForm.querySelector('#housing-price');
      var roomsFilter = filtersForm.querySelector('#housing-rooms');
      var guestsFilter = filtersForm.querySelector('#housing-guests');
      var wifiCheckbox = filtersForm.querySelector('#filter-wifi');
      var dishwasherCheckbox = filtersForm.querySelector('#filter-dishwasher');
      var parkingCheckbox = filtersForm.querySelector('#filter-parking');
      var washerCheckbox = filtersForm.querySelector('#filter-washer');
      var elevatorCheckbox = filtersForm.querySelector('#filter-elevator');
      var conditionerCheckbox = filtersForm.querySelector('#filter-conditioner');

      /**
       * Функция, возвращающая флаг в зависимости, подходит ли данное объявление
       * под филтр
       * @param {object} ad - Объект одного объявления, которое мы проеряем
       * @return {boolean} - tru - подходит, false - не подходит
       */
      var filterAds = function (ad) {
        var flagType = ((housingType[typeFilter.value] === 'any') ||
          (housingType[typeFilter.value] === (ad.offer.type)));
        var flagPrice = ((priceFilter.value === 'any') ||
          ((ad.offer.price < housingPrice[priceFilter.value].max) &&
          (ad.offer.price >= housingPrice[priceFilter.value].min)));
        var flagRooms = ((roomsFilter.value === 'any') ||
          (housingRooms[roomsFilter.value] === (ad.offer.rooms)));
        var flagGuest = ((guestsFilter.value === 'any') ||
          (housingGuests[guestsFilter.value] === (ad.offer.guests)));
        var flagWifi = ((!wifiCheckbox.checked) ||
          ((ad.offer.features.includes('wifi')) && (wifiCheckbox.checked)));
        var flagDishwasher = ((!dishwasherCheckbox.checked) ||
          ((ad.offer.features.includes('dishwasher')) && (dishwasherCheckbox.checked)));
        var flagParking = ((!parkingCheckbox.checked) ||
          ((ad.offer.features.includes('parking')) && (parkingCheckbox.checked)));
        var flagWasher = ((!washerCheckbox.checked) ||
          ((ad.offer.features.includes('washer')) && (washerCheckbox.checked)));
        var flagElevator = ((!elevatorCheckbox.checked) ||
        ((ad.offer.features.includes('elevator')) && (elevatorCheckbox.checked)));
        var flagConditioner = ((!conditionerCheckbox.checked) ||
          ((ad.offer.features.includes('conditioner')) && (conditionerCheckbox.checked)));
        var totalFlag = flagType && flagPrice && flagRooms && flagGuest &&
          flagWifi && flagDishwasher && flagParking && flagWasher && flagElevator && flagConditioner;
        return totalFlag;
      };
      return adsArray.filter(filterAds);
    }
  };
})();
