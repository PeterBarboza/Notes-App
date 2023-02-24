type error = {
  [key: string]: string[]
}

type errorsArray = error[]

export function parseErrorsArray(errors: errorsArray) {
  return errors.reduce((previousError, currentError) => {
    const parsedErrorsMessage = Object.entries(currentError).reduce((previousMessage, currentMessage) => {
      const errorMessages = currentMessage[1].join("; ")

      if(previousMessage.length > 0) {
        return `${previousMessage}; ${errorMessages}`
      }
      
      return errorMessages
    }, "")

    if(previousError.length > 0) {
      return `${previousError}; ${parsedErrorsMessage}`
    }

    return parsedErrorsMessage
  }, "")
}