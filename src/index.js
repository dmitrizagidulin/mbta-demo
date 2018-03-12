const DEFAULT_URL = 'http://developer.mbta.com/lib/gtrtfs/Departures.csv'
const DEFAULT_TIMEZONE = 'America/New_York'
const PORT = 3000

const { fetchDepartures } = require('./fetch-departures')

const express = require('express')
const app = express()

// Set the CORS header
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  next()
})

app.get('/departures', (req, res) => {
  return fetchDepartures(DEFAULT_URL, DEFAULT_TIMEZONE)
    .then(departures => {
      res.send(JSON.stringify(departures))
    })
})

app.listen(PORT, () => console.log(`/departures API endpoint listening on port ${PORT}`))

module.exports = {
  DEFAULT_URL,
  DEFAULT_TIMEZONE,
  PORT
}
