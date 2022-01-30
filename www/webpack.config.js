const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path');
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

module.exports = {
    entry: "./bootstrap.ts",
    devServer: {
        port: 9000,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    experiments: {
        asyncWebAssembly: true
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bootstrap.js",
    },
    mode: "development",
    plugins: [
        new WasmPackPlugin({
            outDir: path.resolve(__dirname, "..", "pkg"),
            crateDirectory: path.resolve(__dirname, "..")
        }),
        new CopyWebpackPlugin(['index.html'])
    ],
};
