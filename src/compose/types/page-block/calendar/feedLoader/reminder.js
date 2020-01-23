import { makeColors } from './colors'
// import variables from 'corteza-webapp-compose/src/themes/corteza-base/variables.scss'

// const defaultColor = variables.secondary
// @todo fix this!
const defaultColor = '#568ba2'

/**
 * Loads & converts reminder resource into FC events
 * @param {SystemAPI} $SystemAPI SystemAPI provider
 * @param {User} user Current user
 * @param {Feed} feed Current feed
 * @param {Object} range Current date range
 * @returns {Promise<Array>} Resolves to a set of FC events to display
 */
export default async function ($SystemAPI, user, feed, range) {
  feed.options.color = feed.options.color || defaultColor
  return $SystemAPI.reminderList({
    perPage: 0,
    scheduledFrom: range.start.toISOString(),
    scheduledUntil: range.end.toISOString(),
    scheduledOnly: true,
    excludeDismissed: true,
    assignedTo: user.userID,
  }).then(({ set: reminders = [] }) => {
    const { backgroundColor, borderColor, isLight } = makeColors(feed.options.color)

    return reminders.map(r => {
      const classNames = ['event', 'event-reminder']
      if (r.assignedTo !== user.userID) {
        classNames.push('event-not-owner')
      }
      if (isLight) {
        classNames.push('text-dark')
      } else {
        classNames.push('text-white')
      }

      return {
        id: r.reminderID,
        title: r.payload.title || r.reminderID,
        start: r.remindAt,
        backgroundColor,
        borderColor,
        classNames,
        extendedProps: {
          reminderID: r.reminderID,
        },
      }
    })
  })
}
