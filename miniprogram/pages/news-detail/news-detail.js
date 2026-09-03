// news-detail.js
var request = require('../../utils/request')

Page({
  data: {
    news: null,
    error: ''
  },

  onLoad: function(options) {
    var id = options.id
    if (id) {
      this.loadNews(id)
    } else {
      this.setData({ error: '参数错误' })
    }
  },

  // 加载新闻详情
  loadNews: function(id) {
    var self = this
    request.getList('news', function(err, newsList) {
      if (err) {
        self.setData({ error: '加载失败' })
        return
      }
      // news.json 是 {news: [...]} 格式
      var items = newsList.news || []
      var news = null
      for (var i = 0; i < items.length; i++) {
        if (items[i]._id === id) {
          news = items[i]
          break
        }
      }
      if (news) {
        self.setData({ news: news })
      } else {
        self.setData({ error: '新闻不存在' })
      }
    })
  },

  // 返回
  onGoBack: function() {
    wx.navigateBack()
  },

  // 获取类型标签
  getTypeLabel: function(type) {
    var map = { article: '📰 文章', video: '🎬 视频', device: '🤖 设备' }
    return map[type] || type
  }
})
