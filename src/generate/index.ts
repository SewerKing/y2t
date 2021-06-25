import { initConfig, existConfig } from '../utils/config'
import inquirer from 'inquirer'
import { clg } from '../utils/console';
import { Login } from '../yapi/login';

/**
 * @description 生成typescript文档
 * @author Wynne
 * @date 2021-06-25
 * @export
 * @return {*} 
 */
export async function generateTypescript() {
  // 判断是否有配置文件
  if (!existConfig()) {
    const res = await inquirer.prompt({
      type: 'confirm',
      message: '当前项目不存在config，是否生成默认配置',
      name: 'isGenerate',
      default: false
    })
    if (res.isGenerate) {
      initConfig()
      return;
    } else {
      clg('red', '已取消生成默认配置，请完善配置后重试')
      return;
    }
  }
  // 登录
  await Login();
}