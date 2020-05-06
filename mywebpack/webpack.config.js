const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack')

const htmlPlugin = new HtmlWebpackPlugin({
  template: './src/index.html' ,//模板
  filename: 'index.html',
})

const miniPlugin = new MiniCssExtractPlugin({
  filename: 'css/main.css',
})
const optPlugin = new OptimizeCSSAssetsPlugin()
const webpackPlugin = new webpack.ProvidePlugin({
  $: 'jquery'
})
module.exports = {
  mode: "development", //模式
  entry: "./src/index.js", //入口
  output: {
    // filename: "bundle.js.[hash:8]", //配置hash  :8只显示8位
    filename: "bundle.js", //打包后的文件名
    path: path.resolve(__dirname, "dist") ,//路径必须是一个绝对路径
    // publicPath:  'http://www.hanke.com'//公共的路径 
  },
  plugins: [   //数组 放着所有webpack的插件
    htmlPlugin,
    miniPlugin,
    optPlugin,
    webpackPlugin
  ],
  module: {   //模块
    rules: [  
      //配置 html读取img的src
      {
        test: /\.html$/,
        use: 'html-withimg-loader'
      },
      //配置 file-loader来读取图片
      {
        test: /\.(png|jpg|gif)$/, 
        //做一个限制  当小于多少k 用base64来转化 base64文件可以减少http请求 但是比原文件大3分之1
        // 否则用file-loader来产生真实的图片
        use: {
          loader: 'url-loader',
          options: {
            limit: 1,
            //输出的路径
            outputPath: 'img/',
            //只在图片中有一个公共的路径
            // publicPath: 'http:/111'
          }
        }
      },
      {
        test: require.resolve('jquery'),
        use: 'expose-loader?$',
        // exclude: /node_modules/
      },
      { 
        test:/\.css$/, use:[
          {
            loader:'style-loader',
            options: {
              //将style标签插入到顶部
              insertAt: 'top',
              // outputPath: 'css/',
            }
          },
          'css-loader',
          'postcss-loader',
        ] 
      },
      { 
        test:/\.less$/, use:[
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader' //less -> css
        ] 
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ],
              plugins: [
                // '@babel/plugin-proposal-class-properties'  解析class
                // 下边解析  @log
                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                ['@babel/plugin-proposal-class-properties', { "loose": true}],
                '@babel/plugin-transform-runtime'
                
              ]
            }
          }
        ],
        //包括
        include: path.resolve(__dirname,'src'),
        //排除
        exclude: /node_modules/
      }
    ]
  }
};
