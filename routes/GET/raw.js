const fs = require('fs').promises;
const path = require('path');
const { uploadPath } = require('../../config.json');

module.exports = function (app) {
	async function resolve(req, res, id, file) {
		try {
			res.sendFile(file);
		} catch (err) {
			if (err.code === 'ENOENT') {
				const publicDir = path.resolve(__dirname, '../../public');
				res.sendFile('404_file.html', { root: publicDir });
			} else {
				console.error('Server error', err);
				res.status(500).send('Server error');
			}
		}
	}
	app.get('/raw/:id', async function (req, res) {
		const id = req.params.id;
		const file = path.join(__dirname, '..', '..', uploadPath, id);
		resolve(req, res, id, file);
	});
};
