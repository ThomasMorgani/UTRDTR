exports.formatResponse = function(status, message, data) {
  return {
    status: status || 'success',
    message: message || 'Default Response',
    data: data || null
  }
}
