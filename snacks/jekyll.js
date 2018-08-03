module.exports = {
	name: 'jekyll',
	prebuild: 'apt-get install jekyll -y',
	build: 'jekyll build'
}
