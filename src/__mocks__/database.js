import cache from 'memory-cache'
import * as R from 'ramda'

export const database = cache

export default {
  get: path => {
    return new Promise(resolve => {
      const parts = path.split('/')

      const [root, rest] = R.splitAt(1, parts)
      const rootTree = cache.get(root)

      resolve(R.path(rest, rootTree))
    })
  },
  put: (path, val) => {
    database.put(path, val)
  },
  clear: () => database.clear()
}
