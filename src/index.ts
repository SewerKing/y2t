#!/usr/bin/env node
import { program } from 'commander';
import pkg from '../package.json'
import { generateTypescript } from './generate';
import { initConfig } from './utils/config';
/**
 * @description 生成入口
 * @author Wynne
 * @date 2021-06-25
 */
(async function entry() {
  // 配置执行参数
  program
    .version(pkg.version, '-v, --version', '获取当前版本')
    .option('-i, --init', '初始化配置文件')
    .option('-g, --generate', '生成接口文档')
    .option('-d, --diff', '当前项目Diff')

  program.on('option:generate', () => {
    generateTypescript()
  })

  program.on('option:init', () => {
    initConfig()
  })

  program.on('option:diff', () => {
    console.log('接口diff')
  })

  program.parse(process.argv);
})()