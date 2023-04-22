const { User } = require('../model/usersSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleRegister = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: 'username, password and email are required' });
  }

  const duplicate = await User.findOne({ email }).exec();

  if (duplicate) {
    return res
      .status(409)
      .json({ message: 'user already exists please login instead' });
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign(
    { username },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  );

  try {
    const result = await User.create({
      username: username,
      password: hashedPwd,
      email: email,
    });
    console.log(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken });
};

module.exports = { handleRegister };
