const SERVER_GET_URL = 'https://22.javascript.pages.academy/keksobooking/data';
const SERVER_SEND_URL = 'https://22.javascript.pages.academy/keksobooking';

/**
 * Загрузка данных с сервера
 * 1. Получает ответ с сервера
 * 2. В случае успеха преобразует ответ в json
 * 3. Затем вызывает обработчик onSuccess
 *
 * @param {*} serverUrl url сервера, с которого получае данные
 * @param {*} onSuccess обработчик события успешной загрузки данных с сервера
 * @param {*} onError обработчик события ошибки загрузки данных с сервера
 * @returns ответ сервера
 */
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

/**
 * Отправка данных на сервер.
 * 
 * @param {*} serverUrl url сервера, на который отправляем данные
 * @param {*} data — данные из формы
 * @param {*} onSuccess — обработчик успешной отправки
 * @param {*} onError — обработчик ошибки отправки
 */

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
