

const info = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const error = (error, request, response, next) => {
  console.error(error.message)
  next(error)
}

module.exports = {
  info,
  error
}