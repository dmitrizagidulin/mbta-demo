const fetch = require('node-fetch')
const parse = require('csv-parse/lib/sync')

const Departure = require('./departure')

/**
 * Fetches and parses
 *
 * @example <caption>Sample fetched CSV file</caption>
 * TimeStamp,Origin,Trip,Destination,ScheduledTime,Lateness,Track,Status
 * 1520728530,"North Station","1411","Wachusett",1520729700,0,,"On Time"
 *
 * @param url {string}
 *
 * @returns {Promise<Array<Departure>>}
 */
function fetchDepartures (url) {
  console.log('Fetching departures...')

  return fetch(url)

    .then(res => {
      console.log('Fetched.')
      return res.text()
    })

    .then(input => {
      let records = parse(input, {columns: true, auto_parse: true})

      console.log(records)

      return records.map(data => new Departure(data))
    })

    .catch(console.error)
}

module.exports = {
  fetchDepartures
}
