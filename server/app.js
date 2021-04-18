const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');


// middleware
const auth = require('./middleware/auth');


// routes
const authRoutes = require('./routes/auth');
const feedRoutes = require('./routes/feed');



const app = express();



dotenv.config();


// parse application/json
app.use(express.json());


// register middleware
app.use(auth);



// register routes
app.use(authRoutes);
app.use(feedRoutes);



app.use(express.static(path.join(__dirname,'../public')));




mongoose.connect(process.env.MONGO_DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true})
	.then(result => {

		console.log("Mongoose connected!");

		// app.listen(process.env.PORT, () => {
		// 	console.log(`Server now listening at port ${process.env.PORT}..`);
		// });

		const server = app.listen(process.env.PORT, () => {
			console.log(`Server now listening at port ${process.env.PORT}..`);
		});


		const io = require('./util/socket').init(server);
		io.on('connection', socket => {
			console.log('A user connected!');
		});

	})
	.catch(err => {
		console.log(err);
	})
