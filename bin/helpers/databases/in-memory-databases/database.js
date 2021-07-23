const hash = {};

//  to get the value for a particular index
const get = index => typeof hash[index] !== 'undefined' ? hash[index] : null;

//  add a new value in a particular index
const set = (index, data) => {
  hash[index] = data;
};

//  remove a value from a particular index
const pop = (index, value) => {
  if( typeof hash[index] !== 'undefined'){
    const valueIndex = hash[index].indexOf(value);
    if(valueIndex > -1){
      hash[index].splice(valueIndex, 1);
    }
  }
  return true;
};

//  remove all values stored in a particular index
const remove = index => {
  if( typeof hash[index] !== 'undefined'){
    delete hash[index];
  }
  return true;
};

module.exports = {
  get,
  set,
  pop,
  remove
};
