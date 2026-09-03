// getSettings.js - 获取首页配置
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const res = await db.collection('settings').where({}).limit(1).get()
    return { code: 0, data: res.data[0] || null }
  } catch (err) {
    console.error('getSettings error:', err)
    return { code: -1, message: err.message }
  }
}
