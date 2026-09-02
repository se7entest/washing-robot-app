// utils/util.js - 通用工具函数
/**
 * 格式化日期
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return format.replace('YYYY', year).replace('MM', month).replace('DD', day)
}

/**
 * 手机号校验
 */
function checkPhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 防抖函数
 */
function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 显示提示
 */
function showToast(title, icon = 'none', duration = 2000) {
  wx.showToast({ title, icon, duration })
}

/**
 * 显示加载中
 */
function showLoading(title = '加载中...') {
  wx.showLoading({ title, mask: true })
}

/**
 * 隐藏加载中
 */
function hideLoading() {
  wx.hideLoading()
}

module.exports = {
  formatDate,
  checkPhone,
  debounce,
  showToast,
  showLoading,
  hideLoading
}
