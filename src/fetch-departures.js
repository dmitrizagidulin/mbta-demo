const fetch = require('node-fetch')
const parse = require('csv-parse/lib/sync')

const Departure = require('./departure')

/**
 * Fetches and parses departures from a given url
 *
 * @example <caption>Sample fetched CSV file</caption>
 * TimeStamp,Origin,Trip,Destination,ScheduledTime,Lateness,Track,Status
 * 1520728530,"North Station","1411","Wachusett",1520729700,0,,"On Time"
 *
 * @param url {string}
 * @param timeZone {string}
 *
 * @returns {Promise<Array<Departure>>}
 */
function fetchDepartures (url, timeZone) {
  return fetchCSV(url).then(csv => parseDepartures(csv, timeZone))
}

/**
 * Fetches and returns un-parsed CSV from a url
 *
 * @param url {string}
 *
 * @throws {Error} Rejects on a non-200 HTTP response
 *
 * @returns {Promise<string>} Resolves with un-parsed CSV text
 */
function fetchCSV (url) {
  console.log('Fetching departures...')

  return fetch(url)
    .then(res => {
      console.log('Fetched.')

      if (!res.ok) {
        throw new Error(`Error fetching ${url}: ${res.status} ${res.statusText}`)
      }

      return res.text()
    })
}

/**
 * Parses raw CSV into an array of Departure instances.
 *
 * @param input {string} Un-parsed CSV
 * @param timeZone {string}
 *
 * @returns {Array<Departure>}
 */
function parseDepartures (input, timeZone) {
  let records = parse(input, {columns: true, auto_parse: true})

  // console.log(records)

  return records.map(data => new Departure(data, timeZone))
}

module.exports = {
  fetchDepartures
}
