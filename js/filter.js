import {MAP_FILTER} from './form.js'

const LOW_PRICE = 10000;
const HIGH_PRICE = 50000;

const filterHouseType = (ads) => {
  const houseType = MAP_FILTER.querySelector('#housing-type').value;
  return 'any' === houseType || ads.offer.type === houseType;
};

const filterFeatures = (ads) => {
  const features = [...MAP_FILTER.querySelectorAll('.map__features input:checked')].map((feature) => feature.value);
  return !features.length || features.every((feature) => ads.offer.features.includes(feature));
};

const filterPrice = (ads) => {
  const price = MAP_FILTER.querySelector('#housing-price').value
  switch (price) {
    case 'any':
      return true;
    case 'low':
      return ads.offer.price < LOW_PRICE;
    case 'middle':
      return ads.offer.price >= LOW_PRICE && ads.offer.price < HIGH_PRICE;
    case 'high':
      return ads.offer.price >= HIGH_PRICE;
    default:
      return false;
  }
};

const filterRooms = (ads) => {
  const rooms = MAP_FILTER.querySelector('#housing-rooms').value;
  return 'any' === rooms || ads.offer.rooms === Number(rooms);
}

const filterGuests = (ads) => {
  const guests = MAP_FILTER.querySelector('#housing-guests').value;
  return 'any' === guests || ads.offer.guests === Number(guests);
}

const getFilteredData = (ads) => {
  return (
    filterHouseType(ads) &&
    filterPrice(ads)) &&
    filterFeatures(ads) &&
    filterGuests(ads) &&
    filterRooms(ads)
};

const onFilterChange = (cb) => MAP_FILTER.addEventListener('change', cb);

export {getFilteredData, onFilterChange}
