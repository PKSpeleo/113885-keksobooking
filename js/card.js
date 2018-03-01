'use strict';
(function () {
  // Мапа для типов жидищь
  var FlatType = {
    TRANSLATE: {
      flat: 'Квартира',
      house: 'Дом',
      bungalo: 'Бунгало'
    }
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
      newLiListElement.querySelector('img').setAttribute('width', '40');
      newLiListElement.querySelector('img').setAttribute('height', '40');
      listBlock.appendChild(newLiListElement);
    }
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
      if (!window.util.isInArray(liList[i].classList[1].split('--')[1], array)) {
        listBlock.removeChild(liList[i]);
      }
    }
  };
  window.card = {
    /**
     * Функция создает DOM элемент карточки на основе JS объекта, шаблона
     * и вариантов перевода;_
     * @param {object} adsObject - объкт объявления
     * @param {object} template - шаблон
     * @return {ActiveX.IXMLDOMNode | Node} - возвращает заполненный блок
     */
    createMapCardElement: function (adsObject, template) {
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
      newElement.querySelector('h4').textContent = FlatType.TRANSLATE[adsObject.offer.type];
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
    }
  };
})();
