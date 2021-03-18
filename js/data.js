let rawData = null;
let preparedData = null;

const MAX_PINS_COUNT = 10;

/**
 * Возвращает первые MAX_PIN_COUNT элементы массива data
 * @param {*} data - массив
 */
const sliceMaxCount = (data) => data.slice(0, MAX_PINS_COUNT);

/**
 * Подготавливает сырые данные
 * Сохраняет результат в preparedData
 * @param {*} filterData - ф-ия которая умеет фильтровать данные, по умол sliceMaxCount
 */
const prepareData = (filterData) => {
  if (!rawData) {
    throw new Error('Ошибка вызова данных!');
  }

  let data = rawData;

  if (typeof filterData === 'function') {
    data = data.filter(filterData);
  }

  if(data.length > MAX_PINS_COUNT){
    data = sliceMaxCount(data);
  }

  preparedData = data;
};

const getData = () => preparedData;

/**
 * Сохраняет в замыкание модуля сырые данные
 * Вызывает prepareData с дефолтными настройками
 * @param {*} data
 */
const storeData = (data) => {
  rawData = data;
  prepareData();
};

export {storeData, getData, prepareData}
