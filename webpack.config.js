var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
	devtool : 'source-map',
	entry : {
		a : './src/jsx/a.jsx',
		//b : './src/jsx/b.jsx'
	},
	output : {
		filename : '[name].js',
		path : './public/js'
	},
	module : {
		loaders : [{
			test : /\.jsx?$/,
			include : path.resolve(__dirname, "src/jsx"),
			loader : 'babel'
		},{
			test : /\.less$/,
			include : path.resolve(__dirname, "src/less"),
			loader : ExtractTextPlugin.extract('css!less')
		}]
	},
	plugins : [
		new ExtractTextPlugin("../css/[name].css")
	]
}