const express = require('express');
const router = express.Router();


// controllers
const feedController = require('../controllers/feed');


router.get('/posts', feedController.getPosts);
router.post('/create-post', feedController.createPost);



module.exports = router;