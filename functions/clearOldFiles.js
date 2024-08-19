const fs = require('fs');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const unlink = util.promisify(fs.unlink);

async function clearOldFiles(folderPath, filesLifetime) {
	console.log('nuh uh');
}

module.exports = clearOldFiles;
