// device-detail.js
var request = require('../../utils/request')

Page({
  data: {
    device: null
  },

  onLoad: function(options) {
    if (options.id) {
      this.loadDeviceDetail(options.id)
    }
  },

  // 加载设备详情
  loadDeviceDetail: function(id) {
    var self = this
    request.getDoc('devices', id, function(err, device) {
      if (err) {
        console.error('加载设备详情失败:', err)
        wx.showToast({ title: '加载失败', icon: 'none' })
        return
      }
      self.setData({ device: device })
    })
  },

  // 跳转到视频页
  goToVideo: function() {
    wx.navigateTo({ url: '/pages/video/video' })
  },

  onGoBack: function() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
