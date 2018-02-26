'use strict';
(function () {
  // Смещения для нахождения кончика метки - противоречит заданию,
  // но соответствует реальности, отсчет от центра
  var MAP_MARKER_OFFSET = {
    x: 0,
    y: 35
  };
  // находим шаблон
  var templateFragment = document.querySelector('template').content;

  // Находим шаблон маркеров
  var mapMarketTemplateFragment = templateFragment.querySelector('.map__pin');

  // Ищим блок с картой
  var mapBlock = document.querySelector('.map');

  // Находим, где отрисоовывать фрагмент маркеров
  var mapMarker = mapBlock.querySelector('.map__pins');

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
  window.pin = {
    drawPins: function (adsArrayRandom) {
      // Создаем и заполняем фрагмент маркеров объявлениями
      var mapMarkersFragment = createMapFragmentByMarkersWithTemplate(
          adsArrayRandom, mapMarketTemplateFragment, MAP_MARKER_OFFSET);
      // Отрисовываем маркеры там, где надо
      mapMarker.appendChild(mapMarkersFragment);
    }
  };
})();
