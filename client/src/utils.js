import { Notify } from 'quasar'

const SECONDS_IN_YEAR = 31536000
const SECONDS_IN_DAY = 86400
const SECONDS_IN_HOUR = 3600
const SECONDS_IN_MINUTE = 60
const SWC_SECONDS_OFFSET = 912668400
const THOLME_SECONDS_OFFSET = 113

export const genericError = (message) => {
  Notify.create({
    color: 'red-5',
    textColor: 'white',
    icon: 'warning',
    message,
    actions: [
      { label: 'Dismiss', color: 'white' }
    ]
  })
}

export const genericSuccess = (message) => {
  Notify.create({
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done',
    message,
    actions: [
      { label: 'OK', color: 'white' }
    ]
  })
}

export const sortArrayByObjectProperty = (array, objectProperty) => {
  return [ ...array.sort((a, b) => (a[objectProperty] > b[objectProperty]) ? 1 : -1) ]
}

export const formatPrice = (value) => {
  if (isNaN(parseFloat(value))) {
    return value
  }
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0
  })
  return formatter.format(value)
}

export const xy = function(x, y) {
  return [y, x]
}

export const startIcon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 365 560" enable-background="new 0 0 365 560" xml:space="preserve">
    <g>
      <path fill="#42db49" d="M182.9,551.7c0,0.1,0.2,0.3,0.2,0.3S358.3,283,358.3,194.6c0-130.1-88.8-186.7-175.4-186.9   C96.3,7.9,7.5,64.5,7.5,194.6c0,88.4,175.3,357.4,175.3,357.4S182.9,551.7,182.9,551.7z M122.2,187.2c0-33.6,27.2-60.8,60.8-60.8   c33.6,0,60.8,27.2,60.8,60.8S216.5,248,182.9,248C149.4,248,122.2,220.8,122.2,187.2z"/>
    </g>
  </svg>`

export const endIcon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 365 560" enable-background="new 0 0 365 560" xml:space="preserve">
    <g>
      <path fill="#f54242" d="M182.9,551.7c0,0.1,0.2,0.3,0.2,0.3S358.3,283,358.3,194.6c0-130.1-88.8-186.7-175.4-186.9   C96.3,7.9,7.5,64.5,7.5,194.6c0,88.4,175.3,357.4,175.3,357.4S182.9,551.7,182.9,551.7z M122.2,187.2c0-33.6,27.2-60.8,60.8-60.8   c33.6,0,60.8,27.2,60.8,60.8S216.5,248,182.9,248C149.4,248,122.2,220.8,122.2,187.2z"/>
    </g>
  </svg>`

export const swcTime = (dateString) => {
  const time = dateString ? new Date(dateString).getTime() : Date.now()

  // The addition of an extra day (SECONDS_IN_DAY) here is becase we don't start on
  // day 0, we start on day 1
  let timeLeft = Math.floor(time / 1000) + SECONDS_IN_DAY + THOLME_SECONDS_OFFSET - SWC_SECONDS_OFFSET

  const year = Math.floor(timeLeft / SECONDS_IN_YEAR)
  timeLeft -= year * SECONDS_IN_YEAR
  const day = Math.floor(timeLeft / SECONDS_IN_DAY)
  timeLeft -= day * SECONDS_IN_DAY
  const hour = Math.floor(timeLeft / SECONDS_IN_HOUR)
  timeLeft -= hour * SECONDS_IN_HOUR
  const minute = Math.floor(timeLeft / SECONDS_IN_MINUTE)
  timeLeft -= minute * SECONDS_IN_MINUTE
  const second = Math.floor(timeLeft)

  return `Y${year} D${day}, ${hour}:${minute}:${second}`
}
