const create = require('../create');

module.exports = {
  getStatus: create(async (req, res) => {
    res.json({ status: 'Running' });
  }),
};
