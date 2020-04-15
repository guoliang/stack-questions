// const { TsConfigPathsPlugin } = require("awesome-typescript-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Path = require("path");
const Webpack = require("webpack");

module.exports = {
	entry: {
		app: "./src/app.ts"
	},
	output: {
		path: Path.resolve(__dirname, "dist"),
		filename: "[name].js"
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx"],
	},
	optimization: {
		splitChunks: {
			chunks: "all",
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/](angular|jquery)/,
					name(module) {
						// get the name. E.g. node_modules/packageName/not/this/part.js
						// or node_modules/packageName
						const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

						// npm package names are URL-safe, but some servers don't like @ symbols
						return `${packageName.replace("@", "")}`;
					}
				}
			}
		}
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
			}, {
				test: /\.less$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader, // creates style nodes from JS strings
					}, {
						loader: 'css-loader', // translates CSS into CommonJS
					}, {
						loader: 'less-loader', // compiles Less to CSS
					},
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css",
			ignoreOrder: false,
		}),

		new HtmlWebpackPlugin({
			filename: Path.resolve(__dirname, "dist/index.html"),

			chunks: [
				`jquery.js`,
				`angular.js`,
				`app.js`,
			],
			chunksSortMode: "manual",

			hash: true,
			inject: false,
			template: Path.join(__dirname, "/src/index.template"),
		})
	],
};

