import ExtendableError from 'es6-error'

class InvalidTransactionError extends ExtendableError {
  constructor (message = 'no message specified') {
    super(message)
  }
}

export default InvalidTransactionError
