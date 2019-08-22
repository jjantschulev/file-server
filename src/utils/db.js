const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * @param {String} query
 * @param {Array} values
 */
module.exports.query = async (query, values) => {
    const result = await pool.query(query, values);
    return result;
};

module.exports.single = async (query, values, errorMsg) => {
    const result = await pool.query(query, values);
    if (result.rowCount !== 1) throw Error(errorMsg || 'Item not found');
    return result.rows[0];
};
