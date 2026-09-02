// appointment.js
var request = require('../../utils/request')
var util = require('../../utils/util')

Page({
  data: {
    timeSlots: ['上午 9:00-12:00', '下午 14:00-17:00', '下午 17:00-20:00'],
    form: {
      name: '',
      phone: '',
      company: '',
      date: '',
      time: '',
      location_name: '',
      location_lat: null,
      location_lng: null,
      photos: []
    }
  },

  // 表单输入处理
  onInputName: function(e) {
    this.setData({ 'form.name': e.detail.value })
  },
  onInputPhone: function(e) {
    this.setData({ 'form.phone': e.detail.value })
  },
  onInputCompany: function(e) {
    this.setData({ 'form.company': e.detail.value })
  },
  onDateChange: function(e) {
    this.setData({ 'form.date': e.detail.value })
  },
  onTimeChange: function(e) {
    var index = e.detail.value
    this.setData({ 'form.time': this.data.timeSlots[index] })
  },

  // 选择地点
  chooseLocation: function() {
    var self = this
    wx.chooseLocation({
      success: function(res) {
        self.setData({
          'form.location_name': res.name || res.address,
          'form.location_lat': res.latitude,
          'form.location_lng': res.longitude
        })
      },
      fail: function(err) {
        console.error('选择地点失败:', err)
        if (err.errMsg !== 'chooseLocation:fail auth deny') {
          util.showToast('选择地点失败，请重试')
        }
      }
    })
  },

  // 选择照片
  choosePhoto: function() {
    var self = this
    var remaining = 9 - this.data.form.photos.length
    wx.chooseMedia({
      count: remaining,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var photos = self.data.form.photos
        for (var i = 0; i < res.tempFiles.length; i++) {
          if (photos.length < 9) {
            photos.push(res.tempFiles[i].tempFilePath)
          }
        }
        self.setData({ 'form.photos': photos })
      }
    })
  },

  // 预览照片
  previewPhoto: function(e) {
    var index = e.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.form.photos[index],
      urls: this.data.form.photos
    })
  },

  // 删除照片
  deletePhoto: function(e) {
    var index = e.currentTarget.dataset.index
    var photos = this.data.form.photos
    photos.splice(index, 1)
    this.setData({ 'form.photos': photos })
  },

  // 提交预约
  submitAppointment: function() {
    var self = this
    var form = this.data.form
    var name = form.name
    var phone = form.phone
    var company = form.company
    var date = form.date
    var time = form.time
    var location_name = form.location_name
    var location_lat = form.location_lat
    var location_lng = form.location_lng
    var photos = form.photos

    // 表单验证
    if (!name.trim()) {
      return util.showToast('请输入姓名')
    }
    if (!phone.trim()) {
      return util.showToast('请输入电话号码')
    }
    if (!util.checkPhone(phone)) {
      return util.showToast('请输入正确的手机号')
    }
    if (!date) {
      return util.showToast('请选择预约日期')
    }
    if (!time) {
      return util.showToast('请选择预约时间')
    }
    if (!location_name) {
      return util.showToast('请选择预约地点')
    }

    // 显示加载中
    wx.showLoading({ title: '提交中...', mask: true })

    // 提交预约
    request.callCloudFunction('submitAppointment', {
      name: name,
      phone: phone,
      company: company,
      date: date,
      time: time,
      location_name: location_name,
      location_lat: location_lat,
      location_lng: location_lng,
      photos: photos.slice()
    }, function(err, res) {
      wx.hideLoading()
      if (err) {
        console.error('提交预约失败:', err)
        util.showToast('提交失败，请稍后重试')
        return
      }
      util.showToast('预约成功！我们会尽快与您联系')
      self.setData({
        form: {
          name: '',
          phone: '',
          company: '',
          date: '',
          time: '',
          location_name: '',
          location_lat: null,
          location_lng: null,
          photos: []
        }
      })
    })
  },

  onGoBack: function() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
