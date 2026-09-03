// utils/request.js - GitHub 数据请求封装（纯回调风格，无 async/await）
// 数据存储在 GitHub 仓库，通过 jsdelivr CDN 读取（国内稳定访问）

const GITHUB_REPO = 'se7entest/washing-robot-app'
const GITHUB_BRANCH = 'main'
const DATA_PATH = 'data'
const CDN_BASE = 'https://raw.githubusercontent.com/' + GITHUB_REPO + '/' + GITHUB_BRANCH
const MAX_RETRY = 3
const RETRY_DELAY = 1000

/**
 * 从 GitHub 读取 JSON 数据（带重试机制）
 * @param {string} file - 文件名（不含扩展名）
 * @param {Function} callback - (err, data) => {}
 * @param {number} retryCount - 当前重试次数
 */
function getJSON(file, callback, retryCount = 0) {
  var timestamp = Date.now()
  var url = CDN_BASE + '/' + DATA_PATH + '/' + file + '.json?t=' + timestamp

  wx.request({
    url: url,
    method: 'GET',
    timeout: 10000,
    success: function(res) {
      if (res.statusCode === 200 && res.data) {
        callback(null, res.data)
      } else if (retryCount < MAX_RETRY) {
        // 重试
        setTimeout(function() {
          getJSON(file, callback, retryCount + 1)
        }, RETRY_DELAY * (retryCount + 1))
      } else {
        callback(new Error('getJSON failed after ' + MAX_RETRY + ' attempts: ' + file), null)
      }
    },
    fail: function(err) {
      if (retryCount < MAX_RETRY) {
        // 重试
        setTimeout(function() {
          getJSON(file, callback, retryCount + 1)
        }, RETRY_DELAY * (retryCount + 1))
      } else {
        callback(err, null)
      }
    }
  })
}

/**
 * 调用云函数（预留接口）
 */
function callCloudFunction(name, data, callback) {
  if (callback) callback(null, { code: 0, data: {} })
}

/**
 * 获取数据列表
 * @param {string} collection - 集合名
 * @param {Function} callback - (err, list) => {}
 */
function getList(collection, callback) {
  if (typeof collection === 'function') {
    callback = collection
    collection = undefined
  }
  getJSON(collection, function(err, data) {
    if (err) {
      if (callback) callback(null, [])
      return
    }
    if (!data) {
      if (callback) callback(null, [])
      return
    }
    // 支持对象包装格式 { news: [...] } 或直接数组
    if (typeof data === 'object' && !Array.isArray(data)) {
      var keys = Object.keys(data)
      var arrKey = null
      for (var i = 0; i < keys.length; i++) {
        if (Array.isArray(data[keys[i]])) {
          arrKey = keys[i]
          break
        }
      }
      if (callback) callback(null, arrKey ? data[arrKey] : [])
      return
    }
    if (callback) callback(null, Array.isArray(data) ? data : [])
  })
}

/**
 * 获取单条数据（通过 ID）
 * @param {string} collection - 集合名
 * @param {string} docId - 文档ID
 * @param {Function} callback - (err, doc) => {}
 */
function getDoc(collection, docId, callback) {
  getList(collection, function(err, list) {
    if (err || !list || !Array.isArray(list)) {
      if (callback) callback(err, null)
      return
    }
    var doc = null
    for (var i = 0; i < list.length; i++) {
      if (list[i]._id === docId) {
        doc = list[i]
        break
      }
    }
    if (callback) callback(null, doc)
  })
}

/**
 * 获取配置数据
 * @param {string} key - 配置键名
 * @param {Function} callback - (err, value) => {}
 */
function getSetting(key, callback) {
  getJSON('settings', function(err, data) {
    if (err || !data) {
      if (callback) callback(err, null)
      return
    }
    if (callback) callback(null, data[key] || null)
  })
}

module.exports = {
  callCloudFunction: callCloudFunction,
  getJSON: getJSON,
  getList: getList,
  getDoc: getDoc,
  getSetting: getSetting,
  GITHUB_REPO: GITHUB_REPO,
  GITHUB_BRANCH: GITHUB_BRANCH,
  DATA_PATH: DATA_PATH
}
