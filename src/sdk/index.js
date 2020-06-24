// SDK functionality
import bucket from './src/bucket'
import data from './src/data'
import storage from './src/storage/index'
import notification from './src/notification'

// Create a new SDK
const sdk = new Object({
  bucket: bucket,
  data: data,
  storage: storage,
  notification: notification
})

export default sdk
