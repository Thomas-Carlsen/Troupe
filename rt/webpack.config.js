
module.exports = {
  entry: './built/troupe.js',
  output: {
      filename: "./bundle.js",
  },

  mode: 'development',

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },

  module: {
      rules: [
          { 
            test: /\.tsx?$/, 
            loader: "awesome-typescript-loader",
            exclude: /node_modules/
          },
          { 
            test: /\.js$/, 
            enforce: "pre",
            loader: "source-map-loader" }

      ]
  }

  // Other options...
};