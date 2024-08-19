var multer = require('multer');
var crypto = require('crypto');
const path = require('path');
const authorization = require('../../middleware/authorization.js');
const dumpWebhook = require('../../functions/dumpWebhook.js');
const { uploadPath } = require('../../config.json');
require('dotenv').config();
const pathowo = path.join(__dirname, '..', '..', uploadPath);
var storage = multer.diskStorage({
	destination: pathowo,
	filename: function (req, file, cb) {
		crypto.randomBytes(4, function (err, raw) {
			if (err) return cb(err);

			cb(null, raw.toString('hex') + path.extname(file.originalname));
		});
	},
});

var upload = multer({
	storage: storage,
	limits: { fileSize: 2 * 1024 * 1024 * 1024 },
	fileFilter: function (req, file, cb) {
		cb(null, true);
	},
});

module.exports = function (app) {
	app.post(
		'/',
		upload.single('file'),
		authorization,
		function (req, res, next) {
			var response = `https://${process.env.DOMAIN}/images/${req.file.filename}`;
			res.send(response);
			dumpWebhook(
				`-# IMAGE URL: <https://${process.env.DOMAIN}/images/${req.file.filename}>\n-# RAW URL: https://${process.env.DOMAIN}/raw/${req.file.filename}`
			);
		}
	);
};
