import {deactivateForm, activateForm, setMarkerCoordinates} from './form.js';
import {createMap, createIcons} from './map.js';
import {createPopup, showAlertPopup} from './popup.js';
import {getData, SERVER_GET_URL} from './api.js';
import {getFilteredData, onFilterChange} from './filter.js';

const MAX_ADS_COUNT = 10

const adaptPoints = ad => ({
  lat: ad.location.lat,
  lng: ad.location.lng,
})

const icons = [];

const removeIcons = () => {
  icons.forEach((icon) => icon.remove())
}

const renderIcons = (ads) => {
  ads.filter(getFilteredData);
  const points = ads.map(adaptPoints);
  points.slice(0, MAX_ADS_COUNT);

  points.forEach((point) => {
    icons.push(point)
  })

  const pinClickHandler = idx => createPopup(ads[idx]);

  createIcons(points, pinClickHandler);
}

const renderFilteredIcons = (ads) => {
  return () => {
    removeIcons();
    renderIcons(ads);
  }
}

const onSuccessHandler = (ads) => {
  renderIcons(ads);
  onFilterChange(renderFilteredIcons(ads));
}

const onErrorHandler = () => {
  showAlertPopup()
}

deactivateForm();
createMap(activateForm, setMarkerCoordinates);
getData(SERVER_GET_URL, onSuccessHandler, onErrorHandler)();
