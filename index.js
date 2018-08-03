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
const { execSync } = require('child_process');

async function connectAndCloneRepo() {
	const CLONE_DIR = './clone';
	const CLONE_REPO = `https://${settings.user}:${settings.password}@${settings.repo}`;

	if (!fs.existsSync(CLONE_DIR)) {
		console.log("No clone directory. Creating one.");
		fs.mkdirSync(CLONE_DIR);
	} else {
		console.log("Clone directory already exists. Cleaning.");
		rimraf.sync(CLONE_DIR);
		fs.mkdirSync(CLONE_DIR);
	}

	console.log("Cloning repository...");
	await git().silent(true)
		.clone(CLONE_REPO, './clone')
		.then(() => console.log("Clone complete."))
		.catch((err) => console.log("Clone failed: ", err));

}

function loadSnack() {
	const snack = require(`./snacks/${settings.snack}`);
	console.log("Loaded snack:", snack.name);
	
	console.log("Running snack pre-build script.");
	scriptResult = execSync(snack.prebuild, {stdio:[0,1,2]})
	
	console.log("Running build script now.");
	buildResult = execSync(snack.build, {stdio:[0,1,2], cwd:'./clone/'})

}

connectAndCloneRepo().then(loadSnack);
