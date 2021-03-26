const pluralize = (count, variants) => {
  const countAbs =  Math.abs(count) % 100;
  const count2 = count % 10;
  if (countAbs > 10 && countAbs < 20) {
    return variants[2];
  }
  if (count2 > 1 && count2 < 5) {
    return variants[1];
  }
  if (count2 === 1) {
    return variants[0];
  }

  return variants[2];
};

/**
 * Проверка на наличие ключа
 * @param {*} obj — объект
 * @param {*} key — ключ
 * @returns true/false 
 */
const hasKey = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

export {
  pluralize,
  hasKey
};
