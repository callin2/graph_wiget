const path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        GraphWidget:'./index.js',
    },
    output: {
        filename: "[name].[version].js",
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/dist/"
    },

    resolve: {
        extensions: [ '.webpack.js', '.web.js', '.ts', '.js']
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    configFileName: 'tsconfig.json'
                },
                exclude: /node_modules/,
            }
        ]
    },

    node: {
        fs: 'empty'
    }


};
