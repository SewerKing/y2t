import path from 'path'
import fs from 'fs';
import inquirer from 'inquirer'
import { clg } from './console';

const configPath = path.resolve(process.cwd(), './ygt.config.js');

// 输出配置
export const getConfig = (): IConfig => require(configPath);

/**
 * @description 是否存在配置
 * @author Wynne
 * @date 2021-06-25
 */
export const existConfig = () => {
  return fs.existsSync(configPath)
}

/**
 * @description 生成默认配置
 * @author Wynne
 * @date 2021-06-25
 */
export const initConfig = async () => {
  if (existConfig()) {
    const res = await inquirer.prompt({
      type: 'confirm',
      message: '已存在本地配置，是否覆盖？',
      name: 'isOverlap',
      default: false
    })
    if (!res.isOverlap) {
      clg('red', '已取消生成配置')
      return;
    }
  }
  const originPath = path.resolve(__dirname, '../templates/configTemplate/ygt.config.js');
  fs.copyFileSync(originPath, configPath)
  clg('green', '默认配置已生成，请根据文档进行配置')
}