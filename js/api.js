const SERVER_GET_URL = 'https://22.javascript.pages.academy/keksobooking/data';
const SERVER_SEND_URL = 'https://22.javascript.pages.academy/keksobooking';

const loadData = (serverUrl, onSuccess, onError) => {
  return fetch(serverUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`${response.status} ${response.statusText}`);
      }
    })
    .then((data) => {
      onSuccess(data);
    })
    .catch(onError);
}

const sendData = (serverUrl, data, onSuccess, onError) => {
  fetch(serverUrl,
    {
      method: 'POST',
      body: data,
    })
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onError();
      }
    })
    .catch(onError);
}

export {loadData, sendData, SERVER_GET_URL, SERVER_SEND_URL}
