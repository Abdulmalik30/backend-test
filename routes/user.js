const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router
  .get('/', userController.handleUser)
  //gets user information and gets their blogs also
  .get('/blog/:id', userController.getOneBlog)
  //gets a blog by its id
  .post('/blog', userController.handleBlog)
  //posts a blog
  .patch('/blog/:id', userController.updateBlog)
  // edit contents of a blog
  .delete('/blog/:id', userController.deleteBlog);
//deletes a blog
module.exports = router;
