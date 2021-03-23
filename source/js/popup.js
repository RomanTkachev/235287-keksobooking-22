import {pluralize} from './util.js';

const ROOMS_VARIANTS = ['комната', 'комнаты', 'комнат'];
const GUESTS_VARIANTS = ['гостя', 'гостей', 'гостей'];
const POPUP_TEMPLATE = document.querySelector('#card').content.querySelector('.popup');
const POPUP_SUCCESS = document.querySelector('#success').content.querySelector('.success');
const POPUP_ERROR = document.querySelector('#error').content.querySelector('.error');
const POPUP_ERROR_BUTTON = POPUP_ERROR.querySelector('.error__button');
const MAIN = document.querySelector('main');
const ALERT_POPUP = document.querySelector('#data-error').content.querySelector('.data-error__popup');
const ALERT_POPUP_TIME = 5000;
const POPUPS_Z_INDEX = 9999;
const PopupAvatarsSizes = {
  WIDTH: 70,
  HEIGHT: 70,
};

const createPhotosListForPopup = (popupData, template) => {
  const popupPhotos = template.querySelector('.popup__photos');
  const popupPhoto = template.querySelector('.popup__photo');
  const fragment = document.createDocumentFragment();

  const fillPhotos = (photo, i) => {
    const popupPhotoTemplate = popupPhoto.cloneNode(true)

    popupPhotoTemplate.setAttribute('src', popupData.offer.photos[i]);
    fragment.appendChild(popupPhotoTemplate);
  }

  popupPhotos.textContent = '';
  popupData.offer.photos.forEach(fillPhotos)

  return fragment
};

const createFeatureListForPopup = (popupData, template) => {

  const popupFeatures = template.querySelector('.popup__features');
  const popupFeature = template.querySelector('.popup__feature');
  const fragment = document.createDocumentFragment();

  const fillFeatures = (feature, i) => {
    const popupFeatureTemplate = popupFeature.cloneNode(true);

    popupFeatureTemplate.classList.add('popup__feature', `popup__feature--${popupData.offer.features[i]}`);
    fragment.appendChild(popupFeatureTemplate);
  }

  popupFeatures.textContent = '';
  popupData.offer.features.forEach(fillFeatures)

  return fragment
};

const createPopup = (popupData) => {
  const popup = POPUP_TEMPLATE.cloneNode(true);
  const popupPhotos = popup.querySelector('.popup__photos');
  const popupFeatures = popup.querySelector('.popup__features');

  if (popupData.author.avatar) {
    popup.querySelector('.popup__avatar').setAttribute('src', popupData.author.avatar);
    popup.querySelector('.popup__avatar').style.width = PopupAvatarsSizes.WIDTH + 'px';
    popup.querySelector('.popup__avatar').style.height = PopupAvatarsSizes.HEIGHT + 'px';
  }

  if (popupData.offer.title) {
    popup.querySelector('.popup__title').textContent = popupData.offer.title;
  } else {
    popup.querySelector('.popup__title').remove();
  }

  if (popupData.offer.adress) {
    popup.querySelector('.popup__text--address').textContent = popupData.offer.adress;
  } else {
    popup.querySelector('.popup__text--address').remove();
  }

  if (popupData.offer.price) {
    popup.querySelector('.popup__text--price').textContent = `${popupData.offer.price} ₽/ночь`;
  } else {
    popup.querySelector('.popup__text--price').remove();
  }

  if (popupData.offer.type) {
    popup.querySelector('.popup__type').textContent = popupData.offer.type;
  } else {
    popup.querySelector('.popup__type').remove();
  }

  if (popupData.offer.rooms && popupData.offer.guests) {
    popup.querySelector('.popup__text--capacity').textContent = `${popupData.offer.rooms} ${pluralize(popupData.offer.rooms, ROOMS_VARIANTS)} для ${popupData.offer.guests} ${pluralize(popupData.offer.guests, GUESTS_VARIANTS)}`;
  } else {
    popup.querySelector('.popup__text--capacity').remove();
  }

  if (popupData.offer.checkin && popupData.offer.checkout) {
    popup.querySelector('.popup__text--time').textContent = `Заезд после ${popupData.offer.checkin} , выезд до ${popupData.offer.checkout}`;
  } else {
    popup.querySelector('.popup__text--time').remove();
  }

  if (popupData.offer.description) {
    popup.querySelector('.popup__description').textContent = popupData.offer.description;
  } else {
    popup.querySelector('.popup__description').remove();
  }

  if (popupData.offer.photos) {
    popupPhotos.append(createPhotosListForPopup(popupData, popup));
  } else {
    popupPhotos.remove();
  }

  if (popupData.offer.features) {
    popupFeatures.append(createFeatureListForPopup(popupData, popup));
  } else {
    popupFeatures.remove();
  }

  return popup
}

// _____________________________________________________________________________________

const showPopup = (template, button) => {

  const modal = template.cloneNode(true);
  modal.style.zIndex = POPUPS_Z_INDEX;
  MAIN.appendChild(modal);

  const onPopupEscKeydown = (evt) => {
    if (evt.keyCode === 27) {
      evt.preventDefault();
      closePopup();
    }
  };

  const closePopup = () => {
    modal.classList.add('hidden');
    if (button) {
      button.removeEventListener('click', closePopup);
    }
    modal.removeEventListener('click', closePopup);
    document.removeEventListener('keydown', onPopupEscKeydown);
  };

  if (button) {
    button.addEventListener('click', closePopup);
  }

  modal.addEventListener('click', closePopup);
  document.addEventListener('keydown', onPopupEscKeydown);
}

const showAlertPopup = () => {
  const alertContainer = ALERT_POPUP.cloneNode(true);
  document.body.append(alertContainer);
  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_POPUP_TIME);
}

const showPopupSuccess = () => showPopup(POPUP_SUCCESS);
const showPopupError = () => showPopup(POPUP_ERROR, POPUP_ERROR_BUTTON);

export {
  createPopup,
  showPopupSuccess,
  showPopupError,
  ALERT_POPUP_TIME,
  showAlertPopup
}
