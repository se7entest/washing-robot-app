// case.js
var request = require('../../utils/request')

Page({
  data: {
    filters: [
      { id: 'all', name: '全部' },
      { id: 'mall', name: '商业综合体' },
      { id: 'office', name: '写字楼' },
      { id: 'hotel', name: '酒店' },
      { id: 'hospital', name: '医院' }
    ],
    currentFilter: 'all',
    cases: []
  },

  onLoad: function() {
    this.loadCases()
  },

  // 加载案例列表
  loadCases: function() {
    var self = this
    request.getList('cases', function(err, cases) {
      if (err) {
        // 加载失败
        cases = []
      }
      self.setData({ cases: cases })
    })
  },

  // 筛选点击
  onFilterTap: function(e) {
    var id = e.currentTarget.dataset.id
    this.setData({ currentFilter: id })
    this.loadCases(id)
  },

  // 跳转到案例详情
  goToDetail: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/case-detail/case-detail?id=' + id })
  },

  onGoBack: function() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
