const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

const app = express();
dotenv.config();



app.get('/', (req, res) => {
	res.send("Hello world~");
});


app.use(express.static(path.join(__dirname,'../public')));


app.listen(process.env.PORT, () => {
	console.log(`Server now listening at port ${process.env.PORT}..`);
});