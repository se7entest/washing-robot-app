// company.js
var request = require('../../utils/request')

Page({
  data: {
    company: null
  },

  onLoad: function() {
    this.loadCompany()
  },

  // 加载公司简介
  loadCompany: function() {
    var self = this
    request.getJSON('company', function(err, company) {
      if (err) {
        console.error('[company] 加载异常:', err)
        return
      }
      if (company) {
        self.setData({ company: company })
      } else {
        console.error('[company] 加载失败：company 为 null')
      }
    })
  },

  onGoBack: function() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
