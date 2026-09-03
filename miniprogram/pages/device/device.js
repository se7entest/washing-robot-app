// device.js
var request = require('../../utils/request')

Page({
  data: {
    filters: [
      { id: 'all', name: '全部' },
      { id: '飞行器', name: '飞行器' },
      { id: '机器人', name: '机器人' }
    ],
    currentFilter: 'all',
    devices: [],
    loading: false
  },

  onLoad: function() {
    this.loadDevices()
  },

  // 加载设备列表
  loadDevices: function(filter) {
    var self = this
    self.setData({ loading: true })
    request.getList('devices', function(err, allDevices) {
      if (err) {
        // 加载失败
        allDevices = []
      }
      if (filter && filter !== 'all') {
        var filtered = []
        for (var i = 0; i < allDevices.length; i++) {
          if (allDevices[i].category === filter) {
            filtered.push(allDevices[i])
          }
        }
        self.setData({ devices: filtered, loading: false })
      } else {
        self.setData({ devices: allDevices, loading: false })
      }
    })
  },

  // 筛选点击
  onFilterTap: function(e) {
    var id = e.currentTarget.dataset.id
    this.setData({ currentFilter: id })
    this.loadDevices(id)
  },

  // 跳转到设备详情
  goToDetail: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/device-detail/device-detail?id=' + id })
  },

  onGoBack: function() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
