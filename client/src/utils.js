import { Notify } from 'quasar'

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
  console.log([x, y])
  return [x, y]
}
