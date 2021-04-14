const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');


// routes
const authRoutes = require('./routes/auth');



const app = express();
dotenv.config();


// parse application/json
app.use(express.json());


// register routes
app.use(authRoutes);



app.use(express.static(path.join(__dirname,'../public')));


mongoose.connect(process.env.MONGO_DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true})
	.then(result => {

		console.log("Mongoose connected!");

		app.listen(process.env.PORT, () => {
			console.log(`Server now listening at port ${process.env.PORT}..`);
		});
	})
	.catch(err => {
		console.log(err);
	})
