/* eslint-disable @typescript-eslint/no-var-requires */
import json from '@rollup/plugin-json'
import typescript from 'rollup-plugin-typescript2'
import { cleandir } from 'rollup-plugin-cleandir'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs';
import eslint from 'rollup-plugin-eslint';

const extensions = ['.js', '.ts']

export default {
  // 输入目录
  input: ['./src/index.ts', './src/core/index.ts'],
  // 输出目录
  output: {
    dir: './lib',
    format: 'cjs'
  },
  plugins: [
    // eslint校验
    eslint({
      throwOnError: true,
      throwOnWarning: true,
      include: ['src/**'],
      exclude: ['node_modules/**']
    }),
    // 清理文件夹
    cleandir('./lib'),
    // 处理#!/usr/bin/env node
    preserveShebangs(),
    // 解析typescript
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          module: "ESNEXT"
        }
      },
    }),
    // 解析代码中依赖的node_modules
    nodeResolve({
      extensions,
      modulesOnly: true,
      preferredBuiltins: false
    }),
    // 将JSON转换为ES6版本
    json(),
    // 代码压缩
    terser()
  ],
}