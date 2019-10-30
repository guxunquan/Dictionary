import path from 'path'
import yaml from 'js-yaml'
import fs from 'fs'

const env = process.env.NODE_ENV || 'development'
const config = yaml.safeLoad(fs.readFileSync(`${__dirname}/../config.yml`))
const logDir = config.log[env].path || path.join(__dirname, '../logs')

export default {
  logDir,
  env,
  Jpush:config.Jpush[env],
  cacheConfig: config.cache[env]
}