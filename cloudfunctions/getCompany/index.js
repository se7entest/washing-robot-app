// getCompany.js - 获取公司简介
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const res = await db.collection('company').where({}).limit(1).get()
    return { code: 0, data: res.data[0] || null }
  } catch (err) {
    console.error('getCompany error:', err)
    return { code: -1, message: err.message }
  }
}
