const User = require('../models/user');
const Post = require('../models/post');
const io = require('../util/socket');




exports.getPosts = async (req, res, next) => {


	try {

		const posts = await Post.find().sort({createdAt : -1}).populate('postedBy');
		res.status(200).json({
			status : 200,
			message : 'Posts fetched successfully!',
			posts : posts
		});

	} catch (err) {
		console.log(err);
	}

	

};



exports.createPost = async (req, res, next) => {
	const post = req.body.post;


	if(!req.isAuth) {
		return res.status(401).json({
			status : 401,
			message : 'You are not authorized to do this action.'
		});
	}



	try	{


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
		const savedUser = await user.save();


		io.getIO().emit('new post', { 

				email : savedUser.email,
				content : savedPost.content,
				createdAt : savedPost.createdAt.toISOString()

		});
	
	
		res.status(201).json({
			status : 201,
			message : 'Post created successfully!',
			post : {
				...savedPost._doc, 
				_id : savedPost._id.toString(), 
				createdAt : savedPost.createdAt.toISOString(), 
				updatedAt : savedPost.updatedAt.toISOString() 
			}
		});


	} catch (err) {

		console.log(err);

	}


	


};