const User = require('../models/user');
const Post = require('../models/post');



exports.createPost = async (req, res, next) => {
	const post = req.body.post;


	if(!req.isAuth) {
		return res.status(401).json({
			status : 401,
			message : 'You are not authorized to do this action.'
		});
	}


	const newPost = new Post({
		content : post,
		postedBy : req.userId
	});

	const savedPost = await newPost.save();


	const user = await User.findById(req.userId);
	if(!user) {
		return res.status(401).json({
			status : 401,
			message : 'User not found!'
		});
	}

	user.posts.push(savedPost._id)
	user.save();


	res.status(201).json({
		status : 201,
		message : 'Post created successfully!',
		post : {
			...savedPost._doc, 
			_id : savedPost._id.toString(), 
			createdAt : savedPost.createdAt.toISOString(), 
			updatedAt : savedPost.updatedAt.toISOString() 
		}
	})


};