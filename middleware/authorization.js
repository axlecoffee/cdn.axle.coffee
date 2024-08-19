require('dotenv').config();
const path = require('path');
let valid_token = process.env.TOKEN;
/*
 * People ask how I do my auth - I say if/else
 * They all wonder how I can be so cool.
 */
const authMiddleware = (req, res, next) => {
	const token = req.headers.api_key;
	if (token === valid_token) {
		next();
	} else {
		const publicDir = path.resolve(__dirname, '../public');
		res.sendFile('403.html', { root: publicDir }); // I just realized no one gonna see this lmfaoooo
	}
};

module.exports = authMiddleware;
