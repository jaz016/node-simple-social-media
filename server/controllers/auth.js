const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.signUp = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPass = req.body.confirmPass;


	try {

		if(password !== confirmPass) {
			return res.status(422).json({
				status : 422,
				message : 'Passwords doesn\'t match.'
			});
		}


		const foundUser = await User.findOne({ email : email });
		if(foundUser) {
			return res.status(422).json({
				status : 422,
				message : 'A user with that e-mail already exists.'
			});
		}

		const hashedPw = await bcrypt.hash(password, 12);
		const user = new User();
		user.email = email;
		user.password = hashedPw;
		const savedUser = await user.save();


		res.status(201).json({
			status : 201,
			message : 'User created. You can now log in.',
			userId : savedUser._id
		})


	} catch (err) {
		console.log(err);
	}


};




exports.login = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;



	try	{

	
		const user = await User.findOne({email : email});
		if(!user) {
			return res.status(401).json({
				status : 401,
				message : 'Incorrect email or password'
			});
		}


		const passwordMatch = await bcrypt.compare(password, user.password);

		if(!passwordMatch) {
			return res.status(401).json({
				status : 401,
				message : 'Incorrect email or password'
			});
		}


		const token = jwt.sign({
			userId : user._id.toString(),
			email : user.email
		}, process.env.JWT_SECRET,
		{
			expiresIn : '1h'
		});


		res.status(200).json({
			status : 200,
			message : 'Login successful!',
			userId : user._id.toString(),
			token : token
		});


	} catch (err) {
		console.log(err);
	}
};