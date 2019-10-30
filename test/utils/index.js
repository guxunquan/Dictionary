import config from '../../src/config'
import {JPushAsync,JPush} from 'jpush-async'

async function JpushTest(){
 const client= await JPushAsync.buildClient('0e73adef8b19dca4bc5d4919','e651e6cc9d881825df7dad1d')

 const result= await client.push().setPlatform('android')
    .setAudience(JPush.tag('555'), JPush.alias('666'))
    .setNotification('Hi, JPush',JPush.android('android alert', 'test' , 1))
    .setMessage('this is from dictionary api')
    .setOptions(null, 60)
    .send()
}

JpushTest()