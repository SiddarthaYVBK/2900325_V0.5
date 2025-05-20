// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Update babel-loader to correctly process ES modules
      const babelLoader = webpackConfig.module.rules
        .find(rule => rule.oneOf)
        .oneOf.find(
          rule => rule.loader && rule.loader.includes('babel-loader')
        );
      
      if (babelLoader) {
        babelLoader.options.sourceType = 'module';
      }

      return webpackConfig;
    }
  }
};