const chai = require('chai')
chai.use(require('dirty-chai'))
chai.should()

const Departure = require('../src/departure')
const { DEFAULT_TIMEZONE } = require('../src/index')

describe('Departure class', () => {
  describe('constructor', () => {
    it('should instantiate from parsed CSV', () => {
      let jsonFromCSV = {
        TimeStamp: 1520894926,
        Origin: 'South Station',
        Trip: 833,
        Destination: 'Providence',
        ScheduledTime: 1520901000,
        Lateness: 0,
        Track: '',
        Status: 'On Time'
      }

      let departure = new Departure(jsonFromCSV, DEFAULT_TIMEZONE)

      JSON.parse(JSON.stringify(departure))
        .should.eql({
          'currentTime': '6:48 PM',
          'scheduledTime': '8:30 PM',
          'origin': 'South Station',
          'trip': 833,
          'destination': 'Providence',
          'lateness': 0,
          'track': '-',
          'status': 'On Time',
          'statusText': 'On Time'
        })
    })
  })

  describe('static parseTimestamp', () => {
    it('should convert an epoch timestamp to short locale format', () => {
      Departure.parseTimestamp(1520900100, DEFAULT_TIMEZONE)
        .should.equal('8:15 PM')
    })
  })

  describe('static statusTextFrom', () => {
    it('should ignore 0 lateness', () => {
      Departure.statusTextFrom('On Time', 0)
        .should.equal('On Time')
    })

    it('should compose status and non-zero lateness in mins', () => {
      Departure.statusTextFrom('Delayed', 300)
        .should.equal('Delayed 5 min')
    })
  })
})
