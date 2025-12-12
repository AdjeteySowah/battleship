const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
   mode: "development",
   output: {
      filename: "main.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
   },
   devtool: "eval-source-map",
   devServer: {
      open: true,
      watchFiles: ["./src/template.html"],
   },
   plugins: [
      new HtmlWebpackPlugin({
         template: "./src/template.html",
      }),
   ],
   module: {
      rules: [
         {
            test: /\.css$/i,
            use: [
               "style-loader",            //2. Injects styles into DOM 
               "css-loader"               //1. Turns css to commonjs
            ],
         },
      ],
   },
});