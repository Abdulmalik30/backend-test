const jwt = require('jsonwebtoken');
const handleRefreshToken = (req, res) => {
  const refreshToken = req.cookies.jwt;
  if (!refreshToken) {
    return res.status(403).json({ message: 'refresh token is required ' });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'invalid refresh token' });
    }

    const username = decoded.username;
    const token = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });

    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173/*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.json({ token });
  });
};

module.exports = { handleRefreshToken };
