import morgan from 'koa-morgan'
import log4js from 'log4js'
import path from 'path'
import FileStreamRotator from 'file-stream-rotator'
import config from './config'

const accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYY-MM-DD',
    filename: path.join(config.logDir, 'dictionary-access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
  })
  
  const morganPattern = '[:date[iso]] :req[x-forwarded-for] ":method :url HTTP/:http-version" :status :response-time[0] :res[content-length] :user-agent :req[app_version]'
  
  const accessLog = morgan(morganPattern, { stream: accessLogStream })
  
  let log4jsConfig = {
    file: {
      type: 'dateFile', // dateFile
      filename: path.join(config.logDir, 'dictionary.log'),
      pattern: '-yyyy-MM-dd',
      alwaysIncludePattern: false
    },
    process: {
      type: 'dateFile',
      filename: path.join(config.logDir, 'processlist.log'),
      pattern: '-yyyy-MM-dd',
      alwaysIncludePattern: false
    }
  }
  const appenderNames = ['file']
  if (['development'].includes(config.env)) {
    log4jsConfig = Object.assign(log4jsConfig, { out: { type: 'console' } })
    appenderNames.push('out')
  }
  
  const envLogLevel = {
    test: 'info',
    development: 'debug',
    production: 'warn',
    staging: 'warn'
  }
  
  log4js.configure({
    appenders: log4jsConfig,
    categories: {
      default: { appenders: appenderNames, level: envLogLevel[config.env] },
      'process': { appenders: ['process'], level: 'debug' }
    },
    pm2: ['staging', 'production'].includes(config.env)
  })
  
  const logger = log4js.getLogger('biz')
  const newLog = log4js.getLogger
  
  export {
    accessLog,
    newLog
  }
  
  export default logger