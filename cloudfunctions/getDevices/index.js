// getDevices.js - 获取设备列表
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    let query = {}
    if (event.filter && event.filter !== 'all') {
      query.category = event.filter
    }
    const res = await db.collection('devices').orderBy('sort', 'asc').where(query).get()
    return { code: 0, data: res.data }
  } catch (err) {
    console.error('getDevices error:', err)
    return { code: -1, message: err.message }
  }
}
