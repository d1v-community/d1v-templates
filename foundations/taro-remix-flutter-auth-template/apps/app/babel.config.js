// babel-preset-taro 更多选项和默认值：
// https://docs.taro.zone/docs/next/babel-config
const miniTargets = {
  ios: '9',
  android: '5',
}

const isMiniBuild = process.env.TARO_ENV && process.env.TARO_ENV !== 'h5'

module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true,
      compiler: 'webpack5',
      ...(isMiniBuild ? {
        // The app package defines a modern browserslist for H5.
        // Mini-program uploads still require older syntax, so force Babel
        // to ignore that browserslist and transpile down for mini targets.
        targets: miniTargets,
        ignoreBrowserslistConfig: true,
        forceAllTransforms: true,
      } : {}),
    }]
  ]
}
