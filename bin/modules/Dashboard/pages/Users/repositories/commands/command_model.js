const joi = require('joi');

const update = joi.object({
  mobilePhone: joi.string().required(),
  currentEmail: joi.string().email({ tlds: { allow: false } }).required(),
  newEmail: joi.string().email({ tlds: { allow: false } }).required(),
  adminIPAddress: joi.string().ip({
    version: [
      'ipv4'
    ],
  }).required(),
  adminUserAgent: joi.object().required(),
});

const get = joi.object({
  page: joi.number().min(0).max(20).optional(),
  size: joi.number().min(0).max(20).optional(),
  search: joi.string().allow(null, '').optional(),
  mobile_phone: joi.string().optional(),
  email: joi.string().optional(),
  fullname: joi.string().optional(),
  timestamp: joi.string().optional(),
});

module.exports = {
  update,
  get
};
