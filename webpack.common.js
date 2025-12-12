const path = require("path");

module.exports = {
   entry: "./src/index.js",
   cache: {
      type: "filesystem",
      buildDependencies: {
        config: [__filename],
      },
   },
   module: {
      rules: [
         {
            test: /\.html$/i,
            loader: "html-loader",
         },
         {
            test: /\.(png|svg|jpg)$/i,
            type: "asset/resource",
            generator: {
               filename: "assets/images/[name].[contenthash][ext]",
            },
         },
         {
            test: /\.(woff|woff2)$/i,
            type: 'asset/resource',
            generator: {
               filename: "assets/fonts/[name].[contenthash][ext]",
            },
         },
      ],
   },
};
