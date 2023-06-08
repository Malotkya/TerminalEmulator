const path = require('path');

module.exports = {
    mode: "development",
    entry: path.join(__dirname, "src", "index.ts"),
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: { 
        filename: 'index.js',
        path: path.join(__dirname, "public")
    },
}