var path = require("path");

var webpack = require("webpack");
var PrettierPlugin = require("prettier-webpack-plugin");

module.exports = {

    entry: "./src/js/app.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "/dist"
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {   loader: 'babel-loader',
                        options: {
                            presets: ["es2015"]
                    }
                }
            ]
        },
        {
                test: /\.css$/,
                use: ['style-loader' ,'css-loader'],
            }
        ]
    },

    plugins: [
       new PrettierPlugin({
        "arrowParens": "always",
        "bracketSpacing": true,
        "printWidth": 100,
        "semi": true,
        "tabWidth": 4,
        "singleQuote": false
       })
    ]

};