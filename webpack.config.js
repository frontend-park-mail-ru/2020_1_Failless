const path = require('path');

module.exports = {
    mode: 'development',
    entry: './public/js/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/static/dist'),
    },
    module: {
        rules: [
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