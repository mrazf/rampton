import cache from 'memory-cache'

export const database = cache

export default {
  get: path => {
    return new Promise(resolve => {
      resolve(cache.get(path))
    })
  },
  put: (path, val) => {
    database.put(path, val)
  },
  clear: () => database.clear()
}
