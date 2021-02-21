

export function arrayFromFirebaseObject<T>(object: Object, setKey = false) {
  const array: T[] = [];
  if (object) {
    Object.entries(object).forEach(([key, value]) => {
      if (setKey) {
        value.key = key;
      }
      array.push(value);
    });
  }
  return array;
}