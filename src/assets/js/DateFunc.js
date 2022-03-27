import {date} from 'quasar'

export function useDateString() {
  function dateString(timestamp) {
    return date.formatDate(timestamp, "YYYY-MM-DD HH:mm:ss")
  }
  return {
    dateString
  }
}
