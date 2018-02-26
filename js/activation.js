'use strict';
(function () {
  /**
   * Функция, которая скрывает или показывает блок, удаляя или добавляя
   * класс 'map--faded'
   * @param {object} block - блок для манипуляций
   * @param {boolean} status - видно или нет
   */
  var setOrRemoveClassMapFaded = function (block, status) {
    if (status) {
      block.classList.add('map--faded');
    } else {
      block.classList.remove('map--faded');
    }
  };

  /**
   * Функция, отлючающая или включающая возможность заполнения форм
   * удаляя или добавляя атрибут disabled в fieldset
   * @param {object} block - блок, в котором мы отключаем
   * @param {boolean} status - добавлен атрибут или нет
   */
  var setOrRemoveAttributeDisable = function (block, status) {
    var fieldset = block.querySelectorAll('fieldset');
    if (status) {
      fieldset.forEach(function (value) {
        value.setAttribute('disabled', '');
      });
    } else {
      fieldset.forEach(function (value) {
        value.removeAttribute('disabled', '');
      });
    }
  };

  /**
   * Функция, которая удаляет или добавля класс notice__form--disabled
   * @param {object} block - блок в котором меняем класс
   * @param {boolean} status - есть класс или нет
   */
  var setOrRemoveClassNoticeFormDisabled = function (block, status) {
    if (status) {
      block.classList.add('notice__form--disabled');
    } else {
      block.classList.remove('notice__form--disabled');
    }
  };

  window.activation = {
    /**
     * Функция акивации и деактивации страницы
     * @param {object} blockOfMap - блок карты
     * @param {object} blockOfForm - блок формы
     * @param {boolean} status - Если True - то не видно, если False - то видно;)
     */
    setActiveOrInactivePage: function (blockOfMap, blockOfForm, status) {
      setOrRemoveClassMapFaded(blockOfMap, status);
      setOrRemoveClassNoticeFormDisabled(blockOfForm, status);
      setOrRemoveAttributeDisable(blockOfForm, status);
    }
  };
})();
