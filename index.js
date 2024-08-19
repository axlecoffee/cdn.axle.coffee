const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const { routes } = require('./config.json');
require('dotenv').config();

const app = express();

const publicDir = path.resolve(__dirname, './public');
app.use(express.static(publicDir));

app.use(cors());
app.use(express.json());

app.get('/ping', async (req, res) => {
	res.send('pong');
});
routes.forEach((method) => {
	fs.readdirSync(path.join(__dirname + '/routes', method)).forEach((file) => {
		let filePath = path.resolve(__dirname + `/routes/${method}/${file}`);
		try {
			require(filePath)(app);
			console.log(`Loaded ${filePath}`);
		} catch (error) {
			console.error(`Error loading ${filePath}:`, error);
		}
	});
});

app.get('*', (req, res) => {
	res.sendFile('404.html', { root: publicDir });
});
let port = process.env.PORT ?? 80;
app.listen(port, () => {
	console.log(`Now using port: ${port} | ENV port: ${process.env.PORT}`);
});
