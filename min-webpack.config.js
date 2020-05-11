const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  };

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserPlugin()
    ]
  }

  return config;
};

const cssLoaders = extra => {
  let loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true
      },
    },
    'css-loader'
  ];

  if (extra) {
    loaders.push(extra);
  }

  return loaders
};

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

module.exports = {
  entry: './src/main.js',
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'public'),
  },
  devServer: {
    port: 4200,
    hot: isDev,
  },
  devtool: isDev ? 'source-map' : '',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  optimization: optimization(),
  plugins: [
    new HTMLPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: isProd
      },
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(
      {
        filename: filename('css'),
      }
    ),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders()
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ["file-loader"]
      },
    ]
  }
};