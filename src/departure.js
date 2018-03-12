/**
 * Models a departure table item.
 *
 * @class
 *
 * @example <caption>Example Departure instance (JSON serialized and parsed)</caption>
 * {
 *   currentTime: '9:25 AM',
 *   scheduledTime: '9:25 AM',
 *   origin: 'South Station',
 *   trip: 1719,
 *   destination: 'Forge Park / 495',
 *   lateness: 300,
 *   track: '-',
 *   status: 'Delayed',
 *   statusText: 'Delayed 5 min'
 * }
 */
class Departure {
  /**
   * @constructor
   * @param data {object} Parsed JSON object from CSV
   * @param timeZone {string} In Date timezone format, e.g. 'America/New_York'
   */
  constructor (data, timeZone) {
    // Timestamps in epoch seconds
    this.currentTime = Departure.parseTimestamp(data['TimeStamp'], timeZone)
    this.scheduledTime = Departure.parseTimestamp(data['ScheduledTime'], timeZone)

    this.origin = data['Origin'] // e.g. 'South Station'
    this.trip = data['Trip'] // Train #
    this.destination = data['Destination']

    this.lateness = data['Lateness'] // In seconds
    this.track = data['Track'] || '-'

    this.status = data['Status']
    this.statusText = Departure.statusTextFrom(this.status, this.lateness)
  }

  /**
   * Parses and transforms an epoch timestamp into a locale-specific am/pm time
   * for display purposes.
   *
   * @example
   * parseTimestamp(1520900100, 'America/New_York')  ->  '8:15 PM'
   *
   * @param ts {number} Epoch timestamp in seconds
   * @param timeZone {string}
   *
   * @returns {string}
   */
  static parseTimestamp (ts, timeZone) {
    let time = new Date(ts * 1000) // Date expects milliseconds

    return time.toLocaleTimeString('en-US',
      { hour: '2-digit', minute: '2-digit', timeZone })
  }

  /**
   * Composes a status text for the departures display board (combines
   * lateness minutes with status where appropriate)
   *
   * @example
   * statusTextFrom('On Time', 0)    -> 'On Time'
   * statusTextFrom('Delayed', 300)  -> 'Delayed 5 min'
   *
   * @param status {string}
   * @param lateness {number} In seconds
   *
   * @returns {string}
   */
  static statusTextFrom (status, lateness) {
    let statusText = status

    if (lateness > 0) {
      let minsLate = lateness / 60 // Convert to minutes
      statusText = `${status} ${minsLate} min`
    }

    return statusText
  }
}

module.exports = Departure
