const joi = require('joi');
const validate = require('validate.js');
const wrapper = require('../../../helpers/utils/wrapper');
const { BadRequestError } = require('../../../helpers/error');

const isValidPayload = (payload, constraint) => {
  const { value, error } = joi.validate(payload, constraint);
  if(!validate.isEmpty(error) || !payload){
    return wrapper.error(new BadRequestError(), error.details);
  }
  return wrapper.data(value);

};

module.exports = {
  isValidPayload
};
