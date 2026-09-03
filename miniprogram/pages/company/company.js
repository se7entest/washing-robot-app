// company.js
var request = require('../../utils/request')

Page({
  data: {
    company: null,
    banners: []
  },

  onLoad: function() {
    this.loadCompany()
    this.loadBanners()
  },

  // 加载公司简介
  loadCompany: function() {
    var self = this
    request.getJSON('company', function(err, company) {
      if (err) {
        company = null
      }
      self.setData({ company: company })
    })
  },

  // 加载轮播图
  loadBanners: function() {
    var self = this
    request.getJSON('settings', function(err, settings) {
      if (err) {
        settings = null
      }
      var banners = []
      if (settings && settings.banners) {
        banners = settings.banners
      }
      self.setData({ banners: banners })
    })
  },

  // 轮播图点击
  onBannerTap: function(e) {
    var link = e.currentTarget.dataset.link
    if (link) {
      wx.navigateTo({ url: link })
    }
  },

  onGoBack: function() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
