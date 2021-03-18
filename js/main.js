import {deactivateForm, activateForm, setMarkerCoordinates} from './form.js';
import {createMap, createIcons, removeIcons} from './map.js';
import {createPopup, showAlertPopup} from './popup.js';
import {loadData, SERVER_GET_URL} from './api.js';
import {setSelectValue, setFeatureValue, checkData} from './filters.js';
import {storeData, getData, prepareData} from './data.js';

const MAX_ADS_COUNT = 10

const adaptPoints = ad => ({
  lat: ad.location.lat,
  lng: ad.location.lng,
})

const renderIcons = (ads) => {
  const points = ads.map(adaptPoints);
  const pinClickHandler = idx => createPopup(ads[idx]);

  createIcons(points, pinClickHandler);
}

const onSuccessHandler = (data) => {
  storeData(data);
  renderIcons(getData());
}

const onErrorHandler = (error) => {
  console.error(error)
  showAlertPopup();
}

const updateIcons = () => {
  prepareData(checkData);
  const ads = getData();
  removeIcons();
  renderIcons(ads);
}

const handleSelectChange = (...args) => {
  setSelectValue(...args);
  updateIcons();
}

const handleCheckboxChange = (...args) => {
  setFeatureValue(...args);
  updateIcons();
}

const handleMapLoaded = () => {
  activateForm(handleSelectChange, handleCheckboxChange);
  loadData(SERVER_GET_URL, onSuccessHandler, onErrorHandler);
}

deactivateForm();
createMap(handleMapLoaded, setMarkerCoordinates);
