const {Buffer} = require('buffer');
const Command = require('./resolvers');
const CryptoJS = require('crypto-js');
const alert = require('inpoin-discord');
const apm = require('elastic-apm-node');
const Query = require('../queries/query');
const logger = require('../../../../helpers/utils/logger');
const wrapper = require('../../../../helpers/utils/wrapper');
const config = require('../../../../infra/configs/global_config');
const redisClient = require('../../../../helpers/utils/redisClient');

const { InternalServerError , ConflictError, BadRequestError, ForbiddenError, NotFoundError } = require('../../../../helpers/error');


class Program {

  constructor(config, dbUser){
    this.command = new Command(config);
    this.query = new Query(dbUser);
  }

  async updateOneUser(mobilePhone, currentEmail, newEmail, adminIPAddress, adminUserAgent){
    const ctx='User-updateOneUser';

    try {
      const addUpdateUserLog = await this.query.addUserUpdateLog({mobilePhone, currentEmail, newEmail, adminIPAddress, adminUserAgent});
      const findExistEmailUser = await this.query.findOneUser({email: currentEmail, mobilePhone: mobilePhone});

      if(!findExistEmailUser.err){
        const updateDataUser = await this.query.updateOneUser({mobilePhone: mobilePhone}, {email : newEmail});
        if(!updateDataUser.err){
          const emailVerificationPayload = await this.encryptPayload({email: newEmail});
          const emailVerificationHeaders = await this.getAccessToken();
          const sentEmailVerification = await this.command.sentEmailVerification(emailVerificationPayload, emailVerificationHeaders);
        }
      } else {
        return wrapper.error('Forbidden');
      }

      return wrapper.data('Success update data Users');
    }
    catch (error) {
      apm.captureError(error);
      alert.channel.bugCatcher('errUpdateOneUser',
        error, __filename, global.getFunctionName(), '0');
      logger.log(ctx, error, 'error while updating data Users');
      if (error.code === 400) {
        alert.channel.bugCatcher('errUpdateOneUserBadRequest',
          'Bad Request', __filename, global.getFunctionName(), 400);
        return wrapper.error(new BadRequestError(error.message));
      } else if (error.code === 403) {
        alert.channel.bugCatcher('errUpdateOneUserForbidden',
          'Forbidden', __filename, global.getFunctionName(), 403);
        return wrapper.error(new ForbiddenError(error.message));
      }
      return wrapper.error(new InternalServerError('Internal server error'));

    }
  }

  async getAccessToken() {
    try {
      const username = process.env.USERNAME_AUTH;
      const password = process.env.PASSWORD_AUTH;
      const basicAuth = 'Basic ' + Buffer.from(username + ':' + password, 'binary').toString('base64');//
      const headers = {
        'Authorization': basicAuth
      };

      const generateAccessToken = await this.command.generateAccessToken(headers);
      return {'access-token' : generateAccessToken.data.token, 'Content-Type': 'text/plain'};
    } catch (e) {
      console.error(e);
    }
  }

  async encryptPayload(document){
    try {
      function encrypt (payload, passphrase) {
        let encrypted = CryptoJS.AES.encrypt(JSON.stringify(payload), passphrase, {
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC
        });

        return encrypted.toString();
      }

      const requestBody = await encrypt(document, process.env.ENCRYPT_KEY);
      return requestBody;
    } catch (e) {
      console.error(e);
    }
  }

  async getEditLog(page, size, search){
    try {
      const retrieveDataLogs = await this.query.findManyLogs(page, size, search);
      const retreiveCountDataLogs = await this.query.countDataLogs(search);
      const dataAll = await Promise.all([retrieveDataLogs, retreiveCountDataLogs]);

      const logsData = dataAll[0].data;
      const totalData = dataAll[1].count;

      const totalPage = Math.ceil(totalData / size);
      const totalDataOnPage = logsData;
      const meta = {
        page,
        totalPage,
        totalData,
        totalDataOnPage,
      };
      return wrapper.paginationData(logsData, meta);
    } catch (e){
      alert.channel.bugCatcher('errGetEditLog', e,
        __filename, global.getFunctionName(), '0');
      apm.captureError(e);
    }
  }

}

module.exports = Program;
