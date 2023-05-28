import { transform, has, isEqual, isPlainObject, forOwn, some, includes } from "lodash";

/**
 * Deep diff between two objects - i.e. an object with the new value of new & changed fields.
 * Removed fields will be set as undefined on the result.
 * Only plain objects will be deeply compared (@see _.isPlainObject)
 *
 * Inspired by: https://gist.github.com/Yimiprod/7ee176597fef230d1451#gistcomment-2565071
 * This fork: https://gist.github.com/TeNNoX/5125ab5770ba287012316dd62231b764/
 *
 * @param  {Object} base   Object to compare with (if falsy we return object)
 * @param  {Object} object Object compared
 * @return {Object}        Return a new object who represent the changed & new values
 */
export const deepDiffObj = (base, object) => {
  if (!object) throw new Error(`The object compared should be an object: ${object}`);
  if (!base) return object;
  const result = transform(object, (result, value, key) => {
    if (!has(base, key)) result[key] = value; // fix edge case: not defined to explicitly defined as undefined
    if (!isEqual(value, base[key])) {
      result[key] = isPlainObject(value) && isPlainObject(base[key]) ? this.deepDiffObj(base[key], value) : value;
    }
  });
  // map removed fields to undefined
  forOwn(base, (value, key) => {
    if (!has(object, key)) result[key] = undefined;
  });
  return result;
};

export const includesIn = (arr, search) => {
  if (!Array.isArray(arr)) throw new Error(`Требуется массив: ${arr} `);
  if (!Array.isArray(search)) throw new Error(`Требуется массив: ${search} `);
  return some(arr, (el) => includes(search, el));
};
