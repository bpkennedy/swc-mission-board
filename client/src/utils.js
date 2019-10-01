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
