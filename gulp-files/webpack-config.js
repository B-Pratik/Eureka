/**
 * Created by Pratik on 6/28/2016.
 *
 * configuration file for webpack.
 */
 var path = require('path');
 var ExtractTextPlugin = require('extract-text-webpack-plugin');
 var webpack = require('webpack');
 var HtmlWebpackPlugin = require('html-webpack-plugin');
 var precss = require('precss');
 var autoprefixer = require('autoprefixer');

 module.exports = {
    entry: {
        app: path.resolve('source', 'src-code/app.js'),
        vendor: [
        'bootstrap/dist/css/bootstrap.min.css',

        'angular',
        'angular-ui-router',
        'angular-loading-bar',
        'angular-animate'
        ]
    },
    output: {
        path: path.resolve('build'),
        filename: 'js/[name]-[hash].js',
        chunkFilename: '[id]-[hash].js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['', '.js'],
        modulesDirectories: [
        'node_modules'
        ],
        root: [
        path.resolve('source', 'src-code'),
        path.resolve('source', 'assets')
        ]
    },
    module: {
        loaders: [
        {
            test: /\.js$/,
            loaders: ['ng-annotate', 'babel?presets[]=es2015'],
            include: path.resolve('source', 'src-code'),
            exclude: /node_modules/
        },
        {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
        },
        {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader')
        },
        {
            test: /\.(svg|woff|woff2|ttf|eot)$/,
            loader: 'base64-font-loader'
        },
        {
            test: /\.(png|jpg|jpeg|gif)$/,
            loader: 'url?name=assets/[name]-[hash].[ext]&limit=100000'
        },
        {
            test: /\.html$/,
            loaders: ['ngtemplate', 'html'],
            include: path.resolve('source', 'src-code'),
            exclude: path.resolve('source', 'src-code/index.html')
        }
        ]
    },
    postcss: function () {
        return [precss, autoprefixer];
    },
    plugins: [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({
        template: path.resolve('source', 'src-code/index.html'),
        inject: 'head'
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'js/vendor-[hash].js'),
    new ExtractTextPlugin('css/[name]-[id]-[contenthash].css')
    ]
};