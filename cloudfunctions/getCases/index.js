// getCases.js - 获取案例列表
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const res = await db.collection('cases').orderBy('sort', 'asc').get()
    return { code: 0, data: res.data }
  } catch (err) {
    console.error('getCases error:', err)
    return { code: -1, message: err.message }
  }
}
