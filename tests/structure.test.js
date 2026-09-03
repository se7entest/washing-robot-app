/**
 * 项目结构验证测试
 * 验证所有必需的文件和目录是否已创建
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')

// 必需的文件列表
const requiredFiles = {
  miniprogram: [
    'app.js',
    'app.json',
    'app.wxss',
    'project.config.json',
    'sitemap.json',
    'pages/index/index.wxml',
    'pages/index/index.wxss',
    'pages/index/index.js',
    'pages/index/index.json',
    'pages/device/device.wxml',
    'pages/device/device.wxss',
    'pages/device/device.js',
    'pages/device/device.json',
    'pages/device-detail/device-detail.wxml',
    'pages/device-detail/device-detail.wxss',
    'pages/device-detail/device-detail.js',
    'pages/device-detail/device-detail.json',
    'pages/case/case.wxml',
    'pages/case/case.wxss',
    'pages/case/case.js',
    'pages/case/case.json',
    'pages/case-detail/case-detail.wxml',
    'pages/case-detail/case-detail.wxss',
    'pages/case-detail/case-detail.js',
    'pages/case-detail/case-detail.json',
    'pages/video/video.wxml',
    'pages/video/video.wxss',
    'pages/video/video.js',
    'pages/video/video.json',
    'pages/video-play/video-play.wxml',
    'pages/video-play/video-play.wxss',
    'pages/video-play/video-play.js',
    'pages/video-play/video-play.json',
    'pages/cooperate/cooperate.wxml',
    'pages/cooperate/cooperate.wxss',
    'pages/cooperate/cooperate.js',
    'pages/cooperate/cooperate.json',
    'pages/appointment/appointment.wxml',
    'pages/appointment/appointment.wxss',
    'pages/appointment/appointment.js',
    'pages/appointment/appointment.json',
    'pages/company/company.wxml',
    'pages/company/company.wxss',
    'pages/company/company.js',
    'pages/company/company.json',
    'utils/request.js',
    'utils/upload.js',
    'utils/util.js'
  ],
  cloudfunctions: [
    'getCompany/index.js',
    'getDevices/index.js',
    'getCases/index.js',
    'getVideos/index.js',
    'getSettings/index.js',
    'submitAppointment/index.js',
    'submitCooperation/index.js'
  ],
  admin: [
    'package.json',
    'vite.config.js',
    'index.html',
    'src/main.js',
    'src/App.vue',
    'src/router/index.js',
    'src/api/index.js',
    'src/views/Login.vue',
    'src/views/Dashboard.vue',
    'src/views/Company.vue',
    'src/views/Device.vue',
    'src/views/Case.vue',
    'src/views/Video.vue',
    'src/views/Appointment.vue',
    'src/views/Cooperate.vue'
  ]
}

// 测试结果
const results = {
  passed: [],
  failed: []
}

// 验证小程序文件
console.log('=== 验证小程序文件 ===')
requiredFiles.miniprogram.forEach(file => {
  const fullPath = path.join(ROOT, 'miniprogram', file)
  if (fs.existsSync(fullPath)) {
    results.passed.push(`miniprogram/${file}`)
    console.log(`  ✓ miniprogram/${file}`)
  } else {
    results.failed.push(`miniprogram/${file}`)
    console.log(`  ✗ miniprogram/${file} 缺失`)
  }
})

// 验证云函数
console.log('\n=== 验证云函数 ===')
requiredFiles.cloudfunctions.forEach(file => {
  const fullPath = path.join(ROOT, 'cloudfunctions', file)
  if (fs.existsSync(fullPath)) {
    results.passed.push(`cloudfunctions/${file}`)
    console.log(`  ✓ cloudfunctions/${file}`)
  } else {
    results.failed.push(`cloudfunctions/${file}`)
    console.log(`  ✗ cloudfunctions/${file} 缺失`)
  }
})

// 验证管理后台
console.log('\n=== 验证管理后台 ===')
requiredFiles.admin.forEach(file => {
  const fullPath = path.join(ROOT, 'admin', file)
  if (fs.existsSync(fullPath)) {
    results.passed.push(`admin/${file}`)
    console.log(`  ✓ admin/${file}`)
  } else {
    results.failed.push(`admin/${file}`)
    console.log(`  ✗ admin/${file} 缺失`)
  }
})

// 打印统计
console.log('\n=== 测试统计 ===')
console.log(`通过: ${results.passed.length}`)
console.log(`失败: ${results.failed.length}`)
console.log(`总计: ${results.passed.length + results.failed.length}`)

// 输出失败列表
if (results.failed.length > 0) {
  console.log('\n失败文件:')
  results.failed.forEach(f => console.log(`  - ${f}`))
}

// 返回结果
module.exports = {
  passed: results.passed,
  failed: results.failed,
  total: results.passed.length + results.failed.length,
  passRate: `${((results.passed.length / (results.passed.length + results.failed.length)) * 100).toFixed(2)}%`
}

// 如果没有被require，直接运行
if (require.main === module) {
  process.exit(results.failed.length > 0 ? 1 : 0)
}
