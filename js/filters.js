'use strict';
(function () {
  var housingType = {
    'any': 'any',
    'flat': 'flat',
    'house': 'house',
    'bungalo': 'bungalo'
  };
  var housingPrice = {
    'any': {
      min: 'any',
      max: 'any'
    },
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

  // А здесь мой разум меня покинул :(((
  window.filters = {
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

      var filterAds = function (ad) {
        var flagType = ((housingType[typeFilter.value] === 'any') ||
          (housingType[typeFilter.value] === (ad.offer.type)));
        var flagPrice = ((priceFilter.value === 'any') ||
          ((ad.offer.price < housingPrice[priceFilter.value].max) &&
          (ad.offer.price >= housingPrice[priceFilter.value].min)));
        var flagRooms = ((roomsFilter.value === 'any') ||
          (housingRooms[roomsFilter.value] === (ad.offer.rooms)));
        var flagGuest = ((guestsFilter.value === 'any') ||
          (housingGuests[guestsFilter.value] === (ad.offer.rooms)));
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
        debugger;
        return totalFlag;
      };
      var filteredAds = adsArray.filter(filterAds);
    }
  };
})();
