'use strict';
(function () {
  // Смещения для нахождения кончика метки - противоречит заданию,
  // но соответствует реальности, отсчет от центра
  var MAP_MARKER_OFFSET = {
    x: 0,
    y: 35,
    mainY: 49
  };
  // находим шаблон
  var templateFragment = document.querySelector('template').content;

  // Находим шаблон маркеров
  var mapMarketTemplateFragment = templateFragment.querySelector('.map__pin');

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
    /**
     * Функуия рисует пины на карте на основе массива с рандомными
     * объявлениями в блоке карт
     * @param {array} adsArrayRandom - массив объявлений
     * @param {object} mapBlock - блок карты
     */
    drawPins: function (adsArrayRandom, mapBlock) {
      // Создаем и заполняем фрагмент маркеров объявлениями
      var mapMarkersFragment = createMapFragmentByMarkersWithTemplate(
          adsArrayRandom, mapMarketTemplateFragment, MAP_MARKER_OFFSET);
      // Находим, где отрисоовывать фрагмент маркеров
      var mapMarker = mapBlock.querySelector('.map__pins');
      mapMarker.appendChild(mapMarkersFragment);
    },
    address: {
      /**
       * Функция высчитывает координаты в системе карты из события
       * @param {number} pageX - координата У относительно страницы
       * @param {number} layerX - координата У относительно метки
       * @param {object} mapBlock - блок пина
       * @return {number} - координата в системе карты
       */
      getX: function (pageX, layerX, mapBlock) {
        return (pageX - layerX - Math.floor(mapBlock.getBoundingClientRect().left));
      },
      /**
       * Функция высчитывает координаты в системе карты из события
       * @param {number} pageY - координата У относительно страницы
       * @param {number} layerY - координата У относительно метки
       * @return {number} - координата в системе карты
       */
      getY: function (pageY, layerY) {
        if (isNaN(pageY + MAP_MARKER_OFFSET.mainY - layerY)) {
          debugger;
        }
        return (pageY + MAP_MARKER_OFFSET.mainY - layerY);
      }
    },
    /**
     * Функция перемещает наш маркет
     * @param {object} button - объект кнопки
     * @param {object} shift - объект со смещениями
     */
    move: function (button, shift) {
      button.style.top = (button.offsetTop - shift.y) + 'px';
      button.style.left = (button.offsetLeft - shift.x) + 'px';
    }
  };
})();
