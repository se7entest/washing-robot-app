// utils/upload.js - 图片上传封装
// 使用微信云存储上传（需要开通云开发），或使用图床服务

/**
 * 上传单张图片到微信云存储
 * @param {string} filePath - 本地文件路径
 * @param {string} fileName - 存储路径
 * @param {function} callback - 回调函数 (err, url)
 */
function uploadImage(filePath, fileName, callback) {
  if (wx.cloud) {
    wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: filePath
    }, function(err, res) {
      if (err) {
        if (callback) callback(err, null)
        return
      }
      if (callback) callback(null, res.fileID)
    })
  } else {
    if (callback) callback(null, filePath)
  }
}

/**
 * 上传多张图片
 * @param {string[]} filePaths - 本地文件路径数组
 * @param {string} dir - 云存储目录
 * @param {function} callback - 回调函数 (err, urls)
 */
function uploadImages(filePaths, dir, callback) {
  if (!filePaths || filePaths.length === 0) {
    if (callback) callback(null, [])
    return
  }

  var results = []
  var count = filePaths.length
  var completed = 0

  function checkDone() {
    completed++
    if (completed >= count) {
      if (callback) callback(null, results)
    }
  }

  for (var i = 0; i < filePaths.length; i++) {
    var path = filePaths[i]
    var fileName = dir + '/' + Date.now() + '_' + i + '.jpg'
    uploadImage(path, fileName, function(err, url) {
      if (err) {
        // 上传失败
      } else {
        results.push(url)
      }
      checkDone()
    })
  }
}

module.exports = {
  uploadImage: uploadImage,
  uploadImages: uploadImages
}
