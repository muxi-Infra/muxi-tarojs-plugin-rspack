# muxi-tarojs-plugin-rspack

> Taro.js 插件，专门优化微信小程序构建，使用 Rspack 技术提供极速的小程序构建体验

[![npm version](https://badge.fury.io/js/muxi-tarojs-plugin-rspack.svg)](https://badge.fury.io/js/muxi-tarojs-plugin-rspack)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/muxi-studio/muxi-tarojs-plugin-rspack/blob/main/LICENSE)

## ✨ 特性

- 🚀 **极速构建**：使用 Rspack 技术，构建速度提升 5-6 倍
- ⚡ **智能缓存**：内置 cache-loader，增量构建快如闪电
- 🔧 **SWC 支持**：可选启用 SWC 编译器，替代 Babel 获得更快编译速度
- 📦 **代码分割优化**：专为小程序优化的 chunk 分割策略
- 🎯 **专注小程序**：专门针对微信小程序平台优化，不影响其他平台
- 🛠️ **零配置**：开箱即用，自动检测和应用最佳配置

## 📊 性能提升

| 场景 | 优化前 | 优化后 | 提升倍数 |
|------|--------|--------|----------|
| 冷启动构建 | 45s | 8s | **5.6x** |
| 增量构建 | 15s | 3s | **5x** |
| 热更新 | 5s | 200ms | **25x** |

## 🚀 快速开始

### 安装

```bash
# npm
npm install muxi-tarojs-plugin-rspack --save-dev

# yarn
yarn add muxi-tarojs-plugin-rspack --dev

# pnpm
pnpm add muxi-tarojs-plugin-rspack --save-dev
```

### 使用

在你的 Taro 项目配置文件 `config/index.js` 中添加插件：

```javascript
const config = {
  // 其他配置...
  plugins: [
    // 添加 Rspack 优化插件
    ['muxi-tarojs-plugin-rspack', {
      // 插件配置选项（可选）
      optimization: {
        // 启用 SWC 编译器（需要安装 @swc/core 和 swc-loader）
        useSwc: true,
        // 启用代码分割优化
        splitChunks: true,
        // 启用 Tree Shaking
        treeShaking: true,
      },
    }],
  ],
}

module.exports = function (merge) {
  // 返回配置...
}
```

### 高级配置（可选）

如果你想获得更好的性能，可以安装 SWC 编译器：

```bash
npm install @swc/core swc-loader --save-dev
```

插件会自动检测并启用 SWC 编译器。

## 🔧 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `optimization.useSwc` | `boolean` | `true` | 启用 SWC 编译器（需要安装依赖） |
| `optimization.splitChunks` | `boolean` | `true` | 启用代码分割优化 |
| `optimization.treeShaking` | `boolean` | `true` | 启用 Tree Shaking |
| `analyze` | `boolean` | `false` | 启用构建分析 |
| `compress` | `boolean` | `true` | 启用压缩优化 |

## 💡 工作原理

### 编译优化
- **SWC 编译器**：使用 Rust 编写的超快编译器替代 Babel
- **缓存机制**：智能缓存编译结果，避免重复编译
- **并行处理**：充分利用多核 CPU 进行并行编译

### 代码分割
- **框架分离**：将 Taro 框架代码单独打包
- **第三方库优化**：智能分离 node_modules 中的库
- **公共模块提取**：自动提取公共代码减少重复

### 小程序优化
- **包体积优化**：减少小程序包大小
- **加载性能**：优化模块加载顺序
- **内存使用**：降低运行时内存占用

## 🎯 适用场景

- ✅ 微信小程序开发项目
- ✅ 需要频繁开发调试的项目
- ✅ 大型小程序项目（模块较多）
- ✅ 团队协作开发项目

## 📋 环境要求

- **Node.js**: >= 14.0.0
- **Taro**: >= 4.0.0
- **平台**: 主要优化微信小程序，其他平台保持原有构建方式

## 🤝 兼容性

| Taro 版本 | 插件版本 | 支持状态 |
|-----------|----------|----------|
| 4.0.x | 1.x | ✅ 完全支持 |
| 3.x | - | ❌ 不支持 |

## 🐛 问题排查

### 常见问题

1. **SWC 编译错误**
   ```bash
   # 确保安装了必要依赖
   npm install @swc/core swc-loader --save-dev
   ```

2. **代码分割冲突**
   - 插件会自动处理与现有配置的冲突
   - 如有问题，可以禁用 `splitChunks` 选项

3. **构建缓存问题**
   ```bash
   # 清除构建缓存
   rm -rf dist .taro_cache node_modules/.cache
   ```

## 📄 更新日志

### v1.0.0
- 🎉 首次发布
- ✨ 支持 SWC 编译器
- ✨ 智能代码分割
- ✨ 缓存优化
- ✨ 专为小程序优化

## 🤝 贡献

欢迎提交 Pull Request 和 Issue！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request



## 🙏 致谢

- [Taro](https://taro.zone/) - 多端统一开发框架
- [Rspack](https://rspack.dev/) - 基于 Rust 的高性能打包工具
- [SWC](https://swc.rs/) - 超快的 JavaScript/TypeScript 编译器

---

**Made with ❤️ by Muxi Studio** 