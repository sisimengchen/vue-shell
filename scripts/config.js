'use strict';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const version = process.env.VERSION || require('../package.json').version;

const env = process.env.NODE_ENV || 'development';
const target = process.env.TARGET || 'spa';

const resolve = (p = '') => path.resolve(__dirname, '../', p);

const extractStyle = new ExtractTextPlugin({
  filename: 'index.css',
  allChunks: true
});

// const getLessRule = () => {
//   const loaders = [
//     {
//       loader: 'css-loader',
//       options: {
//         sourceMap: env !== 'development'
//       }
//     },
//     {
//       loader: 'postcss-loader',
//       options: {
//         ident: 'postcss',
//         plugins: () => [require('postcss-cssnext')()],
//         sourceMap: env !== 'development'
//       }
//     },
//     {
//       loader: 'less-loader',
//       options: {
//         sourceMap: env !== 'development'
//       }
//     }
//   ];
//   let use;
//   if (env === 'development') {
//     use = [
//       {
//         loader: 'style-loader'
//       }
//     ].concat(loaders);
//   } else {
//     use = extractStyle.extract({
//       fallback: 'style-loader',
//       use: loaders
//     });
//   }
//   return {
//     test: /\.less$/,
//     use: use
//   };
// };

const getScssRule = () => {
  const loaders = [
    {
      loader: 'css-loader',
      options: {
        sourceMap: env !== 'development'
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: () => [require('postcss-cssnext')()],
        sourceMap: env !== 'development'
      }
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: env !== 'development'
      }
    }
  ];
  let use;
  if (env === 'development') {
    use = [
      {
        loader: 'style-loader'
      }
    ].concat(loaders);
  } else {
    use = extractStyle.extract({
      fallback: 'style-loader',
      use: loaders
    });
  }
  return {
    test: /\.scss$/,
    use: use
  };
};

const getCssRule = () => {
  const loaders = [
    {
      loader: 'css-loader',
      options: {
        sourceMap: env !== 'development'
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: () => [require('postcss-cssnext')()],
        sourceMap: env !== 'development'
      }
    }
  ];
  let use;
  if (env === 'development') {
    use = [
      {
        loader: 'style-loader'
      }
    ].concat(loaders);
  } else {
    use = extractStyle.extract({
      fallback: 'style-loader',
      use: loaders
    });
  }
  return {
    test: /\.css$/,
    use: use
  };
};

const getRules = () => {
  const useEslint = false;
  const rules = [
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        cacheDirectory: resolve('cache')
      },
      include: [resolve('src')]
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: resolve('cache')
      },
      include: [resolve('src')]
    },
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'img/[name].[ext]'
      }
    },
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'media/[name].[ext]'
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'fonts/[name].[ext]'
      }
    },
    getScssRule(),
    // getLessRule(),
    getCssRule()
  ];
  if (useEslint) {
    rules.unshift({
      test: /\.js$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      include: [resolve('src')]
    });
  }
  return rules;
};

const getPlugin = () => {
  const plugins = [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env.VERSION': JSON.stringify(version),
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.TARGET': JSON.stringify(target)
    }), // 全局变量替换
    new webpack.NoEmitOnErrorsPlugin(), // 编译错误时跳过输出阶段
    new HtmlWebpackPlugin({
      filename: target === 'githubpages' ? resolve('docs/index.html') : resolve('dist/index.html'),
      template: resolve('index.html'),
      loading: {
        html: fs.readFileSync(resolve('src/assets/html/loading.html')),
        css: `<style>${fs.readFileSync(resolve('src/assets/css/loading.css'))}</style>`
      },
      inject: true,
      minify:
        env === 'development'
          ? false
          : {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
          },
      chunksSortMode: env === 'development' ? 'auto' : 'dependency'
    }) // 通过模板创建html
  ];
  if (env === 'development') {
    return plugins.concat([
      new webpack.HotModuleReplacementPlugin(), // 模块热替换插件
      new webpack.NamedModulesPlugin() // 当开启 HMR 的时候使用该插件会显示模块的相对路径
    ]);
  } else {
    return plugins.concat([
      extractStyle,
      new OptimizeCSSPlugin({
        cssProcessorOptions: { safe: true, map: { inline: false } }
      }),
      // new webpack.HashedModuleIdsPlugin(),
      new webpack.optimize.ModuleConcatenationPlugin(), // 作用域提升优化
      new webpack.optimize.SplitChunksPlugin({
        chunks: 'all',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        name: true
      }) // 代码拆分优化
    ]);
  }
};

function getConfig() {
  const config = {
    context: resolve(),
    entry: resolve('src/main.js'),
    output: {
      filename: 'index.js',
      path: target === 'githubpages' ? resolve('docs') : resolve('dist'),
      publicPath: env === 'development' ? '/' : './'
    },
    resolve: {
      extensions: ['.js', '.vue'],
      alias: {
        '@utils': resolve('src/utils/index.js'),
        '@components': resolve('src/components/'),
        '@layouts': resolve('src/layouts/'),
        '@pages': resolve('src/pages/'),
        '@store': resolve('src/redux/store'),
        '@actions': resolve('src/redux/actions'),
        '@history': resolve('src/history.js'),
        '@services': resolve('src/services/')
      }
    },
    module: {
      rules: getRules()
    },
    plugins: getPlugin(),
    devtool: env === 'development' ? 'eval-source-map' : '#source-map',
    devServer:
      env === 'development'
        ? {
          before: (app) => {
            require('../mock')(app);
          },
          clientLogLevel: 'warning',
          historyApiFallback: true,
          hot: true,
          compress: true,
          host: 'localhost',
          port: 8080,
          open: false,
          overlay: { warnings: false, errors: true },
          publicPath: '/',
          proxy: {},
          quiet: true,
          watchOptions: {
            poll: false
          }
        }
        : {}
  };

  return config;
}
const config = getConfig();
// console.log(config);
module.exports = config;
