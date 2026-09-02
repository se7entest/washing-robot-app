// case-detail.js
var request = require('../../utils/request')

Page({
  data: {
    case: null
  },

  onLoad: function(options) {
    if (options.id) {
      this.loadCaseDetail(options.id)
    }
  },

  // 加载案例详情
  loadCaseDetail: function(id) {
    var self = this
    request.getDoc('cases', id, function(err, caseData) {
      if (err) {
        console.error('加载案例详情失败:', err)
        wx.showToast({ title: '加载失败', icon: 'none' })
        return
      }
      self.setData({ case: caseData })
    })
  }
})
