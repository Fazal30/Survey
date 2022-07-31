const { User } = require('../../../models');
const create = require('../../create');

module.exports = {
  profile: create(async (req, res) => {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: User.getProfileFields(),
    });
    return res.json({ user });
  }),
};
