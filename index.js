/**
 * Awaits a Promise or and catches errors, then calls Nunjucks' callback function
 * @param {Promise} functionPromise - An unresolved Promise, usually from an async function
 * @param {function} callback - Nunjuck's async filter callback function
 */
async function awaitFilter (functionPromise, callback) {
  try {
    // The called function is a Promise
    const result = await functionPromise
    callback(null, result)
  } catch (error) {
    callback(error)
  }
}

/**
 * Adds the filter to the provided Nunjucks environment
 * @param {object} environment - Nunjucks environment object
 */
module.exports = environment => environment.addFilter('await', awaitFilter, true)
