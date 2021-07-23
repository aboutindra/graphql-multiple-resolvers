const getLastFromURL = async (url) => {
  let name = decodeURI(url).split('/').pop();
  name = name.replace(/(\r\n|\n|\r)/gm, '');
  return String(name);
};

const validDateInMonth= (date) => {
  const regex = /(19|20)\d{2}[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])/;
  if (regex.test(date)) {
    return true;
  }
  return false;

};

module.exports = {
  getLastFromURL,
  validDateInMonth,
};
