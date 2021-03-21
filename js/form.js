import {sendData, SERVER_SEND_URL} from './api.js';
import {showPopupSuccess, showPopupError} from './popup.js';
import {resetMap} from './map.js';

const MAX_PRICE_VALUE = 1000000;
const MAX_ROOMS_COUNT = 100;
const DIGIT_AFTER_POINT = 5
const AD_FORM = document.querySelector('.ad-form');
const BUTTON_RESET = document.querySelector('.ad-form__reset');
const MAP_FILTER = document.querySelector('.map__filters');
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const AVATAR_PREVIEW = document.querySelector('.ad-form-header__preview img');
const PHOTO_PREVIEW_CONTAINER = document.querySelector('.ad-form__photo');
const FORM_PHOTO_TEMPLATE = document.querySelector('#form-photo').content.querySelector('img');

const MIN_PRICES = {
  bungalow: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
}

const FormInputs = {
  TYPE: AD_FORM.querySelector('#type'),
  PRICE: AD_FORM.querySelector('#price'),
  CHECKIN: AD_FORM.querySelector('#timein'),
  CHECKOUT: AD_FORM.querySelector('#timeout'),
  ADRESS: AD_FORM.querySelector('#address'),
  TITLE: AD_FORM.querySelector('#title'),
  ROOM_NUMBER: AD_FORM.querySelector('#room_number'),
  CAPACITY: AD_FORM.querySelector('#capacity'),
  PHOTO_CHOOSER: AD_FORM.querySelector('#images'),
  AVATAR_CHOOSER: AD_FORM.querySelector('#avatar'),
}

const TitleLength = {
  MIN: 30,
  MAX: 100,
}

const formInteractiveElements = AD_FORM.querySelectorAll('input, select');
const filterInteractiveElements = MAP_FILTER.querySelectorAll('input, select');
const formInputCapacityOptions = AD_FORM.querySelectorAll('#capacity option');
const capacityOptionsLastVariant = formInputCapacityOptions[formInputCapacityOptions.length - 1]

const deactivateFilter = () => {
  filterInteractiveElements.forEach((filterElement) => {
    filterElement.disabled = true;
  });

  MAP_FILTER.classList.add('map__filters--disabled')
}

const deactivateForm = () => {
  formInteractiveElements.forEach((formElement) => {
    formElement.disabled = true;
  });
  MAP_FILTER.removeEventListener('change', handleFilterChange);
  handleFilterChange = null;
  AD_FORM.classList.add('ad-form--disabled')
  deactivateFilter();
  removeEventListenersFromForm();
}

const activateFilter = () => {
  filterInteractiveElements.forEach((filterElement) => {
    filterElement.disabled = false;
  });

  MAP_FILTER.classList.remove('map__filters--disabled')
}

const setMarkerCoordinates = (coords) => {
  FormInputs.ADRESS.value = `${coords.lat.toFixed(DIGIT_AFTER_POINT)}, ${coords.lng.toFixed(DIGIT_AFTER_POINT)}`
}

const getHandleFilterChange = (setSelectValue, setCheckboxValue) => (evt) => {
  const field = evt.target;

  if(field.tagName === 'SELECT') {
    setSelectValue(field.id, field.value);

    return;
  }

  if(field.tagName === 'INPUT') {
    setCheckboxValue(field.id, field.checked);

    return;
  }
};

let handleFilterChange;

/**
 * Активация формы
 * 1. Убирает параметр disable c элементов формы и фильтра
 * 2. Добавляет обработчик изменения элеметнов фильтрации
 * 3. Добавляет обработчики событий для элементов формы (для валидациии и отправки)
 * @param {*} setSelectValue — 
 * @param {*} setCheckboxValue 
 */

const activateForm = (setSelectValue, setCheckboxValue) => {
  formInteractiveElements.forEach((formElement) => {
    formElement.disabled = false;
  });

  handleFilterChange = getHandleFilterChange(setSelectValue, setCheckboxValue);
  MAP_FILTER.addEventListener('change', handleFilterChange);

  AD_FORM.classList.remove('ad-form--disabled')
  activateFilter();
  addEventListenersToForm();
}

const setCheckInTime = () => {
  FormInputs.CHECKOUT.value = FormInputs.CHECKIN.value
};

const setCheckOutTime = () => {
  FormInputs.CHECKIN.value = FormInputs.CHECKOUT.value
}

const setMinPrices = () => {
  FormInputs.PRICE.placeholder = MIN_PRICES[FormInputs.TYPE.value];
  FormInputs.PRICE.min = MIN_PRICES[FormInputs.TYPE.value];
}

const validateTitleLength = () => {
  const valueLength = FormInputs.TITLE.value.length;

  if (valueLength < TitleLength.MIN) {
    FormInputs.TITLE.setCustomValidity('Ещё ' + (TitleLength.MIN - valueLength) + ' симв.');
  } else if (valueLength > TitleLength.MAX) {
    FormInputs.TITLE.setCustomValidity('Удалите лишние ' + (valueLength - TitleLength.MAX) +' симв.');
  } else {
    FormInputs.TITLE.setCustomValidity('');
  }

  FormInputs.TITLE.reportValidity();
}

const validateMaxPrice = () => {

  const inputValue = Number(FormInputs.PRICE.value);

  if (inputValue > MAX_PRICE_VALUE) {
    FormInputs.PRICE.setCustomValidity('Максимальная цена за ночь: ' + MAX_PRICE_VALUE)
  } else {
    FormInputs.PRICE.setCustomValidity('');
  }

  FormInputs.PRICE.reportValidity();
}

const validateMinPrice = () => {
  const inputValue = FormInputs.PRICE.value;
  const inputMinValue = Number(FormInputs.PRICE.getAttribute('min'));
  if (inputValue < inputMinValue) {
    FormInputs.PRICE.setCustomValidity('Минимальная цена за ночь: ' +  inputMinValue)
  } else {
    FormInputs.PRICE.setCustomValidity('');
  }

  FormInputs.PRICE.reportValidity();
}

const validateRoomsAndGuests = (evt) => {
  const roomsCount = Number(evt.target.value);
  if (roomsCount === MAX_ROOMS_COUNT) {
    formInputCapacityOptions.forEach((option) => {
      option.disabled = true;
    })

    capacityOptionsLastVariant.disabled = false;
    capacityOptionsLastVariant.selected = true;
  } else {
    formInputCapacityOptions.forEach((option) => {
      option.disabled = false;
    })

    capacityOptionsLastVariant.disabled = true;

    formInputCapacityOptions.forEach((option) => {
      if(roomsCount < option.value) {
        option.disabled = true;
      }
    })

    FormInputs.CAPACITY.value = roomsCount
  }
}

const handleAvatarChange = () => {
  const file = FormInputs.AVATAR_CHOOSER.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((file) => {
    return fileName.endsWith(file);
  });

  if (matches) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      AVATAR_PREVIEW.src = reader.result;
    });

    reader.readAsDataURL(file);
  }
}

const handlePhotoChange = () => {
  const file = FormInputs.PHOTO_CHOOSER.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((file) => {
    return fileName.endsWith(file);
  });

  if (matches) {
    const reader = new FileReader();
    const handleLoadSuccess = () => {
      PHOTO_PREVIEW_CONTAINER.textContent = '';
      const photo = FORM_PHOTO_TEMPLATE.cloneNode(true);
      photo.src = reader.result;
      PHOTO_PREVIEW_CONTAINER.appendChild(photo)
    }

    reader.addEventListener('load', handleLoadSuccess);
    reader.readAsDataURL(file);
  }
}

const handleFormSuccess = () => {
  showPopupSuccess();
  AD_FORM.reset();
  cleanAvatar();
  cleanPhoto();
  resetMap();
}

const addEventListenersToForm = () => {
  FormInputs.CHECKOUT.addEventListener('change', setCheckOutTime);
  FormInputs.CHECKIN.addEventListener('change', setCheckInTime);
  FormInputs.TYPE.addEventListener('change', setMinPrices);
  FormInputs.TITLE.addEventListener('input', validateTitleLength);
  FormInputs.ROOM_NUMBER.addEventListener('change', validateRoomsAndGuests);
  FormInputs.PHOTO_CHOOSER.addEventListener('change', handlePhotoChange);
  FormInputs.AVATAR_CHOOSER.addEventListener('change', handleAvatarChange);

  FormInputs.PRICE.addEventListener('input', () => {
    validateMaxPrice();
    validateMinPrice();
  });

  AD_FORM.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const formData = new FormData(evt.target)

    sendData(
      SERVER_SEND_URL,
      formData,
      handleFormSuccess,
      showPopupError,
    );
  });

  BUTTON_RESET.addEventListener('click', () => {
    AD_FORM.reset();
    resetMap();
  })
}

const removeEventListenersFromForm = () => {
  FormInputs.CHECKOUT.removeEventListener('change', setCheckOutTime);
  FormInputs.CHECKIN.removeEventListener('change', setCheckInTime);
  FormInputs.TYPE.removeEventListener('change', setMinPrices);
  FormInputs.TITLE.removeEventListener('input', validateTitleLength);
  FormInputs.ROOM_NUMBER.removeEventListener('change', validateRoomsAndGuests);
  FormInputs.PHOTO_CHOOSER.removeEventListener('change', handlePhotoChange);
  FormInputs.AVATAR_CHOOSER.removeEventListener('change', handleAvatarChange);

  FormInputs.PRICE.removeEventListener('input', () => {
    validateMaxPrice();
    validateMinPrice();
  });

  AD_FORM.removeEventListener('submit', (evt) => {
    evt.preventDefault();

    const formData = new FormData(evt.target)

    sendData(
      SERVER_SEND_URL,
      formData,
      () => {showPopupSuccess(), AD_FORM.reset(), resetMap()},
      showPopupError,
    );
  });

  BUTTON_RESET.removeEventListener('click', () => {
    AD_FORM.reset();
    resetMap();
  })
}

const cleanAvatar = () => {
  const avatar = AD_FORM.querySelector('.ad-form-header__preview img');
  avatar.src = 'img/muffin-grey.svg';
}

const cleanPhoto = () => {
  const photo = AD_FORM.querySelector('.ad-form__photo img');
  photo.remove();
}

export {
  addEventListenersToForm,
  deactivateForm,
  activateForm,
  FormInputs,
  setMarkerCoordinates
}
