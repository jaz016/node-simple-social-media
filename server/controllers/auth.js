const bcrypt = require('bcryptjs');
const User = require('../models/user');


exports.signUp = async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPass = req.body.confirmPass;


	try {

		if(password !== confirmPass) {
			return res.status(422).json({
				message : 'Passwords doesn\'t match.'
			});
		}


		const foundUser = await User.findOne({ email : email });
		if(foundUser) {
			return res.status(422).json({
				message : 'A user with that e-mail already exists.'
			});
		}

		const hashedPw = await bcrypt.hash(password, 12);
		const user = new User();
		user.email = email;
		user.password = hashedPw;
		const savedUser = await user.save();


		res.status(201).json({
			message : 'User created.',
			userId : savedUser._id
		})


	} catch (err) {
		console.log(err);
	}


}