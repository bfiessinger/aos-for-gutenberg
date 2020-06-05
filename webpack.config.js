const path = require('path');
const glob = require('glob-all');

// Plugins
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [
	// Compile Javascript
	{
		mode: 'production',
		entry: {
			block_editor: './src/block-editor.js',
			aos: './src/aos.js'
		},
		output: {
			path: path.resolve(__dirname, 'dist/js'),
			filename: '[name].js'
		},
		module: {
			rules: [
				{
					test: /\.(jsx?)$/,
					exclude: /node_modules/,
					use: ['babel-loader']
				},
			]
		}
	},
	// Compile CSS
	{
		mode: 'production',
		entry: {
			aos: './src/aos.scss',
		},
		output: {
			path: path.resolve(__dirname, 'dist/css'),
			filename: '[name].bundle.js'
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: '[name].css',
				chunkFilename: '[id].css'
			})
		],
		module: {
			rules: [
				{
					test: /\.(pc|sa|sc|c)ss$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: {
								esModule: false
							}
						},
						'css-loader',
						'sass-loader',
					],
				},
			],
		},
	}
];
