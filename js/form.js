'use strict';
(function () {
  // Нужности для правки атрибутов форм
  var FIELD_ATTRIBUTES = {
    titleMinLength: 30,
    titleMaxLength: 100,
    priceMax: 1000000,
  };
  // Мап для типов жидищь
  var PRICE_MIN = {
    flat: 1000,
    bungalo: 0,
    house: 5000,
    palace: 10000
  };
  var MAIN_PIN = {
    x: 602,
    y: 425
  };
  // Где же блок адреса
  var addressBlock = document.querySelector('#address');
  /**
   * Функция проверки и подготовки формы к работе
   * @param {object} blockDom - блок с формой
   * @param {object} flatMapa - объект с мапой по типам жилищь
   */
  var checkAndChangeNoticeForm = function (blockDom, flatMapa) {
    // Где же заголовок?
    var titleField = blockDom.querySelector('#title');
    // Правим атрибуты заголовка
    titleField.setAttribute('required', '');
    titleField.setAttribute('minlength', FIELD_ATTRIBUTES.titleMinLength);
    titleField.setAttribute('maxlength', FIELD_ATTRIBUTES.titleMaxLength);
    // Прописываем начальный адрес
    window.form.setAddress(MAIN_PIN.x, MAIN_PIN.y);
    // Где же поле цены?
    var priceInput = blockDom.querySelector('#price');
    // Правим статичные атрибуты цены
    priceInput.setAttribute('required', '');
    priceInput.setAttribute('max', FIELD_ATTRIBUTES.priceMax);
    // Где же тип жилья?
    var typeField = blockDom.querySelector('#type');
    priceInput.setAttribute('min', flatMapa[typeField.value]);
    /**
     * Функция - обработчик собитыия на изменения в поле тип жилья
     */
    var onTypeFieldChange = function () {
      // Меняем атрибут минимальноей цены согласно мапе
      priceInput.setAttribute('min', flatMapa[typeField.value]);
    };
    // Добавляем обработчик события на изменение поля тип жилья
    typeField.addEventListener('change', onTypeFieldChange);

    // Ставим статичные атрибуты адресу
    addressBlock.setAttribute('readonly', '');

    // Где же поле времени заезды и его варинты?
    var timeinField = blockDom.querySelector('#timein');
    var timeinFieldVariants = timeinField.querySelectorAll('option');
    var timeoutField = blockDom.querySelector('#timeout');
    var timeoutFieldsVariants = timeoutField.querySelectorAll('option');
    /**
     * Функция добавляет обработчик события изменений в двух полях
     * времени заезда и выезда и их связывание
     * согласно тз, согласно ведущему и ведомогу полю
     * Раделение на ведущее и ведомое для того, чтобы использовать эту функцию
     * для навешивания на кажое поле в отдельности, задавая параметры
     * @param {object} masterBlock - Первое поле (Ведущее)
     * @param {object} masterBlockVariants - Варианты первого поля (Ведущего)
     * @param {object} slaveBlock - Второе поле (Ведомое)
     * @param {object} slaveBlockVariants - Варианты второго поля (Ведомого)
     */
    var addMutualChangeListener = function (masterBlock, masterBlockVariants, slaveBlock, slaveBlockVariants) {
      /**
       * Собственно сама функция - обработчик события изменения поля
       */
      var onTimeFieldsChange = function () {
        // Берем за основу время, выбранное в данном поле
        var actualTimeToSet = masterBlock.value;
        /**
         * Функция проставляет атрибут selected там где надо, где не надо - убирает
         * а также принудительно проставляет value у поля
         * @param {object} block - блок с полем
         * @param {object} blockVariants - массив боорками с вариантами этого поля
         * @param {string} time - время которе проставляем
         */
        var setSelectedAttributeAndValue = function (block, blockVariants, time) {
          // Убарем у всех вариантов полей атрибут selected от греха подальше, дабы не глучило;)
          blockVariants.forEach(function (value) {
            value.removeAttribute('selected');
          });
          // А тут проставляем атрибут selected там где надо и насильно присваиваем value, дабы не глучило;)
          blockVariants.forEach(function (value) {
            if (value.getAttribute('value') === time) {
              value.setAttribute('selected', '');
              block.value = time;
            }
          });
        };
        // Проходимся по ведущему полю, меняем на текущее значение, правим атрибуты, ставим value
        setSelectedAttributeAndValue(masterBlock, masterBlockVariants, actualTimeToSet);
        // Проходимся по ведомомн полю, меняем на текущее значение, правим атрибуты, ставим value
        setSelectedAttributeAndValue(slaveBlock, slaveBlockVariants, actualTimeToSet);
      };
      // Навешиваем обработчик событий
      masterBlock.addEventListener('change', onTimeFieldsChange);
    };
    // Навешиваем обработчик на изменения в поле timeIn
    addMutualChangeListener(
        timeinField, timeinFieldVariants, timeoutField, timeoutFieldsVariants);
    // Навешиваем обработчик на изменения в поле timeOut
    addMutualChangeListener(
        timeoutField, timeoutFieldsVariants, timeinField, timeinFieldVariants);

    // Где же у нас комнаты и вместимость?
    var roomNumberField = blockDom.querySelector('#room_number');
    var roomNumberVariants = roomNumberField.querySelectorAll('option');
    var capacityField = blockDom.querySelector('#capacity');
    var capacityFieldVariants = capacityField.querySelectorAll('option');
    // Мапа для вместимости комнат
    var ROOM_TO_CAPACITY = {
      '1': [1],
      '2': [1, 2],
      '3': [1, 2, 3],
      '100': [0]
    };
    // Прописываем статичные атрибуты
    capacityField.setAttribute('required', '');
    // Для порядка делаем value пустым, чтобы обязать его заполнить выбрав вариант
    capacityField.value = '';
    // Прописываем статичные атрибуты
    roomNumberField.setAttribute('required', '');
    // Для порядка делаем value пустым, чтобы обязать его заполнить выбрав вариант
    roomNumberField.value = '';
    /**
     * Функция навешивает обработчик на изменения в поле мастер
     * и корректирует видимости вариантов согласно мапе
     * Структура странная, была идея одна, но потом она превратилась в другую,
     * а струтура "симметричности" функции оставил, хотя она так и не работает
     * @param {object} masterBlock - Вудущиий блок - количество комнат
     * @param {object} masterBlockVariants - массив объектов вариантов количества комнат
     * @param {object} slaveBlock - Ведомый блок - количество гостей
     * @param {object} slaveBlockVariants - массив объектов варинтов количества гостей
     */
    var addChangeListenerForRoomsAndCapacity = function (
        masterBlock, masterBlockVariants, slaveBlock, slaveBlockVariants) {
      /**
       * Функция - обработчик события внесения изменений в поле количества комнат
       */
      var onRoomsFieldsChange = function () {
        // Берем за базу - выбранное значение
        var actualToSet = masterBlock.value;
        /**
         * Функция, которая проставляет атрибуты selected и disabled согласно ТЗ.
         * Заодно принудительно проставляет value то со значением то с пустым значением
         * Функция сумасшедшая! Сам ее понимаю на уровне подсознания;) Но работает отлично;)
         * Зато "симметричная";)
         * @param {object} block - Поле которе правим
         * @param {object} blockVariants - Массив объектов возможных значений полей
         * @param {string} valueToSet - Значение от которого отталкиваемся
         */
        var setSelectedAttributeAndValue = function (block, blockVariants, valueToSet) {
          // Зачищаем атрибут selected на всякий пожарный
          blockVariants.forEach(function (value) {
            value.removeAttribute('selected');
          });
          // А туууут... Выствляем нужные значения;) value, selected, disabled
          blockVariants.forEach(function (value) {
            // Если это про количество комнат и оно равно нужному то...
            if ((value.getAttribute('value') === valueToSet) &&
              (block.getAttribute('id') === 'room_number')) {
              // Добавляем атрибут selected
              value.setAttribute('selected', '');
              // И принудительно ставим value
              block.value = valueToSet;
              // Если это про вместимость гостей...
            } else if (block.getAttribute('id') === 'capacity') {
              // И это тот самы вариант, который подходит согласно мапе
              if (ROOM_TO_CAPACITY[valueToSet].includes(parseInt(value.value, 10))) {
                // То даем возможность его выбирать
                value.removeAttribute('disabled');
              } else {
                // А если не то - то не даем;)
                value.setAttribute('disabled', '');
              }
            }
          });
          // Принудительно сбрасываем, чтобы не выбирать за пользователя, а ему напомнит валидация
          slaveBlock.value = '';
        };
        // Обрабатываем поле с количеством комнат хитрой "симметричной" функцией
        setSelectedAttributeAndValue(
            masterBlock, masterBlockVariants, actualToSet);
        // А теперь обрабатываем поле количества гостей той же хихитрой функцией;)
        setSelectedAttributeAndValue(
            slaveBlock, slaveBlockVariants, actualToSet);
      };
      // Навешиваем обработчик событий на изменения в поле количества комнат
      masterBlock.addEventListener('change', onRoomsFieldsChange);
    };
    // Функция, навешивающая изменения в поле количесва комнат
    addChangeListenerForRoomsAndCapacity(
        roomNumberField, roomNumberVariants, capacityField, capacityFieldVariants);
  };

  // Находим, где же форма
  var noticeFormBlock = document.querySelector('.notice');

  window.form = {
    /**
     * Устанавливает значение адреса на переданные значения в поле адреса
     * @param {number} addressX - адрес Х
     * @param {number} addressY - адрес У
     */
    setAddress: function (addressX, addressY) {
      addressBlock.value = addressX + ', ' + addressY;
    },
    /**
     * Функция инициализации карты
     */
    init: function () {
      checkAndChangeNoticeForm(noticeFormBlock, PRICE_MIN);
    },
    /**
     * Функция, отлючающая или включающая возможность заполнения форм
     * (в форме блокирует все поля)
     * удаляя или добавляя атрибут disabled в fieldset
     * @param {object} block - блок, в котором мы отключаем
     * @param {boolean} deactivation - добавлен атрибут или нет
     */
    blockFormFields: function (block, deactivation) {
      var fieldset = block.querySelectorAll('fieldset');
      if (deactivation) {
        fieldset.forEach(function (value) {
          value.setAttribute('disabled', '');
        });
      } else {
        fieldset.forEach(function (value) {
          value.removeAttribute('disabled', '');
        });
      }
    },
    /**
     * Функция, которая удаляет или добавля класс notice__form--disabled
     * (затемняет форму)
     * @param {object} block - блок в котором меняем класс
     * @param {boolean} deactivation - есть класс или нет
     */
    fadeFormFields: function (block, deactivation) {
      if (deactivation) {
        block.classList.add('notice__form--disabled');
      } else {
        block.classList.remove('notice__form--disabled');
      }
    }
  };
})();
