/**
 * Database Utility Functions and Helpers
 */

const { Op } = require('sequelize');
const logger = require('./logger');
const { DatabaseError, NotFoundError } = require('./errors');

/**
 * Database transaction wrapper
 */
const withTransaction = async (sequelize, callback) => {
  const transaction = await sequelize.transaction();
  
  try {
    const result = await callback(transaction);
    await transaction.commit();
    logger.database('TRANSACTION_COMMIT', 'successful');
    return result;
  } catch (error) {
    await transaction.rollback();
    logger.error('Transaction failed, rolled back', error);
    throw new DatabaseError('Database transaction failed', error);
  }
};

/**
 * Safe find by ID with better error handling
 */
const findByIdOrFail = async (model, id, options = {}) => {
  try {
    const record = await model.findByPk(id, options);
    
    if (!record) {
      throw new NotFoundError(`${model.name} with ID ${id}`);
    }
    
    logger.database('FIND_BY_ID', model.tableName, { id, found: true });
    return record;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error(`Failed to find ${model.name} by ID`, error);
    throw new DatabaseError(`Failed to retrieve ${model.name}`, error);
  }
};

/**
 * Safe create with validation
 */
const safeCreate = async (model, data, options = {}) => {
  try {
    const record = await model.create(data, options);
    logger.database('CREATE', model.tableName, { id: record.id });
    return record;
  } catch (error) {
    logger.error(`Failed to create ${model.name}`, error);
    
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      throw new ValidationError('Validation failed', validationErrors);
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new ConflictError('Record already exists');
    }
    
    throw new DatabaseError(`Failed to create ${model.name}`, error);
  }
};

/**
 * Safe update with existence check
 */
const safeUpdate = async (model, id, data, options = {}) => {
  try {
    const [updatedRowsCount, updatedRows] = await model.update(data, {
      where: { id },
      returning: true,
      ...options
    });
    
    if (updatedRowsCount === 0) {
      throw new NotFoundError(`${model.name} with ID ${id}`);
    }
    
    logger.database('UPDATE', model.tableName, { id, updatedRows: updatedRowsCount });
    return updatedRows[0];
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error(`Failed to update ${model.name}`, error);
    throw new DatabaseError(`Failed to update ${model.name}`, error);
  }
};

/**
 * Safe delete with existence check
 */
const safeDelete = async (model, id, options = {}) => {
  try {
    const deletedRowsCount = await model.destroy({
      where: { id },
      ...options
    });
    
    if (deletedRowsCount === 0) {
      throw new NotFoundError(`${model.name} with ID ${id}`);
    }
    
    logger.database('DELETE', model.tableName, { id, deletedRows: deletedRowsCount });
    return deletedRowsCount;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error(`Failed to delete ${model.name}`, error);
    throw new DatabaseError(`Failed to delete ${model.name}`, error);
  }
};

/**
 * Paginated query helper
 */
const paginate = async (model, options = {}) => {
  const {
    page = 1,
    limit = 10,
    where = {},
    include = [],
    order = [['createdAt', 'DESC']],
    ...otherOptions
  } = options;

  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await model.findAndCountAll({
      where,
      include,
      order,
      limit: parseInt(limit),
      offset: parseInt(offset),
      ...otherOptions
    });

    const totalPages = Math.ceil(count / limit);
    
    logger.database('PAGINATE', model.tableName, {
      page,
      limit,
      total: count,
      totalPages
    });

    return {
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    logger.error(`Failed to paginate ${model.name}`, error);
    throw new DatabaseError(`Failed to retrieve paginated ${model.name}`, error);
  }
};

/**
 * Search helper with multiple fields
 */
const search = async (model, searchTerm, searchFields = [], options = {}) => {
  const whereConditions = searchFields.map(field => ({
    [field]: {
      [Op.iLike]: `%${searchTerm}%`
    }
  }));

  const searchOptions = {
    where: {
      [Op.or]: whereConditions
    },
    ...options
  };

  try {
    const results = await model.findAll(searchOptions);
    
    logger.database('SEARCH', model.tableName, {
      searchTerm,
      searchFields,
      resultsCount: results.length
    });
    
    return results;
  } catch (error) {
    logger.error(`Failed to search ${model.name}`, error);
    throw new DatabaseError(`Failed to search ${model.name}`, error);
  }
};

/**
 * Bulk operations helper
 */
const bulkOperations = {
  async bulkCreate(model, data, options = {}) {
    try {
      const records = await model.bulkCreate(data, {
        returning: true,
        ...options
      });
      
      logger.database('BULK_CREATE', model.tableName, { count: records.length });
      return records;
    } catch (error) {
      logger.error(`Failed to bulk create ${model.name}`, error);
      throw new DatabaseError(`Failed to bulk create ${model.name}`, error);
    }
  },

  async bulkUpdate(model, data, where, options = {}) {
    try {
      const [updatedRowsCount] = await model.update(data, {
        where,
        ...options
      });
      
      logger.database('BULK_UPDATE', model.tableName, { updatedRows: updatedRowsCount });
      return updatedRowsCount;
    } catch (error) {
      logger.error(`Failed to bulk update ${model.name}`, error);
      throw new DatabaseError(`Failed to bulk update ${model.name}`, error);
    }
  },

  async bulkDelete(model, where, options = {}) {
    try {
      const deletedRowsCount = await model.destroy({
        where,
        ...options
      });
      
      logger.database('BULK_DELETE', model.tableName, { deletedRows: deletedRowsCount });
      return deletedRowsCount;
    } catch (error) {
      logger.error(`Failed to bulk delete ${model.name}`, error);
      throw new DatabaseError(`Failed to bulk delete ${model.name}`, error);
    }
  }
};

/**
 * Health check for database
 */
const healthCheck = async (sequelize) => {
  try {
    await sequelize.authenticate();
    // SQLite uses datetime('now') instead of NOW()
    const query = await sequelize.query("SELECT datetime('now') as current_time");
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        serverTime: query[0][0].current_time
      }
    };
  } catch (error) {
    logger.error('Database health check failed', error);
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: error.message
      }
    };
  }
};

module.exports = {
  withTransaction,
  findByIdOrFail,
  safeCreate,
  safeUpdate,
  safeDelete,
  paginate,
  search,
  bulkOperations,
  healthCheck
};
