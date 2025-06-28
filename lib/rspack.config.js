const path = require('path');

/**
 * 获取小程序专用的 Rspack 配置
 * @param {object} webpackConfig 现有的 webpack 配置
 * @param {object} options 插件选项
 * @param {string} platform 目标平台
 * @returns {object} 优化后的配置
 */
function getRspackConfig(webpackConfig, options = {}, platform = 'weapp') {
  const isProduction = process.env.NODE_ENV === 'production';
  const projectRoot = process.cwd();

  // 小程序专用的构建优化配置
  const weappOptimizations = {
    // SWC 编译优化
    swcOptions: {
      jsc: {
        target: 'es5', // 小程序需要 ES5 兼容
        parser: {
          syntax: 'typescript',
          tsx: true,
          decorators: true,
          dynamicImport: false // 小程序不支持动态导入
        },
        transform: {
          react: {
            runtime: 'automatic',
            importSource: '@tarojs/taro'
          }
        },
        externalHelpers: false,
        keepClassNames: true,
        preserveAllComments: false
      },
      env: {
        targets: {
          // 针对小程序环境的目标配置
          ios: '9',
          android: '5'
        },
        mode: 'entry',
        coreJs: '3'
      }
    },

    // CSS 优化配置
    cssOptions: {
      targets: {
        ios_saf: '9.0',
        android: '5.0'
      },
      minify: isProduction,
      drafts: {
        nesting: true
      }
    },

    // 小程序代码分割策略
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      maxAsyncRequests: 20,
      maxInitialRequests: 20,
      cacheGroups: {
        default: false,
        vendors: false,
        // 公共组件
        common: {
          minChunks: 2,
          priority: 1,
          name: 'common',
          reuseExistingChunk: true
        },
        // 第三方库
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: 10,
          chunks: 'all',
          enforce: true
        },
        // Taro 相关
        taro: {
          test: /[\\/]node_modules[\\/]@tarojs[\\/]/,
          name: 'taro',
          priority: 15,
          chunks: 'all',
          enforce: true
        },
        // 运行时代码
        runtime: {
          test: /[\\/]node_modules[\\/]@tarojs[\\/]runtime/,
          name: 'runtime',
          priority: 20,
          chunks: 'all',
          enforce: true
        }
      }
    },

    // 小程序环境变量
    defineConstants: {
      'process.env.TARO_ENV': JSON.stringify('weapp'),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.PLATFORM': JSON.stringify('weapp'),
      '__DEV__': JSON.stringify(!isProduction),
      '__WEAPP__': JSON.stringify(true),
      '__H5__': JSON.stringify(false)
    },

    // 模块解析优化
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      alias: {
        // 小程序专用别名
        '@tarojs/components$': '@tarojs/components/dist-weapp/index.js',
        '@tarojs/taro$': '@tarojs/taro',
        '@tarojs/runtime$': '@tarojs/runtime/dist/runtime.esm.js'
      },
      // 优先查找小程序版本
      mainFields: ['weapp', 'browser', 'module', 'main'],
      conditionNames: ['weapp', 'import', 'require']
    }
  };

  const config = {
    // 保持原有配置，但应用小程序优化
    ...webpackConfig,
    
    // 覆盖关键配置
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'cheap-source-map', // 小程序调试用
    
    resolve: {
      ...webpackConfig.resolve,
      ...weappOptimizations.resolve
    },

    optimization: {
      ...webpackConfig.optimization,
      minimize: isProduction,
      splitChunks: weappOptimizations.splitChunks,
      // 小程序不需要运行时 chunk
      runtimeChunk: false
    }
  };

  // 返回小程序优化配置供主插件使用
  return {
    config,
    weappOptimizations,
    isProduction,
    projectRoot
  };
}

module.exports = {
  getRspackConfig
}; 