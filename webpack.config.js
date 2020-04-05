const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    watch: true,
    devtool: 'source-map',
    entry: './public/js/index.js',
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.resolve(__dirname, 'public/static/dist'),
        publicPath: '/',
    },
    resolve: {
        alias: {
            Eventum: path.resolve(__dirname, 'public/js/'),
            Settings: path.resolve(__dirname, 'public/settings/'),
            Blocks: path.resolve(__dirname, 'public/blocks/'),
            Components: path.resolve(__dirname, 'public/components/'),
            Static: path.resolve(__dirname, 'public/static/'),
        },
        enforceExtension: false,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(handlebars|hbs)$/,
                loader: 'handlebars-loader'
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-private-methods', '@babel/plugin-proposal-class-properties'],
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                },
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ]
    },
};