const path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        GraphWidget:'./src/GraphWidget.ts'
    },
    output: {
        filename: "[name].js",
        devtoolLineToLine: true,
        sourceMapFilename: "[file].map",
        path: path.resolve(__dirname, 'dist'),
        // pathinfo: true,  // must be removed at production
        publicPath: "/dist/",

        libraryTarget: "var",
        library: "[name]"
    },
    externals: {
        jquery: 'jQuery'
    },

    devtool: 'source-map',
    // devtool: 'cheap-module-source-map',
    // devtool: 'inline-source-map',
    devtool: 'eval',
    resolve: {
        extensions: [ '.webpack.js', '.web.js', '.ts', '.js']
    },

    module: {
        rules: [
            {
                test: /\.styl$/,
                use: ['style-loader','css-loader','stylus-loader']
            },
            {
                test: /\.ts$/,
                // loader: 'ts-loader',
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: 'tsconfig.json'
                },
                exclude: /node_modules/,
                // options: {
                //     transpileOnly: true
                // }
            }
        ]
    },

    node: {
        fs: 'empty'
    }
};
