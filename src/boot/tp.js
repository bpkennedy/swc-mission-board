const types = [
  'array',
  'object',
  'string',
  'date',
  'regexp',
  'function',
  'boolean',
  'number',
  'null',
  'undefined'
]

function assertType (value, type) {
  if (types.includes(type)) {
    if (Object.prototype.toString.call(value).slice(8, -1).toLowerCase() === type) {
      return true
    }
  }
  return false
}

function getPossibleTypesFromTypeString (typeString) {
  const possibleTypes = []
  if (typeString.indexOf('|') > -1) {
    typeString.split('|').map(type => possibleTypes.push(type.toLowerCase()))
  } else {
    possibleTypes.push(typeString.toLowerCase())
  }
  return possibleTypes
}

function throwInvalidShape () {
  throw new Error('Vue.prototype.$tp error: param must be an Array of objects, like [{ value: someVariable, type: \'Object|Null\' }]')
}

function tp (options) {
  const isValidOptions = assertType(options, 'array')
  if (isValidOptions) {
    for (const option of options) {
      const isValidOption = assertType(option, 'object')
      if (isValidOption) {
        const possibleTypes = getPossibleTypesFromTypeString(option.type)
        const errors = []
        for (const [i, type] of possibleTypes.entries()) {
          if (assertType(option.value, type)) {
            return true
          } else {
            errors.push(new Error(`Vue.prototype.$tp error: ${JSON.stringify(option.value)} IS NOT OF TYPE ${type}.`))
          }
          if (i === possibleTypes.length - 1) {
            if (errors.length > 0) {
              throw new Error(`Vue.prototype.$tp error: ${errors.join(', ')}`)
            }
          }
        }
      } else {
        throwInvalidShape()
      }
    }
  }
  throwInvalidShape()
}

export default async ({ Vue }) => {
  Vue.prototype.$tp = tp
}
