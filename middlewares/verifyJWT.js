const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: 'authorization header not found' });

  const token = authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'token not found' });

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'token expired' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'invalid token' });
      }
      // console.log(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = verifyToken;
