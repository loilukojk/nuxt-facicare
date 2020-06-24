// storages
import minio from './minio'
import swift from './swift'

// Create a new storage
const storage = new Object({
    minio: minio,
    swift: swift
})

export default storage
