import {hasKey} from './util.js'

const FeatureTypes = {
  WIFI: 'filter-wifi',
  DISHWASHER: 'filter-dishwasher',
  PARKING: 'filter-parking',
  WASHER: 'filter-washer',
  ELEVATOR: 'filter-elevator',
  CONDITIONER: 'filter-conditioner',
}

const FilterTypes = {
  FEATURES: 'housing-features',
  TYPE: 'housing-type',
  PRICE: 'housing-price',
  ROOMS: 'housing-rooms',
  GUESTS: 'housing-guests',
}

const FieldNames = {
  [FilterTypes.TYPE]: 'type',
  [FilterTypes.PRICE]: 'price',
  [FilterTypes.ROOMS]: 'rooms',
  [FilterTypes.GUESTS]: 'guests',
}

const DEFAULT_FEATURES_VALUES = {
  [FeatureTypes.WIFI]: false,
  [FeatureTypes.DISHWASHER]: false,
  [FeatureTypes.PARKING]: false,
  [FeatureTypes.WASHER]: false,
  [FeatureTypes.ELEVATOR]: false,
  [FeatureTypes.CONDITIONER]: false,
}

const DEFAULT_VALUES = {
  [FilterTypes.TYPE]: '',
  [FilterTypes.PRICE]: '',
  [FilterTypes.ROOMS]: '',
  [FilterTypes.GUESTS]: '',
  [FilterTypes.FEATURES]: null,
}

const LOW_PRICE = 10000;
const HIGH_PRICE = 50000;

const getDefaultValues = () => ({
  ...DEFAULT_VALUES,
  [FilterTypes.FEATURES]: {
    ...DEFAULT_FEATURES_VALUES
  }
})

const currentValues = getDefaultValues();

const setSelectValue = (filterKey, filterValue) => {
  if(hasKey(DEFAULT_VALUES, filterKey) && filterKey !== FilterTypes.FEATURES) {
    currentValues[filterKey] = filterValue;
  } else {
    throw new Error(`Недопустимый ключ ${filterKey}`);
  }
};

const setFeatureValue = (featureKey, featureValue) => {
  if(hasKey(DEFAULT_FEATURES_VALUES, featureKey)) {
    currentValues[FilterTypes.FEATURES][featureKey] = featureValue;
  } else {
    throw new Error(`Недопустимый ключ ${featureKey}`);
  }
}

const checkFeatures = (features) => {
  const featureValues = currentValues[FilterTypes.FEATURES];
  for (let featureKey in featureValues) {
    if(featureValues[featureKey] && !features.includes(featureKey.split('-')[1])) {
      return false;
    }
  }

  return true;
};

const checkHousingPrice = (type, price) => {
  switch (type) {
    case 'any':
      return true;
    case 'low':
      return price < LOW_PRICE;
    case 'middle':
      return price >= LOW_PRICE && price < HIGH_PRICE;
    case 'high':
      return price >= HIGH_PRICE;
    default:
      return false;
  }
}

const checkValue = (key, offerValue) => {
  if(key === FilterTypes.PRICE) {
    return checkHousingPrice(currentValues[key], offerValue);
  }

  return `${offerValue}` === currentValues[key];
}

const checkData = (data) => {
  for (let fieldKey in FieldNames) {
    if(!currentValues[fieldKey] || currentValues[fieldKey] === 'any') {
      continue;
    }

    if(!(currentValues[fieldKey] && checkValue(fieldKey, data.offer[FieldNames[fieldKey]]))) {
      return false;
    }
  }

  return checkFeatures(data.offer.features);
};

export {setSelectValue, setFeatureValue, checkData};
