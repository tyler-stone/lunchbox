# LunchBox

A building-block script for deploying static files via FTP.

## Installation

`npm install`

## Configuration

This script consumes two configuration files, a `config.json` and a snack configuration. Snacks are simply the build types. Currently only Jekyll is supported, but it should be easy to create new snacks using the sample format provided by the Jeykll snack.

Your `config.json` should contain information about the repository you wish to clone, the snack you wish to use, the FTP connection information, and the build directory:

```
{
	'git_user': '',
	'git_password': '',
	'git_repo': '',
	'snack': 'jekyll',
	'build_dir': '_site',
	'ftp_host': '',
	'ftp_user': '',
	'ftp_password': '',
	'ftp_destination_dir': ''
}
```

## Run

`npm start`
