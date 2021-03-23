/* global _:readonly */
import {deactivateForm, activateForm, setMarkerCoordinates} from './form.js';
import {createMap, createIcons, removeIcons} from './map.js';
import {createPopup, showAlertPopup} from './popup.js';
import {loadData, SERVER_GET_URL} from './api.js';
import {setSelectValue, setFeatureValue, checkData} from './filters.js';
import {storeData, getData, prepareData} from './data.js';

const RERENDER_DELAY = 500;

/**
 * На основе объекта объявления создает объект с координатами объявления
 * @param {*} ad объект объявления
 * @returns объект с координатами объявления
 */
const adaptPoints = ad => ({
  lat: ad.location.lat,
  lng: ad.location.lng,
})

/**
 * Отрисовывает маркеры объявлений на карте
 * 1. На основе переданного массива создает новый, в котором содержатся только координаты
 * 2. Создает обработчик события клика по маркеру объявления
 * 3. Вызывает функцию отрисовки маркеров
 * @param {*} ads обработанные данные с сервера, массив с объектами объявлений
 */

const renderIcons = (ads) => {
  const points = ads.map(adaptPoints);
  const pinClickHandler = idx => createPopup(ads[idx]);

  createIcons(points, pinClickHandler);
}

/**
 * Обработчик успешной загрузки данных с сервера
 * 1. Обрабатывает сырые данные из ответа сервера
 * 2. Отрисовывает маркеры объявлений на карте
 * @param {*} data данные с сервера в формате json 
 */
const onSuccessHandler = (data) => {
  storeData(data);
  renderIcons(getData());
}

/**
 * Обработчик ошибки загрузки данных с сервера
 * 1. Вызывает показ попапа с сообщением об ошибке загрузки
 */
const onErrorHandler = () => {
  showAlertPopup();
}

/**
 * Функция отрисовки иконок в соответвии с выбранными параметрами фильтрации
 * 1. Вызыввает функцию обработки массива данных в соовтетвии с фильтрами
 * 2. Сохраняет отфильтрованные данные в переменную ads
 * 3. Удаляет имеющиеся на карте маркеры объявлений
 * 4. Создает и добавляет на карту новые иконки на основании данных из массива ads
 */
const updateIcons = _.debounce(() => {
  prepareData(checkData);
  const ads = getData();
  removeIcons();
  renderIcons(ads);
}, RERENDER_DELAY);

/**
 * Обработчик изменений поля селект в фильтре
 * 1. Определеяет значение селекта, на котором сработал обработчик
 * 2. Перерисовывает иконки в соответствии со значением селекта
 * @param  {...any} args 
 */

const handleSelectChange = (...args) => {
  setSelectValue(...args);
  updateIcons();
}

/**
 * Обработчик изменений чекбоксов в фильтре
 * 1. Определеяет значение чекбокса, на котором сработал обработчик
 * 2. Перерисовывает иконки в соответствии с выбраннм чекбоксом
 * @param  {...any} args 
 */

const handleCheckboxChange = (...args) => {
  setFeatureValue(...args);
  updateIcons();
}

/**
 * Обработчик загрузки карты. 
 * 1. Актививрует форму
 * 2. По загрузке данных вызывает обработчик успешной загрузки
 * 3. Иначе вызывает обработчик ошибки загрузки
 */
const handleMapLoaded = () => {
  activateForm(handleSelectChange, handleCheckboxChange);
  loadData(SERVER_GET_URL, onSuccessHandler, onErrorHandler);
}

deactivateForm();
createMap(handleMapLoaded, setMarkerCoordinates);
