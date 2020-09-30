const config = require('../shared/environment.js')

const redis = require('redis')
const pifall = require('pifall')
pifall(redis.RedisClient.prototype)
pifall(redis.Multi.prototype)

const client = redis.createClient(config.REDIS_URL)
exports.client = client

const express = require('express')
const cors = require('cors')
const expressip = require('express-ip')

const session = require('express-session')
const RedisStore = require('connect-redis')(session)

const serveStatic = require('serve-static')
const path = require('path')

const app = express()
// app.use(cors())
const whitelist = ['http://localhost:8080', 'http://localhost:80']
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}
// app.use(cors(corsOptions))
app.use(cors())

app.use(expressip().getIpInfoMiddleware)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', serveStatic(path.join(__dirname, '../dist')))
app.use(
  session({
    store: new RedisStore({ client: client }),
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 36000000, //36000000 10 hours, in milliseconds
      httpOnly: false, // enable this to secure the cookie
      secure: false, // this cookie is not secure
    },
    secret: config.SESSION_SECRET,
  })
)

const apiroutes = require('./apiroutes')
const routes = require('./routes')
app.use('/api/', apiroutes)
app.use('/', routes)

const port = process.env.PORT || 8089
app.listen(port)
console.log(`app is listening on port: ${port}`)
