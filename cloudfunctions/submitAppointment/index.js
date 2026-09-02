// submitAppointment.js - 提交预约
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const res = await db.collection('appointments').add({
      data: {
        ...event,
        openid: wxContext.OPENID,
        status: 'pending',
        created_at: new Date()
      }
    })
    return { code: 0, message: '提交成功', id: res._id }
  } catch (err) {
    console.error('submitAppointment error:', err)
    return { code: -1, message: err.message }
  }
}
