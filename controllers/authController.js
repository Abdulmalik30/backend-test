const { User } = require('../model/usersSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!password || !email) {
    return res
      .status(400)
      .json({ message: 'username, password and email are required' });
  }

  const foundUser = await User.findOne({ email });
  if (!foundUser)
    return res.status(401).json({ message: 'invalid email or password' });
  const username = foundUser.username;
  const valid = await bcrypt.compare(password, foundUser.password);

  if (!valid)
    return res.status(401).json({ message: 'invalid email or password' });

  const token = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign(
    { username },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  );
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ token });
};
module.exports = { handleLogin };
