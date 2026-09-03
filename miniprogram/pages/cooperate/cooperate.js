// cooperate.js
var request = require('../../utils/request')
var util = require('../../utils/util')

Page({
  data: {
    concept: {
      content: '我们致力于与各方合作伙伴共同成长，通过设备采购、资源合作、技术共享等方式，实现互利共赢。无论是设备采购意向、清洗资源合作，还是技术交流，我们都欢迎各界朋友加入我们。'
    },
    modes: [
      { icon: '🤖', title: '设备采购', desc: '采购我司清洗机器人设备' },
      { icon: '🤝', title: '资源合作', desc: '共享清洗资源与客户渠道' },
      { icon: '💡', title: '技术共赢', desc: '技术交流与联合创新' }
    ],
    advantages: [
      { icon: '⭐', title: '专业团队', desc: '多年行业经验，专业技术支持' },
      { icon: '🔧', title: '设备领先', desc: '自主研发，技术先进' },
      { icon: '📈', title: '市场前景', desc: '幕墙清洗市场需求持续增长' }
    ],
    cooperationTypes: ['设备采购', '资源合作', '技术共赢', '其他'],
    form: {
      name: '',
      phone: '',
      company: '',
      type: '',
      description: ''
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
  onInputDescription: function(e) {
    this.setData({ 'form.description': e.detail.value })
  },
  onTypeChange: function(e) {
    var index = e.detail.value
    this.setData({ 'form.type': this.data.cooperationTypes[index] })
  },

  // 提交合作意向
  submitCooperation: function() {
    var self = this
    var form = this.data.form
    var name = form.name
    var phone = form.phone
    var company = form.company
    var type = form.type
    var description = form.description

    if (!name.trim()) {
      return util.showToast('请输入姓名')
    }
    if (!phone.trim()) {
      return util.showToast('请输入电话号码')
    }
    if (!util.checkPhone(phone)) {
      return util.showToast('请输入正确的手机号')
    }

    // 调用云函数提交
    request.callCloudFunction('submitCooperation', { name: name, phone: phone, company: company, type: type, description: description }, function(err, res) {
      if (err) {
        console.error('提交失败:', err)
        util.showToast('提交失败，请稍后重试')
        return
      }
      util.showToast('提交成功，我们会尽快与您联系！')
      self.setData({
        form: { name: '', phone: '', company: '', type: '', description: '' }
      })
    })
  },

  onGoBack: function() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
