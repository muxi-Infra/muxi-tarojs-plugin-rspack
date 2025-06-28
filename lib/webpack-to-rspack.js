/**
 * 将 Taro 的 webpack 配置转换为 rspack 兼容的配置
 */

/**
 * 转换 webpack chain 配置为 rspack 配置
 * @param {*} chain webpack-chain 实例
 * @returns {object} rspack 配置对象
 */
function convertWebpackChainToRspack(chain) {
  const webpackConfig = chain.toConfig();
  return convertWebpackToRspack(webpackConfig);
}

/**
 * 转换 webpack 配置为 rspack 配置
 * @param {object} webpackConfig webpack 配置
 * @returns {object} rspack 配置
 */
function convertWebpackToRspack(webpackConfig) {
  const rspackConfig = { ...webpackConfig };

  // 处理 loader 转换
  if (rspackConfig.module?.rules) {
    rspackConfig.module.rules = rspackConfig.module.rules.map(rule => {
      return convertRule(rule);
    });
  }

  // 处理插件转换
  if (rspackConfig.plugins) {
    rspackConfig.plugins = rspackConfig.plugins.map(plugin => {
      return convertPlugin(plugin);
    });
  }

  return rspackConfig;
}

/**
 * 转换单个 rule
 * @param {object} rule webpack rule
 * @returns {object} rspack rule
 */
function convertRule(rule) {
  if (!rule.use) return rule;

  const convertedRule = { ...rule };
  
  if (Array.isArray(rule.use)) {
    convertedRule.use = rule.use.map(useItem => {
      if (typeof useItem === 'string') {
        return convertLoader(useItem);
      }
      if (useItem.loader) {
        return {
          ...useItem,
          loader: convertLoader(useItem.loader)
        };
      }
      return useItem;
    });
  } else if (typeof rule.use === 'string') {
    convertedRule.use = convertLoader(rule.use);
  } else if (rule.use.loader) {
    convertedRule.use = {
      ...rule.use,
      loader: convertLoader(rule.use.loader)
    };
  }

  return convertedRule;
}

/**
 * 转换 loader 名称
 * @param {string} loader loader 名称
 * @returns {string} 转换后的 loader 名称
 */
function convertLoader(loader) {
  const loaderMap = {
    'babel-loader': 'builtin:swc-loader',
    'ts-loader': 'builtin:swc-loader',
    'css-loader': 'builtin:lightningcss-loader',
    'style-loader': 'builtin:lightningcss-loader',
    'mini-css-extract-plugin/loader': 'builtin:lightningcss-loader'
  };

  return loaderMap[loader] || loader;
}

/**
 * 转换插件
 * @param {*} plugin webpack 插件实例
 * @returns {*} rspack 插件实例
 */
function convertPlugin(plugin) {
  // 大部分插件可以直接使用，只需要处理特殊情况
  const pluginName = plugin.constructor.name;
  
  switch (pluginName) {
    case 'HtmlWebpackPlugin':
      // 使用 rspack 的 HtmlRspackPlugin
      const { HtmlRspackPlugin } = require('@rspack/core');
      return new HtmlRspackPlugin(plugin.options);
    
    case 'MiniCssExtractPlugin':
      // rspack 内置 CSS 提取，可能不需要这个插件
      return null;
    
    default:
      return plugin;
  }
}

module.exports = {
  convertWebpackChainToRspack,
  convertWebpackToRspack,
  convertRule,
  convertLoader,
  convertPlugin
}; 