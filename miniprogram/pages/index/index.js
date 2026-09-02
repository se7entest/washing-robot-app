// index.js
var request = require('../../utils/request')

Page({
  data: {
    banners: [],
    quickLinks: [],
    cases: [],
    news: [],
    videos: []
  },

  onLoad: function() {
    this.loadHomeData()
  },

  onShow: function() {},

  // 加载首页数据
  loadHomeData: function() {
    var self = this
    request.getJSON('settings', function(err, settings) {
      if (err) {
        // 加载失败
        settings = null
      }
      request.getList('cases', function(err, cases) {
        if (err) cases = []
        request.getList('news', function(err, news) {
          if (err) news = []
          request.getList('videos', function(err, videos) {
            if (err) videos = []
            // 快捷入口：保留 icon 字段
            var quickLinks = []
            if (settings && settings.quick_links) {
              var links = settings.quick_links
              for (var i = 0; i < links.length; i++) {
                var l = links[i]
                quickLinks.push({
                  icon: l.icon || '',
                  title: l.title || '',
                  page: l.page && l.page.startsWith('/') ? l.page : '/' + l.page
                })
              }
            }
            self.setData({
              banners: (settings && settings.banners) ? settings.banners : [],
              quickLinks: quickLinks,
              cases: cases ? cases.slice(0, 5) : [],
              news: news,
              videos: videos
            })
          })
        })
      })
    })
  },

  // 轮播图点击
  onBannerTap: function(e) {
    var link = e.currentTarget.dataset.link
    if (link) {
      this._navigate(link)
    }
  },

  // 快速入口点击
  onQuickLinkTap: function(e) {
    var page = e.currentTarget.dataset.page
    this._navigate(page)
  },

  // 统一跳转
  _navigate: function(url) {
    var tabBarPages = ['/pages/device/device', '/pages/case/case', '/pages/cooperate/cooperate', '/pages/appointment/appointment']
    if (tabBarPages.indexOf(url) !== -1) {
      wx.switchTab({ url: url })
    } else {
      wx.navigateTo({ url: url })
    }
  },

  // 跳转到案例列表
  goToCases: function() {
    wx.switchTab({ url: '/pages/case/case' })
  },

  // 跳转到案例详情
  goToCaseDetail: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/case-detail/case-detail?id=' + id })
  },

  // 跳转到视频页
  goToVideo: function() {
    wx.navigateTo({ url: '/pages/video/video' })
  },

  getTypeLabel: function(type) {
    var map = { article: '📰 文章', video: '🎬 视频', device: '🤖 设备' }
    return map[type] || type
  }
})
