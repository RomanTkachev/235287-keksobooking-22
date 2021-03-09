// eslint-disable-next-line
const MAP = L.map('map-canvas');
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
// eslint-disable-next-line
const MAIN_MAP_ICON = L.icon({
  iconUrl: Icons.MAIN,
  iconSize: [MAIN_PIN_ICON_SIZES.width, MAIN_PIN_ICON_SIZES.height],
  iconAnchor: [MAIN_PIN_ICON_ANCHOR_SIZES.width, MAIN_PIN_ICON_ANCHOR_SIZES.height],
});
// eslint-disable-next-line
const MAIN_MAP_MARKER = L.marker(
  {
    lat: `${TOKIO_CENTER_COORDINATES.lat}`,
    lng: `${TOKIO_CENTER_COORDINATES.lng}`,
  },
  {
    draggable: true,
    icon: MAIN_MAP_ICON,
  },
);

// formInputAdress.value = `${TOKIO_CENTER_COORDINATES.lat}, ${TOKIO_CENTER_COORDINATES.lng}`;

const loadMap = (onLoad, onMainPinMove) => {
  MAP.on('load', onLoad).setView(TOKIO_CENTER_COORDINATES, 10);
  onMainPinMove(TOKIO_CENTER_COORDINATES)
};

const loadTile = () => {
  // eslint-disable-next-line
  L.tileLayer (
    OPENSTREETMAP_TILE,
    {
      attribution: OPENSTREETMAP_COPYRIGHT,
    },
  ).addTo(MAP);
};



const createMainIcon = (onMainPinMove) => {
  const mainMarker = MAIN_MAP_MARKER
  const mainPinMoveHandler = (evt) => {
    onMainPinMove(evt.target.getLatLng()) //полученные координаты передаем в обработчик изменения координат
  }

  mainMarker.on('move', mainPinMoveHandler); //навершиваем обработчик движения главного маркера
  mainMarker.addTo(MAP);
};



const createIcons = (points, onClick) => {
  points.forEach((point, idx) => {
    // eslint-disable-next-line
    const icon = L.icon({
      iconUrl: Icons.COMMON,
      iconSize: [COMMON_PIN_ICON_SIZES.width, COMMON_PIN_ICON_SIZES.height],
      iconAnchor: [COMMON_PIN_ICON_ANCHOR_SIZES.width, COMMON_PIN_ICON_ANCHOR_SIZES.height],
    });
    // eslint-disable-next-line
    const adMarker = L.marker(
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

const createMap = (points, onLoad, onMainPinMove, onPinClick) => {
  loadMap(onLoad, onMainPinMove);
  loadTile();
  createMainIcon(onMainPinMove);
  createIcons(points, onPinClick);
}

export {createMap}
