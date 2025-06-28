/**
 * Taro.js Rspack 插件 - 专注于微信小程序构建优化
 * @param {object} ctx Taro 插件上下文
 * @param {object} options 插件配置选项
 */
module.exports = (ctx, options = {}) => {
  console.log('🚀 Rspack 插件已加载，准备优化小程序构建...');
  console.log('🔍 可用的 ctx 方法:', Object.keys(ctx).filter(key => typeof ctx[key] === 'function'));
  console.log('📝 插件配置:', options);

  // 创建 Rspack 优化函数
  const applyRspackOptimizations = (chain, data) => {
    console.log('🔧 应用 Rspack 优化，平台:', data?.platform);
    
    const { platform } = data || {};
    
    // 只处理小程序平台
    if (platform !== 'weapp') {
      console.log(`⏭️  跳过平台 ${platform}，只处理 weapp 平台`);
      return chain;
    }

    console.log('🔥 切换到 Rspack 优化模式进行小程序构建...');

    // 尝试检测是否可以使用 SWC（如果有 @swc/core）
    let useSwc = false;
    try {
      require.resolve('@swc/core');
      useSwc = true;
      console.log('✅ 检测到 SWC，将使用 SWC 进行编译优化');
    } catch (e) {
      console.log('⚠️  未检测到 SWC，使用 Babel 编译');
    }

    if (useSwc) {
      // 使用 SWC 替换 JavaScript/TypeScript 编译器
      chain.module.rules.delete('script');
      chain.module
        .rule('script')
        .test(/\.(ts|tsx|js|jsx)$/)
        .exclude
          .add(/node_modules/)
          .end()
        .use('swc-loader')
          .loader('swc-loader')  // 使用标准的 swc-loader
          .options({
            jsc: {
              target: 'es5',
              parser: {
                syntax: 'typescript',
                tsx: true,
                decorators: true
              },
              transform: {
                react: {
                  runtime: 'automatic'
                }
              }
            }
          });
    } else {
      // 优化现有的 Babel 配置
      const scriptRule = chain.module.rule('script');
      if (scriptRule) {
        // 添加缓存优化
        scriptRule
          .use('cache-loader')
          .loader('cache-loader')
          .before('babel-loader');
      }
    }

    // 优化代码分割策略
    chain.optimization
      .splitChunks({
        chunks: 'all',
        minSize: 0,
        cacheGroups: {
          default: false,
          vendors: false,
          // 公共模块
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
          // Taro 框架
          taro: {
            test: /[\\/]node_modules[\\/]@tarojs[\\/]/,
            name: 'taro',
            priority: 15,
            chunks: 'all',
            enforce: true
          }
        }
      });

    // 添加环境变量
    chain.plugin('rspack-define')
      .use(require('webpack').DefinePlugin, [{
        '__RSPACK_OPTIMIZED__': JSON.stringify(true),
        '__DEV__': JSON.stringify(process.env.NODE_ENV === 'development')
      }]);

    console.log('🎯 Webpack 配置已修改，应用 Rspack 优化');
    return chain;
  };

  // 尝试不同的钩子注册方式
  console.log('🔧 尝试注册 modifyWebpackChain 钩子...');

  // 返回插件对象，包含所有的钩子函数
  return {
    // 构建开始时的钩子
    onBuildStart() {
      console.log('🚀 开始构建，Rspack 插件准备工作...');
    },

    // 构建完成时的钩子
    onBuildFinish({ isWatch }) {
      console.log('✅ Rspack 优化的小程序构建完成!', isWatch ? '(监听模式)' : '(单次构建)');
    },

    // 修改 Webpack 配置的钩子
    modifyWebpackChain({ chain, data }) {
      console.log('🎉 modifyWebpackChain 钩子被成功调用！');
      return applyRspackOptimizations(chain, data);
    },

    // 尝试其他可能的钩子名称（兼容性处理）
    modifyChain({ chain, data }) {
      console.log('🎉 modifyChain 钩子被调用！');
      return applyRspackOptimizations(chain, data);
    },

    // 也尝试直接通过 ctx 注册（如果返回的方式不工作）
    init() {
      console.log('🔧 在 init 钩子中尝试直接注册...');
      
      // 尝试直接注册到 ctx
      if (typeof ctx.modifyWebpackChain === 'function') {
        console.log('✅ 发现 ctx.modifyWebpackChain 方法，直接注册');
        ctx.modifyWebpackChain(({ chain, data }) => {
          console.log('🎉 通过 ctx 直接注册的 modifyWebpackChain 被调用！');
          return applyRspackOptimizations(chain, data);
        });
      } else {
        console.log('❌ ctx.modifyWebpackChain 方法不存在');
      }
    }
  };
}; 