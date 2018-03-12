const nock = require('nock')
const chai = require('chai')
chai.use(require('dirty-chai'))
chai.should()

const { fetchDepartures } = require('../src/fetch-departures')
const { DEFAULT_URL, DEFAULT_TIMEZONE } = require('../src/index')

const SAMPLE_CSV =
  `TimeStamp,Origin,Trip,Destination,ScheduledTime,Lateness,Track,Status
1520728530,"North Station","1411","Wachusett",1520729700,0,,"On Time"`

describe('fetchDepartures', () => {
  it('should returned a parsed array of departures on successful csv fetch', () => {
    nock('http://developer.mbta.com').get('/lib/gtrtfs/Departures.csv')
      .reply(200, SAMPLE_CSV)

    return fetchDepartures(DEFAULT_URL, DEFAULT_TIMEZONE)
      .then(fetchedDepartures => {
        JSON.parse(JSON.stringify(fetchedDepartures))
          .should.eql([
            {
              currentTime: '7:35 PM',
              scheduledTime: '7:55 PM',
              origin: 'North Station',
              trip: 1411,
              destination: 'Wachusett',
              lateness: 0,
              track: '-',
              status: 'On Time',
              statusText: 'On Time'
            }
          ])
      })
  })

  it('should reject with an error if it encounters a non-200 HTTP response', done => {
    nock('http://developer.mbta.com').get('/lib/gtrtfs/Departures.csv')
      .reply(404, 'Not Found')

    fetchDepartures(DEFAULT_URL, DEFAULT_TIMEZONE)
      .catch(error => {
        error.message
          .should.equal('Error fetching http://developer.mbta.com/lib/gtrtfs/Departures.csv: 404 Not Found')
        done()
      })
  })
})
