var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
	devtool : 'source-map',
	entry : {
		word : './src/jsx/word.js',
		base : './src/jsx/base.js',
		study : './src/jsx/study.js',
		read : './src/jsx/read.js'
	},
	output : {
		filename : '[name].js',
		path : './public/js'
	},
	module : {
		loaders : [{
			test : /\.js$/,
			include : path.resolve(__dirname, "src/jsx"),
			loader : 'babel'
		},{
			test : /\.less$/,
			include : path.resolve(__dirname, "src/less"),
			loader : ExtractTextPlugin.extract('css!less')
		}]
	},
	watch : true,
	plugins : [
		new ExtractTextPlugin("../css/[name].css")
	]
}