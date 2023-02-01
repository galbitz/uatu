const chunkPlugin = require("./craco-chunk-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return {
        ...webpackConfig,
        entry: {
          main: [paths.appIndexJs].filter(Boolean),
          background: paths.appSrc + "/service_worker/background.ts",
          popup: paths.appSrc + "/popup/index.tsx",
        },
        output: {
          ...webpackConfig.output,
          filename: "static/js/[name].js",
        },
        optimization: {
          ...webpackConfig.optimization,
          runtimeChunk: false,
        },
        plugins: [
          ...webpackConfig.plugins.filter((element) => {
            if (!(element instanceof MiniCssExtractPlugin)) return true;
            return false;
          }),
          new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "static/css/[name].css",
            chunkFilename: "static/css/[name].chunk.css",
          }),
          new HtmlWebpackPlugin({
            inject: true,
            chunks: ["popup"],
            template: paths.appHtml,
            filename: "popup.html",
          }),
        ],
      };
    },
  },
  plugins: [
    {
      plugin: chunkPlugin,
      options: {},
    },
  ],
};
