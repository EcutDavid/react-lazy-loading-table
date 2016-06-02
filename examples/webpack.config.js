module.exports = {
  devtool: 'inline-source-map',

  entry: './examples/app',

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },

  resolve: {
    alias: {
      'demo': '../src/index'
    }
  }
};
