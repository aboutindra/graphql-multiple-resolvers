const validate = require('validate.js');
const mongoConnection = require('./connection');
const wrapper = require('../../utils/wrapper');
const logger = require('../../utils/logger');
const { NotFoundError, InternalServerError } = require('../../error');
const apm = require('elastic-apm-node');

class DB {
  constructor(config) {
    this.config = config;
  }

  setCollection(collectionName) {
    this.collectionName = collectionName;
  }

  async getDatabase() {
    const config = this.config.replace('//', '');
    /* eslint no-useless-escape: "error" */
    const pattern = new RegExp('/([a-zA-Z0-9-]+)?');
    const dbName = pattern.exec(config);
    return dbName[1];
  }

  async findOne(parameter) {
    const ctx = 'mongodb-findOne';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.findOne(parameter);
      if (validate.isEmpty(recordset)) {
        return wrapper.error(new NotFoundError('Data Not Found Please Try Another Input'));
      }
      return wrapper.data(recordset);

    } catch (err) {
      apm.captureError(err);
      logger.log(ctx, err.message, 'Error find data in mongodb');
      return wrapper.error(new InternalServerError(`Error Find One Mongo ${err.message}`));
    }

  }

  async findMany(parameter, projection = {}) {
    const ctx = 'mongodb-findMany';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.find(parameter).project(projection).toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error(new NotFoundError('Data Not Found , Please Try Another Input'));
      }
      return wrapper.data(recordset);

    } catch (err) {
      apm.captureError(err);
      logger.log(ctx, err.message, 'Error find data in mongodb');
      return wrapper.error(new InternalServerError(`Error Find Many Mongo ${err.message}`));
    }

  }

  async insertOne(document) {
    const ctx = 'mongodb-insertOne';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.insertOne(document);
      if (recordset.result.n !== 1) {
        return wrapper.error(new InternalServerError('Failed Inserting Data to Database'));
      }
      return wrapper.data(recordset);

    } catch (err) {
      apm.captureError(err);
      logger.log(ctx, err.message, 'Error insert data in mongodb');
      return wrapper.error(new InternalServerError(`Error Insert One Mongo ${err.message}`));
    }

  }

  async insertMany(data) {
    const ctx = 'mongodb-insertMany';
    const document = data;
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.insertMany(document);
      if (recordset.result.n < 1) {
        return wrapper.error(new InternalServerError('Failed Inserting Data to Database'));
      }
      return wrapper.data(document);

    } catch (err) {
      apm.captureError(err);
      logger.log(ctx, err.message, 'Error insert data in mongodb');
      return wrapper.error(new InternalServerError(`Error Insert Many Mongo ${err.message}`));
    }

  }

  // nModified : 0 => data created
  // nModified : 1 => data updated
  async upsertOne(parameter, updateQuery) {
    const ctx = 'mongodb-upsertOne';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const data = await db.findOneAndUpdate(parameter, updateQuery, { upsert: true, returnOriginal: false });
      if (validate.isEmpty(data)) {
        return wrapper.error(new NotFoundError('Document not found'));
      }
      return wrapper.data(data);

    } catch (err) {
      apm.captureError(err);
      logger.log(ctx, err.message, 'Error upsert data in mongodb');
      return wrapper.error(new InternalServerError(`Error Upsert Mongo ${err.message}`));
    }
  }

  async findAllData(fieldName, directionSort, row, page, param, projection = {}, sortParameter) {
    const ctx = 'mongodb-findAllData';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const parameterSort = {};
      for(let i = 0 ; i < fieldName.length; i++){
        parameterSort[fieldName[i]] = directionSort[i];
      }
      const parameterPage = row * (page - 1);
      const recordset = await db.find(param).sort(sortParameter).project(projection).limit(row).skip(parameterPage).toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error(new NotFoundError('Data Not Found, Please Try Another Input'));
      }
      return wrapper.data(recordset);
    } catch (err) {
      apm.captureError(err);
      logger.log(ctx, err.message, 'Error upsert data in mongodb');
      return wrapper.error(new InternalServerError(`Error Mongo ${err.message}`));
    }
  }

  async aggregate(parameter){
    const ctx = 'mongodb-aggregateData';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.aggregate(parameter).toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error(new NotFoundError('Data Not Found, Please Try Another Input'));
      }
      return wrapper.data(recordset);

    } catch (err) {
      apm.captureError(err);
      logger.log(ctx, err.message, 'Error aggregate data in mongodb');
      return wrapper.error(new InternalServerError(`Error aggregate Data in Mongo: ${err.message}`));
    }

  }

  async aggregatePage(fieldName, direction, row, page, param, sortParameter) {
    const ctx = 'mongodb-aggregatePage';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }

    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const parameterSort = {};
      for(let i = 0 ; i < fieldName.length; i++){
        parameterSort[fieldName[i]] = direction[i];
      }
      const parameterPage = row * (page - 1);
      param.push({
        $sort:parameterSort
      });
      param.push({
        $limit:row + parameterPage
      });
      param.push({
        $skip:parameterPage
      });
      const recordset = await db.aggregate(param).toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error(new NotFoundError('Data Not Found, Please Try Another Input'));
      }
      return wrapper.data(recordset);

    } catch (err) {
      apm.captureError(err);
      logger.log(ctx, err.message, 'Error aggregate data in mongodb');
      return wrapper.error(new InternalServerError(`Error Mongo ${err.message}`));
    }
  }

  async countData(param) {
    const ctx = 'mongodb-countData';
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.countDocuments(param);
      if (validate.isEmpty(recordset)) {
        return wrapper.error(new NotFoundError('Data Not Found , Please Try Another Input'));
      }
      return wrapper.data(recordset);

    } catch (err) {
      apm.captureError(err);
      logger.log(ctx, err.message, 'Error count data in mongodb');
      return wrapper.error(new InternalServerError(`Error Mongo ${err.message}`));
    }
  }

  async removeOne(data) {
    const ctx = 'mongodb-insertMany';
    const document = data;
    const dbName = await this.getDatabase();
    const result = await mongoConnection.getConnection(this.config);
    if (result.err) {
      logger.log(ctx, result.err.message, 'Error mongodb connection');
      return result;
    }
    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.deleteOne(document);
      if (recordset.result.n < 1) {
        return wrapper.error(new NotFoundError('Data Not Found, Please Try Another Input'));
      }
      return wrapper.data(document);

    } catch (err) {
      apm.captureError(err);
      logger.log(ctx, err.message, 'Error delete data in mongodb');
      return wrapper.error(new InternalServerError(`Error delete Many Mongo ${err.message}`));
    }
  }

}

module.exports = DB;
