require('dotenv').config();
const { webhook_avatar, webhook_username } = require('../config.json');

async function dumpWebhookFunction(message) {
	try {
		await fetch(process.env.DISCORD_WEBOOK, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				avatar_url: webhook_avatar,
				username: webhook_username,
				content: message,
			}),
		});
	} catch (error) {
		console.error('Error sending or deleting message:', error);
	}
}

module.exports = dumpWebhookFunction;
