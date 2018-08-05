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
const { exec } = require('child_process');
const ftp = require('ftp-client');

const CLONE_DIR = './clone'

async function connectAndCloneRepo() {
	const CLONE_REPO = `https://${settings.git_user}:${settings.git_password}@${settings.git_repo}`;

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
		.clone(CLONE_REPO, CLONE_DIR)
		.then(() => console.log("Clone complete."))
		.catch((err) => console.log("Clone failed: ", err));

}

async function loadSnack() {
	const snack = require(`./snacks/${settings.snack}`);
	console.log("Loaded snack:", snack.name);
	
	console.log("Running snack pre-build script.");
	const prebuild = exec(snack.prebuild, {stdio:[0,1,2]})
	
	console.log("Running build script now.");
	const build =  exec(snack.build, {stdio:[0,1,2], cwd: CLONE_DIR})

	const result = [await prebuild, await build]
}

async function connectFtp() {
	const ftpConfig = {
		host: settings.ftp_host,
		port: 21,
		user: settings.ftp_user,
		password: settings.ftp_password
	};
	const options = {
		logging: 'basic'
	};
	
	client = new ftp(ftpConfig, options);

	client.connect(function() {
		client.upload([`${CLONE_DIR}/${settings.build_dir}/**`], settings.ftp_destination_dir, {
			overwrite: 'older',
			baseDir: `${CLONE_DIR}/${settings.build_dir}`
		}, function(result) {
			console.log(result);
		});
	});
	
}

connectAndCloneRepo().then(loadSnack).then(connectFtp);
