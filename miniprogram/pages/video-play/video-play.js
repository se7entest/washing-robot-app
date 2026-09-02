// video-play.js
Page({
  data: {
    videoUrl: '',
    title: '',
    description: '',
    publishDate: '',
    poster: '',
    duration: ''
  },

  onLoad(options) {
    const videoUrl = decodeURIComponent(options.url || '')
    const title = decodeURIComponent(options.title || '视频')
    const description = decodeURIComponent(options.description || '')
    const publishDate = decodeURIComponent(options.date || '')
    const poster = decodeURIComponent(options.poster || '/assets/images/video-placeholder.png')
    this.setData({ videoUrl, title, description, publishDate, poster })
  },

  onReady() {
    this.videoCtx = wx.createVideoContext('mainVideo')
  },

  onTimeUpdate(e) {
    const { currentTime, duration } = e.detail
    if (duration > 0) {
      const m = Math.floor(duration / 60)
      const s = Math.floor(duration % 60)
      this.setData({
        duration: `${m}:${s.toString().padStart(2, '0')}`
      })
    }
  },

  // 返回
  onGoBack() {
    wx.navigateBack()
  },

  // 视频播放结束
  onVideoEnd() {
  }
})
