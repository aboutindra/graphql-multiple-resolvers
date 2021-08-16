
const wrapper = require('../../../helpers/utils/wrapper');
const queryHandler = require('../repositories/queries/query_handler');
const commandModel = require('../repositories/commands/command_model');
const commandHandler = require('../repositories/commands/schema');
const { ERROR:httpError, SUCCESS:http } = require('../../../helpers/http-status/status_code');
const validator = require('../utils/validator');

const getAllUser = async (req,res) => {
  const payload = req.query;
  const validatePayload = validator.isValidPayload(payload, commandModel.get);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return queryHandler.getAllUser(result.data);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Failed Get All User', httpError.NOT_FOUND)
      : wrapper.paginationResponse(res, 'success', result, 'Success Get All User', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const getEditLog = async (req,res) => {
  const payload = req.query;
  const validatePayload = validator.isValidPayload(payload, commandModel.get);
  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.getEditLog(result.data);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Failed Get All User', httpError.NOT_FOUND)
      : wrapper.paginationResponse(res, 'success', result, 'Success Get All User', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

const getCardUser = async (req,res) => {
  const partnerCode = req.header('partnerCode');
  const getData = async () => queryHandler.getAggregateCardUser(partnerCode);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Failed Aggregate Status User', httpError.NOT_FOUND)
      : wrapper.response(res, 'success', result, 'Success Aggregate Status User', http.OK);
  };
  sendResponse(await getData());
};

const getChartUser = async (req,res) => {
  const partnerCode = req.header('partnerCode');
  const {start, end} = req.query;
  const getData = async () => queryHandler.getAggregateChartUser(partnerCode, start, end);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Failed Get Chart User', httpError.NOT_FOUND)
      : wrapper.response(res, 'success', result, 'Success Get Chart User', http.OK);
  };
  sendResponse(await getData());
};
const getChartDailyActiveUser = async (req,res) => {
  const partnerCode = req.header('partnerCode');
  const getData = async () => queryHandler.getAggregateDailyActiveUser(partnerCode);
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Failed Get Chart User', httpError.NOT_FOUND)
      : wrapper.response(res, 'success', result, 'Success Get Chart User', http.OK);
  };
  sendResponse(await getData());
};
const updateUser = async (req,res) => {
  const payload = req.body;
  console.log("\nIni payload : ", payload);
  const validatePayload = validator.isValidPayload(payload, commandModel.update);

  const postRequest = async (result) => {
    if (result.err) {
      return result;
    }
    return commandHandler.updateDataUser(result.data);
  };
  const sendResponse = async (result) => {
    (result.err) ? wrapper.response(res, 'fail', result, 'Failed update Users', httpError.CONFLICT)
      : wrapper.response(res, 'success', result, 'Success update Users', http.OK);
  };
  sendResponse(await postRequest(validatePayload));
};

module.exports = {
  getAllUser,
  getCardUser,
  getChartUser,
  getChartDailyActiveUser,
  updateUser,
  getEditLog
};
