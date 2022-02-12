var sha512 = require('js-sha512');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!(token == sha512('c4u-mtl'))) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};


