// video.js
var request = require('../../utils/request')

Page({
  data: {
    videos: []
  },

  onLoad: function() {
    this.loadVideos()
  },

  // 加载视频列表
  loadVideos: function() {
    var self = this
    request.getList('videos', function(err, videos) {
      if (err) {
        console.error('[video] 加载异常:', err)
        videos = []
      }
      self.setData({ videos: videos || [] })
    })
  },

  // 视频点击 - 跳转到播放页
  onVideoTap: function(e) {
    var id = e.currentTarget.dataset.id
    var videos = this.data.videos
    var video = null
    for (var i = 0; i < videos.length; i++) {
      if (videos[i]._id === id) {
        video = videos[i]
        break
      }
    }
    if (video && video.video_url) {
      var poster = video.thumbnail || '/assets/images/video-placeholder.png'
      wx.navigateTo({
        url: '/pages/video-play/video-play?url=' + encodeURIComponent(video.video_url) + '&title=' + encodeURIComponent(video.title) + '&description=' + encodeURIComponent(video.description || '') + '&date=' + encodeURIComponent(video.publish_date || '') + '&poster=' + encodeURIComponent(poster)
      })
    }
  }
})
