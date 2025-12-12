const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
   mode: "production",
   output: {
      filename: "main.[contenthash].js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
   },
   plugins: [
      new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
      new HtmlWebpackPlugin({
         template: "./src/template.html",
         minify: {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            removeComments: true,
         },
      }),
   ],
   optimization: {
      minimize: true,
      minimizer: [
         new CssMinimizerPlugin(),
         new TerserPlugin(),
      ],
      splitChunks: {
         chunks: "all",
      },
   },    
   module: {
      rules: [
         {
            test: /\.css$/i,
            use: [
               MiniCssExtractPlugin.loader,     //2. Extract css-made-commonjs into css file
               "css-loader"                     //1. Turns css to commonjs
            ],
         },
      ],
   },
});