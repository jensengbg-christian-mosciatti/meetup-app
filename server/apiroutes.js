const config = require('../shared/environment.js')
const { Router } = require('express')
const bcrypt = require('bcrypt')
const axios = require('axios')

// const redis = require('redis')
// const client = redis.createClient(process.env.REDIS_URL)
const { client } = require('./server')
// console.log('client', client)
// const Redis = require('ioredis')
// const client = new Redis(process.env.REDIS_URL)

const router = new Router()

router.get('/getmeetups', async (req, res) => {
  // console.log(req.session)
  let meetupList = []
  let cursor = 0

  do {
    const [scanCursor, scanList] = await client.scanAsync(
      cursor,
      'match',
      'meetup*'
    )
    cursor = scanCursor
    for (let idx of scanList) {
      meetupList.push(
        new Promise((res) => {
          client.hgetall(idx, (resu, rep) => res(rep))
        })
      )
    }
    // meetupList = [...meetupList, ...scanList]
  } while (cursor != 0)

  /*   Fetch alltogether, bättre än awaita varje hgetall   */
  await Promise.all(meetupList)
    .then((result) => {
      res.status(200).send(result)
    })
    .catch((err) => {
      console.log('Error fetching meetups: ', err)
      res.status(500).send('Server error fetching meetups')
    })
})

router.post('/attendmeet', async (req, res) => {
  if (!req.session.userid) {
    res.status(401).send('You are logged out')
    return
  }

  if (!req.body.meetId || req.body.meetId == null)
    return res.status(400).send('No event id provided in the request')

  const meetId = req.body.meetId
  const userId = req.session.userid
  const meetup = await client.hgetallAsync(`meetup:${meetId}`)
  if (!meetup || meetup == null)
    return res.status(400).send(`No events found for id: ${meetId}`)

  let attendees = []
  if (Object.prototype.hasOwnProperty.call(meetup, 'attendees'))
    attendees = JSON.parse(meetup.attendees)

  // if (attendees.includes(userId))
  if (attendees.findIndex((attendee) => attendee.id == userId) >= 0)
    return res.status(400).send(`User ${userId} already attending the event`)

  attendees.push({ id: userId })
  const result = client.hset(
    `meetup:${meetId}`,
    'attendees',
    JSON.stringify(attendees)
  )
  // console.log('setset: ', result, attendees)
  if (result > 0) return res.status(200).send(attendees)
  return res
    .status(500)
    .send(`Server error, could not add attendee to event ${meetId}`)
})

router.post('/getusername', async (req, res) => {
  const reqUserId = req.body.reqUserId
  if (!req.body.reqUserId || req.body.reqUserId == null)
    return res.status(400).send('Provide a userId to request name for')

  let userName = await client.hgetAsync(`user:${reqUserId}`, 'username')
  if (!userName) userName = 'No Name'

  return res.status(200).send(userName)
})

router.post('/unattendmeet', async (req, res) => {
  if (!req.session.userid) {
    res.status(401).send('You are logged out')
    return
  }

  if (!req.body.meetId || req.body.meetId == null)
    return res.status(400).send('No event id provided in the request')

  const meetId = req.body.meetId
  const userId = req.session.userid
  const meetup = await client.hgetallAsync(`meetup:${meetId}`)
  if (!meetup || meetup == null)
    return res.status(400).send(`No events found for id: ${meetId}`)

  let attendees = []
  if (Object.prototype.hasOwnProperty.call(meetup, 'attendees'))
    attendees = JSON.parse(meetup.attendees)
  else return res.status(200).send([])

  // const idx = attendees.findIndex((el) => el == userId)
  const idx = attendees.findIndex((attendee) => attendee.id == userId)

  if (idx < 0) return res.status(200).send([])

  attendees = attendees
    .slice(0, idx)
    .concat(attendees.slice(idx + 1, attendees.length))

  const result = client.hset(
    `meetup:${meetId}`,
    'attendees',
    JSON.stringify(attendees)
  )

  if (result > 0) return res.status(200).send(attendees)
  return res
    .status(500)
    .send(`Server error, could not add attendee to event ${meetId}`)
})

router.post('/updreview', async (req, res) => {
  if (!req.session.userid) {
    res.status(401).send('You are logged out')
    return
  }

  if (
    !req.body.meetId ||
    req.body.meetId == null ||
    !Object.prototype.hasOwnProperty.call(req.body, 'review')
  )
    return res.status(400).send('No event id provided in the request')

  const meetId = req.body.meetId
  const review = req.body.review == null ? '' : req.body.review
  const userId = req.session.userid

  const meetup = await client.hgetallAsync(`meetup:${meetId}`)
  if (!meetup || meetup == null)
    return res.status(400).send(`No events found for id: ${meetId}`)

  let attendees = []
  if (Object.prototype.hasOwnProperty.call(meetup, 'attendees'))
    attendees = JSON.parse(meetup.attendees)
  else return res.status(400).send(`No attendees found for event id ${meetId}`)

  // const idx = attendees.findIndex((el) => el == userId)
  const idx = attendees.findIndex((attendee) => attendee.id == userId)

  if (idx < 0)
    return res
      .status(400)
      .send(`User ${userId} was not attending the event id ${meetId}`)

  attendees[idx].review = review

  const result = client.hset(
    `meetup:${meetId}`,
    'attendees',
    JSON.stringify(attendees)
  )

  if (result > 0) return res.status(200).send(attendees)
  return res
    .status(500)
    .send(`Server error, could not add attendee to event ${meetId}`)
})

router.post('/newmeet', async (req, res) => {
  if (!req.session.userid) {
    res.status(401).send('You are logged out')
    return
  }
  const meet = req.body

  if (
    meet.category == null ||
    meet.category == '' ||
    meet.title == null ||
    meet.title == '' ||
    meet.description == null ||
    meet.description == '' ||
    meet.dateStart == null ||
    meet.dateStart == '' ||
    meet.city == null ||
    meet.city == ''
  )
    return res.status(400).send('Please fill all mandatory fields')

  for (const [key, value] of Object.entries(meet)) {
    meet[key] = value == null ? '' : value
  }

  let id, result

  try {
    id = await client.incrAsync('meetid')

    result = await client.hsetAsync(
      `meetup:${id}`,
      'id',
      id,
      'organizer',
      req.session.userid,
      'category',
      meet.category,
      'title',
      meet.title,
      'description',
      meet.description,
      'image',
      meet.image,
      'dateStart',
      meet.dateStart,
      'timeStart',
      meet.timeStart,
      'dateEnd',
      meet.dateEnd,
      'timeEnd',
      meet.timeEnd,
      'participantsMax',
      meet.participantsMax,
      'address',
      meet.address,
      'city',
      meet.city,
      'cost',
      meet.cost,
      'attendees',
      ''
    )
    if (result > 0) {
      const meetup = await client.hgetallAsync(`meetup:${id}`)

      return res.status(200).send({
        message: 'Meet added',
        meetup: meetup,
      })
    } else {
      return res.status(500).send('Error adding the meetup')
    }
  } catch (err) {
    return res.status(500).send('Error adding the meetup')
  }
})

router.get('/categories', async (req, res) => {
  const list = await client.smembersAsync('categories')
  res.status(200).send({ message: list })
})

router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body

  if (
    username == null ||
    !username ||
    email == null ||
    !email ||
    password == null ||
    !password
  ) {
    res.send({
      status: 400,
      message: 'Please email, username and password are required',
    })
    return
  }

  let userid = await client.hgetAsync('users', email)
  if (!userid) {
    userid = await client.incrAsync('userid')
    client.hsetAsync('users', email, userid)
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    client.hset(
      `user:${userid}`,
      'hash',
      hash,
      'email',
      email,
      'username',
      username
    )

    req.session.userid = userid
    req.session.save()
    res.status(200).send({ userid: userid })
  }
})

router.get('/amilogged', async (req, res) => {
  if (!req.session.userid)
    return res.status(200).send({ logged: false, userid: null })

  return res.status(200).send({ logged: true, userid: req.session.userid })
})

router.post('/signout', async (req, res) => {
  req.session.destroy()
  res.status(200).send()
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body

  if (email == null || !email || password == null || !password) {
    res.send({
      status: 400,
      message: 'Email and password are required to login',
    })
    return
  }

  // console.log(req.body, username, password)

  const userid = await client.hgetAsync('users', email)
  if (userid) {
    const hash = await client.hgetAsync(`user:${userid}`, 'hash')
    const result = await bcrypt.compare(password, hash)
    if (result) {
      //password ok
      req.session.userid = userid
      req.session.save()
      res.status(200).send({ userid: userid })
    } else {
      //wrong password
      res.send({ status: 401, message: 'Wrong password' })
    }
  } else {
    //user exists, login procedure
    res.send({ status: 401, message: 'User does not exist' })
  }
})

router.get('/location', async (req, res) => {
  const api_key = config.IPTOEARTH_API_KEY

  //check localhost: ip starts with ::
  const ip =
    req.ipInfo.ip.substring(0, 2) == '::' ? '213.89.73.184' : req.ipInfo.ip
  //87.248.33.19
  //213.89.73.184

  const location = { ip: ip, city: null }

  location.city = (await client.hmgetAsync([`ipaddress:${ip}`, 'city']))[0]

  if (location.city == null || !location.city) {
    // console.log('getting the city again')
    const result = await (async () => {
      try {
        return await axios.get(
          `https://iptoearth.expeditedaddons.com/?api_key=${api_key}&ip=${ip}`
        )
      } catch (error) {
        console.error('This is the error:', error)
      }
    })()
    // const result = { status: 200, data: { city: 'Kungsbacka' } }
    // console.log('Is there any result? ', result)
    if (result.status === 200) {
      location.city = result.data.city
      // console.log('added city from API: ', location.city)
    }
  }
  // console.log('City before adding: ', location.city)

  client.hset(`ipaddress:${ip}`, 'city', location.city)
  client.expire(`ipaddress:${ip}`, 86400)

  res.send({ status: 200, message: location })
})

module.exports = router
