// getVideos.js - 获取视频列表
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const res = await db.collection('videos').orderBy('sort', 'asc').get()
    return { code: 0, data: res.data }
  } catch (err) {
    console.error('getVideos error:', err)
    return { code: -1, message: err.message }
  }
}
