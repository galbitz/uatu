const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  overrideWebpackConfig: ({
    webpackConfig,
    cracoConfig,
    pluginOptions,
    context: { env, paths },
  }) => {
    const webpackPlugin = webpackConfig.plugins.find(
      (plugin) => plugin instanceof HtmlWebpackPlugin
    );
    if (webpackConfig) {
      // Only allows the main entrypoint to be injected into the index.html
      const userOptions = {
        ...webpackPlugin.userOptions,
        chunks: ["main"],
      };
      webpackPlugin.userOptions = userOptions;
    }
    return webpackConfig;
  },
};
