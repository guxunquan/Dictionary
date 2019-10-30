import logger, { newLog } from '../logger'
import moment from 'moment-timezone'
import config from '../config'
import { JPushAsync, JPush } from 'jpush-async'

export const dictionaryJpush = async () => {
    console.log('Jpush start')
    const client = await JPushAsync.buildClient(config.Jpush.appkey, config.Jpush.mastersecret)

    const result = await client.push().setPlatform('android')
        .setAudience(JPush.tag('555'), JPush.alias('666'))
        .setNotification('Hi, JPush', JPush.android('android alert', 'test', 1))
        .setMessage('this is from dictionary api')
        .setOptions(null, 60)
        .send()
}

export default { dictionaryJpush }