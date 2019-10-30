import app from './app'
import logger from './logger'

process.on('SIGINT', () => {
    process.exit(0)
  })

const start = async () => {
    const port = process.env.PORT || 3000
    app.listen(port, () => {
      if (process.send) {
        process.send('ready')
      }
      logger.info(`${app.name}-${app.env}: app.listen(${port})`)
    })
  }
  
  start()