// app.js - 应用入口
App({
  globalData: {
    // GitHub 仓库配置（用户需替换为实际仓库）
    githubRepo: 'your-username/your-repo',
    githubBranch: 'main',
    // 预留用户登录状态
    userInfo: null,
    isLoggedIn: false
  },

  onLaunch() {
    console.log('App launched')
  }
})
