// 这是一个 Taro 项目中使用 tarojs-plugin-rspack 进行小程序构建优化的示例配置

const config = {
  projectName: 'myWeappApp',
  date: '2024-1-1',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  framework: 'react',
  compiler: 'webpack', // 保持 webpack，插件会自动应用 Rspack 优化
  plugins: [
    // 使用 rspack 插件进行小程序构建优化
    ['tarojs-plugin-rspack', {
      // 插件配置选项
      // 注意：小程序构建不需要 devServer 配置
      
      // 是否启用构建分析
      analyze: false,
      
      // 是否启用压缩优化
      compress: true,
      
      // 自定义优化选项
      optimization: {
        // 是否启用代码分割优化
        splitChunks: true,
        
        // 是否启用 Tree Shaking
        treeShaking: true,
        
        // 是否启用 SWC 编译优化
        useSwc: true
      }
    }]
  ],
  defineConstants: {
    // 小程序专用常量
    __WEAPP__: true,
    __H5__: false
  },
  copy: {
    patterns: [],
    options: {}
  },
  // 小程序配置 - 专门优化
  mini: {
    // 小程序包体积优化
    optimizeMainPackage: {
      enable: true,
      exclude: [
        'components/**/*'
      ]
    },
    
    // 分包配置
    subpackages: [
      {
        root: 'pages/subpage1',
        pages: ['index']
      }
    ],
    
    // 小程序构建配置
    commonChunks: ['runtime', 'vendors', 'taro', 'common'],
    
    // 添加到通用 chunk 中的包
    addChunkPages: function(pages, commonChunks) {
      // 将一些通用页面加入到 common chunk
      if (commonChunks.includes('common')) {
        pages.set('pages/index/index', 'common');
      }
    },
    
    // PostCSS 配置
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: [/^\.noPx/, /^\.ignore/]
        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 1KB
        }
      },
      cssModules: {
        enable: false
      }
    },
    
    // 小程序专用的 webpack 配置会被插件自动优化为 Rspack 配置
    webpackChain: function(chain) {
      // 这些配置会被 rspack 插件自动优化
      
      // 添加小程序专用的 loader
      chain.module
        .rule('wxml')
        .test(/\.wxml$/)
        .use('wxml-loader')
        .loader('wxml-loader');
      
      // 小程序资源优化
      chain.optimization
        .splitChunks({
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              chunks: 'all',
              priority: 10,
              minChunks: 1,
              minSize: 0
            }
          }
        });
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
}; 