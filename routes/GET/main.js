const fs = require('fs').promises;
const path = require('path');
const {
	uploadPath,
	og_site_name,
	og_title,
	og_embed_color,
	og_description,
} = require('../../config.json');

require('dotenv').config();

module.exports = async function (app) {
	async function resolve(req, res, id, file) {
		try {
			await fs.stat(file);

			const extension = path.extname(file);

			if (
				(req.headers['user-agent'] &&
					req.headers['user-agent'].includes('Discordbot')) ||
				req.headers['user-agent'].includes('WhatsApp')
			) {
				let metaTag;
				if (extension === '.mp4') {
					metaTag = `
          <meta property="og:video" content="https://${process.env.DOMAIN}/raw/${id}" />
          <meta property="og:video:url" content="https://${process.env.DOMAIN}/raw/${id}" />
          <meta property="og:video:secure_url" content="https://${process.env.DOMAIN}/raw/${id}" />
          <meta property="og:video:type" content="video/mp4" />
          <meta property="twitter:card" content="player" />
          <meta property="twitter:player" content="https://${process.env.DOMAIN}/raw/${id}" />
        `;
				} else {
					metaTag = `
          <meta property="og:image" content="https://${process.env.DOMAIN}/raw/${id}" />
          <meta property="og:image:secure_url" content="https://${process.env.DOMAIN}/raw/${id}" />
          <meta property="og:url" content="https://${process.env.DOMAIN}/raw/${id}" />
          <meta property="twitter:card" content="summary_large_image">
        `;
					if (req.headers['user-agent'].includes('WhatsApp')) {
						metaTag =
							+`<meta property="og:image:width" content="300">
          <meta property="og:image:height" content="300">
          <meta property="og:image:type" content="image/png">
          <link itemprop="thumbnailUrl" href="https://${process.env.DOMAIN}/raw/${id}"> <span itemprop="thumbnail" itemscope itemtype="http://schema.org/ImageObject"> <link itemprop="url" href="https://${process.env.DOMAIN}/discord/${id}"> </span>`;
					}
				}
				res.send(`
        <!doctype html>
        <html prefix="og: http://ogp.me/ns#">
        <head>
			<meta name="theme-color" content="${og_embed_color}">
            <meta property="og:site_name" content="${og_site_name}">
            <meta property="og:title" content="${og_title}" />
			<meta property="og:description" content="${og_description}" />
            ${metaTag}
        </head>
        <body>
        </body>
        </html>
      `);
			} else {
				res.sendFile(file);
			}
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
	app.get('/images/:id', async function (req, res) {
		const id = req.params.id;
		const file = path.join(__dirname, '..', '..', uploadPath, id);
		resolve(req, res, id, file);
		console.log(id, file, 'eee');
	});
};
