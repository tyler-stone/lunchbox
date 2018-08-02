/* *** LUNCHBOX ***
 * It's peanut butter jelly time
 *
 * A script to copy static files over
 * FTP from a git repository
 *
 * Copyright Tyler Stone 2018
 */

const settings = require('./config.json');
const git =  require('simple-git/promise');
const fs = require('fs');
const rimraf = require('rimraf');

const CLONE_DIR = './clone';
const CLONE_REPO = `https://${settings.user}:${settings.password}@${settings.repo}`;

if (!fs.existsSync(CLONE_DIR)) {
	fs.mkdirSync(CLONE_DIR);
} else {
	rimraf.sync(CLONE_DIR);
	fs.mkdirSync(CLONE_DIR);
}

git().silent(true)
	.clone(CLONE_REPO, './clone')
	.then(() => console.log("DONE"))
	.catch((err) => console.log("FAILED: ", err));
