# wmu2

> 基础开发组的移动端UI框架

## 建立开发环境

``` bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 代码编译
npm run build
```

## 安装脚手架
``` bash
tnpm i @tencent/wii -g
```

## 创建模块
``` bash
wii module create [moduleName]
//如下
wii module create button
```

## 简历依赖关系
``` bash
# 将core模块添加到button模块中
wii module refer core button
```

## 使用模块
``` javascript
import WiiCore from 'wii-core'

// 使用WiiCore即可
```

## 模块发布
``` bash
//未完待续 
```
