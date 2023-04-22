const { User, Blog } = require('../model/usersSchema');
const handleUser = async (req, res) => {
  const { username } = req.user;

  const foundUser = await User.findOne({ username }).populate('blogs');
  if (!foundUser)
    return res
      .status(401)
      .json({ message: 'user does not exist please sign up' });

  res.json({
    username: foundUser.username,
    blogs: foundUser.blogs,
  });
};

const handleBlog = async (req, res) => {
  const { username } = req.user;
  const { title, body } = req.body;

  if (!title || !body)
    return res
      .status(400)
      .json({ message: 'title and body are required to add blog' });
  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser)
      return res
        .status(401)
        .json({ message: 'user does not exist please sign up' });

    const blog = new Blog({
      title: title,
      body: body,
      author: foundUser._id,
    });
    await blog.save();
    await foundUser.blogs.push(blog);
    await foundUser.save();
  } catch (error) {
    console.log(error);
  }
  res.status(201).json({ message: 'new blog created' });
};

const getOneBlog = async (req, res) => {
  const { username } = req.user;

  try {
    const blog = await Blog.findById(req.params.id).populate({
      path: 'author',
      match: { username: username },
      select: '-email -password -blogs -author._id',
    });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateBlog = async (req, res) => {
  // const { username } = req.user;
  const { id } = req.params;
  const { title, body } = req.body;

  try {
    const blog = await Blog.findByIdAndUpdate(
      id,
      { title, body },
      { new: true }
    );
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteBlog = async (req, res) => {
  // const { username } = req.user;
  const { id } = req.params;

  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
module.exports = {
  handleUser,
  handleBlog,
  getOneBlog,
  updateBlog,
  deleteBlog,
};
