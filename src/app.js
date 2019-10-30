import Koa from 'koa'
import Router from 'koa-joi-router'
import cors from 'kcors'
import fs from 'fs'


const app = new Koa()
app.name = 'fiton-api'

const pageRouter = new Router()
  .get('/healthcheck', ctx => ctx.status = 200)
  .get(/^\/(.*)(?:\/|$)/, async ctx => {
    ctx.set({ 'Content-Type': 'text/html' })
    ctx.body = fs.readFileSync(`${__dirname}/../client/build/index.html`).toString('utf-8')
  })

  app.use(require('koa-static')('client/build'))

  app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,POST,DELETE',
    optionsSuccessStatus: 200
  }))

  export default app
