import Queue from 'bull'
import os from 'os'
import { newLog } from './logger'
import Handler from './job'
import config from './config'
const logger = newLog('job')

const queue = new Queue('jobs', {
    redis: config.cacheConfig
})

// Can only be called by one instance, otherwise will create duplicate jobs
const registerJob = async () => {
  const jobs =[{id:1,name:'dictionaryJpush',description:'dictionaryJpush',trigger:'*/1 * * * *',attempts:1}]
  if (jobs) {
    
    jobs.forEach(job => {
      const jobOpts = {
        attempts: job.attempts
      }
      if (!isNaN(job.trigger)) {
        jobOpts.delay = Math.max(parseInt(job.trigger) - Date.now(), 60 * 60 * 1000) // default exec after 1 hour
      } else {
        jobOpts.repeat = { cron: job.trigger }
      }
      queue.add({ id: job.id, name: job.name }, jobOpts)
    })
  }
}


/**
 * cron expression (UTC time)
 *  * * * * *
 *  min(0-59) hour(0-23) day of month(1-31) month(1-12) day of week(0-6, sunday is 0)
 */
async function main() {

  await registerJob()

  queue.process(async job => {
    if (Handler[job.data.name]) {
        try {
          await Handler[job.data.name]()
        } catch (e) {
          logger.warn(`execute job ${job.data.name} error: ${e}`)
        }
    }
  })

  queue.on('active', (job) => {
    logger.warn(`${job.data.name} active`)
  })

  queue.on('failed', async (job, err) => {
    if (job.attemptsMade === job.opts.attempts) {
      logger.fatal(`${job.data.name} failed more than 3 times`, err)
      
    } else {
      logger.error(`${job.data.name} failed more than ${job.attemptsMade} times`, err)
    }
  })

  queue.on('completed', (job) => {
    logger.warn(`${job.data.name}: finish`)
  })

  queue.on('stalled', function(job){
   
  })
}

main()