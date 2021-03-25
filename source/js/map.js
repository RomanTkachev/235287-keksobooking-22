// eslint-disable-next-line
const LEAFLET = L;
const MAP = LEAFLET.map('map-canvas');
const OPENSTREETMAP_COPYRIGHT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const OPENSTREETMAP_TILE = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const MAP_SCALE = 10;

const MAIN_PIN_ICON_SIZES = {
  width: 50,
  height: 50,
};

const MAIN_PIN_ICON_ANCHOR_SIZES = {
  width: 25,
  height: 50,
};

const COMMON_PIN_ICON_SIZES = {
  width: 40,
  height: 40,
};

const COMMON_PIN_ICON_ANCHOR_SIZES = {
  width: 20,
  height: 40,
};

const DEFAULT_CENTER_COORDINATES = {
  lat: 35.6895,
  lng: 139.69171,
};

const Icons = {
  MAIN: './img/main-pin.svg',
  COMMON: './img/pin.svg',
}

const AD_PIN_ICON = {
  iconUrl: Icons.COMMON,
  iconSize: [COMMON_PIN_ICON_SIZES.width, COMMON_PIN_ICON_SIZES.height],
  iconAnchor: [COMMON_PIN_ICON_ANCHOR_SIZES.width, COMMON_PIN_ICON_ANCHOR_SIZES.height],
}

const AD_PIN_PARAMS = {
  keepInView: true,
}

const MAIN_MAP_ICON = LEAFLET.icon({
  iconUrl: Icons.MAIN,
  iconSize: [MAIN_PIN_ICON_SIZES.width, MAIN_PIN_ICON_SIZES.height],
  iconAnchor: [MAIN_PIN_ICON_ANCHOR_SIZES.width, MAIN_PIN_ICON_ANCHOR_SIZES.height],
});

const MAIN_MAP_MARKER = LEAFLET.marker(
  {...DEFAULT_CENTER_COORDINATES},
  {
    draggable: true,
    icon: MAIN_MAP_ICON,
  },
);

const loadMap = (onLoad, onMainPinMove) => {
  MAP.on('load', onLoad).setView(DEFAULT_CENTER_COORDINATES, MAP_SCALE);
  onMainPinMove(DEFAULT_CENTER_COORDINATES)
};

const loadTile = () => {
  LEAFLET.tileLayer (
    OPENSTREETMAP_TILE,
    {
      attribution: OPENSTREETMAP_COPYRIGHT,
    },
  ).addTo(MAP);
};

//Создание главного маркера

const createMainIcon = (onMainPinMove) => {
  const mainMarker = MAIN_MAP_MARKER
  const mainPinMoveHandler = (evt) => {
    onMainPinMove(evt.target.getLatLng()) //полученные координаты передаем в обработчик изменения координат
  }

  mainMarker.on('move', mainPinMoveHandler); //навершиваем обработчик движения главного маркера
  mainMarker.addTo(MAP);
};

//Создание маркеров объявлений

let icons = [];

/**
 * Создает маркеры объявлений и добавляет их на карту. По каждому объекту координат:
 * 1. Создает иконку карты
 * 2. Создает маркер, 
 * 3. Добавляет созданный маркер в массив icons (нужно для последующего удаления иконок)
 * 4. Добавляет отрисовку попапа по клику
 * 5. Добавляет маркер на карту
 * 
 * @param {*} points массив с объектами координат объявлений
 * @param {*} onClick обработчик события клика по маркеру объявления
 */

const createIcons = (points, onClick) => {
  points.forEach((point, idx) => {
    const icon = LEAFLET.icon(AD_PIN_ICON);
    const adMarker = LEAFLET.marker(point, { icon });

    icons.push(adMarker);
    adMarker.bindPopup(onClick(idx), AD_PIN_PARAMS);
    adMarker.addTo(MAP);
  });
}

const resetMap = (setMarkerCoordinates) => {
  const coords = new LEAFLET.LatLng(DEFAULT_CENTER_COORDINATES.lat, DEFAULT_CENTER_COORDINATES.lng)
  MAP.panTo(coords);
  MAIN_MAP_MARKER.setLatLng(coords);
  setMarkerCoordinates(DEFAULT_CENTER_COORDINATES);
}
/**
 * Создание карты
 * 1. Загрузка карты
 * 2. Отрисовка слоя с картой и добавление на карту
 * 3. Создние главного маркера
 * @param {*} onLoad - обработчик успешной загрузки карты
 * @param {*} onMainPinMove - обработчик движения главного маркера
 */
const createMap = (onLoad, onMainPinMove) => {
  loadMap(onLoad, onMainPinMove);
  loadTile();
  createMainIcon(onMainPinMove);
}

const removeIcons = () => {
  icons.forEach((icon) => MAP.removeLayer(icon))
  icons = [];
}

export {createMap, resetMap, createIcons, removeIcons, DEFAULT_CENTER_COORDINATES}
