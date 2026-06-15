// Minimal stub for react-native types referenced by some @tarojs/components declarations.
// We don't ship RN in this project, but we want `tsc` to succeed for H5/weapp builds.
declare module 'react-native' {
  // Keep `StyleProp<T>` generic shape while effectively treating it as `any`.
  export type StyleProp<T = any> = any & { __taroStylePropBrand?: T }
  export type ViewStyle = any
}
