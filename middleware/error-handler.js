const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  if (err && err.code == 11000) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: `Duplicate value entered for ${Object.keys(err.keyValue).join(", ")} field, please choose another value`
    })
  }
  if (err.name === 'ValidationError') {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: err.message })
  }
  if (err.name === 'CastError') {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: `No item found with id : ${err.value}` })
  }
  if (err.type === 'entity.parse.failed') {
  return res.status(StatusCodes.BAD_REQUEST).json({
    msg: 'Invalid JSON format in request body'
  });
}
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Something went wrong, please try again later.' })
}

module.exports = errorHandlerMiddleware
