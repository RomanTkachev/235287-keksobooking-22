// eslint-disable-next-line
const LEAFLET = L;
const MAP = LEAFLET.map('map-canvas');
const OPENSTREETMAP_COPYRIGHT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const OPENSTREETMAP_TILE = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

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

const TOKIO_CENTER_COORDINATES = {
  lat: 35.6895,
  lng: 139.69171,
};

const Icons = {
  MAIN: './img/main-pin.svg',
  COMMON: './img/pin.svg',
}

const MAIN_MAP_ICON = LEAFLET.icon({
  iconUrl: Icons.MAIN,
  iconSize: [MAIN_PIN_ICON_SIZES.width, MAIN_PIN_ICON_SIZES.height],
  iconAnchor: [MAIN_PIN_ICON_ANCHOR_SIZES.width, MAIN_PIN_ICON_ANCHOR_SIZES.height],
});

const MAIN_MAP_MARKER = LEAFLET.marker(
  {
    lat: `${TOKIO_CENTER_COORDINATES.lat}`,
    lng: `${TOKIO_CENTER_COORDINATES.lng}`,
  },
  {
    draggable: true,
    icon: MAIN_MAP_ICON,
  },
);

const loadMap = (onLoad, onMainPinMove) => {
  MAP.on('load', onLoad).setView(TOKIO_CENTER_COORDINATES, 10);
  onMainPinMove(TOKIO_CENTER_COORDINATES)
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

const createIcons = (points, onClick) => {
  points.forEach((point, idx) => {
    const icon = LEAFLET.icon({
      iconUrl: Icons.COMMON,
      iconSize: [COMMON_PIN_ICON_SIZES.width, COMMON_PIN_ICON_SIZES.height],
      iconAnchor: [COMMON_PIN_ICON_ANCHOR_SIZES.width, COMMON_PIN_ICON_ANCHOR_SIZES.height],
    });

    const adMarker = LEAFLET.marker(
      point,
      {
        icon: icon,
      },
    );

    adMarker.addTo(MAP);
    adMarker.bindPopup(onClick(idx),
      {
        keepInView: true,
      },
    );
  });
}

const resetMap = () => {
  MAP.panTo(new LEAFLET.LatLng(TOKIO_CENTER_COORDINATES.lat, TOKIO_CENTER_COORDINATES.lng));
  MAIN_MAP_MARKER.setLatLng(LEAFLET.latLng(TOKIO_CENTER_COORDINATES.lat, TOKIO_CENTER_COORDINATES.lng));
}

const createMap = (onLoad, onMainPinMove) => {
  loadMap(onLoad, onMainPinMove);
  loadTile();
  createMainIcon(onMainPinMove);
}

export {createMap, resetMap, createIcons, MAP}
