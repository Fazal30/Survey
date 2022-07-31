module.exports = (item, keys) => {
  if (item) {
    const newDoc = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const key of keys) {
      if (item[key] !== undefined) newDoc[key] = item[key];
    }
    return newDoc;
  }
  return null;
};
