/**
 * 小程序页面配置测试
 * 验证app.json配置正确性
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')

console.log('=== 小程序配置测试 ===\n')

let passed = 0
let failed = 0

// 测试1: app.json存在且有效
try {
  const appJsonPath = path.join(ROOT, 'miniprogram', 'app.json')
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'))

  // 检查页面列表
  const expectedPages = [
    'pages/index/index',
    'pages/company/company',
    'pages/device/device',
    'pages/device-detail/device-detail',
    'pages/case/case',
    'pages/case-detail/case-detail',
    'pages/video/video',
    'pages/cooperate/cooperate',
    'pages/appointment/appointment'
  ]

  console.log('检查页面配置:')
  expectedPages.forEach(page => {
    if (appJson.pages.includes(page)) {
      console.log(`  ✓ ${page}`)
      passed++
    } else {
      console.log(`  ✗ ${page} 未在app.json中配置`)
      failed++
    }
  })

  // 检查tabBar
  console.log('\n检查TabBar配置:')
  if (appJson.tabBar && appJson.tabBar.list) {
    const expectedTabs = ['首页', '设备', '案例', '合作', '预约']
    const actualTabs = appJson.tabBar.list.map(tab => tab.text)
    expectedTabs.forEach(tab => {
      if (actualTabs.includes(tab)) {
        console.log(`  ✓ ${tab}`)
        passed++
      } else {
        console.log(`  ✗ ${tab} 未在TabBar中`)
        failed++
      }
    })
  } else {
    console.log('  ✗ tabBar.list 未配置')
    failed++
  }

  console.log('\n✅ 小程序配置测试完成')
} catch (err) {
  console.log('  ✗ app.json解析失败:', err.message)
  failed++
}

// 测试2: 检查utils工具函数
console.log('\n=== 工具函数测试 ===\n')
try {
  const utilPath = path.join(ROOT, 'miniprogram', 'utils', 'util.js')
  const util = require(utilPath)

  console.log('检查工具函数:')
  const utilFunctions = ['formatDate', 'checkPhone', 'debounce', 'showToast', 'showLoading', 'hideLoading']
  utilFunctions.forEach(fn => {
    if (typeof util[fn] === 'function') {
      console.log(`  ✓ ${fn}`)
      passed++
    } else {
      console.log(`  ✗ ${fn} 不存在或不是函数`)
      failed++
    }
  })

  // 测试checkPhone函数
  console.log('\n测试checkPhone函数:')
  const testPhones = [
    ['13800138000', true],
    ['13912345678', true],
    ['12345', false],
    ['abcdef', false],
    ['', false]
  ]
  testPhones.forEach(([phone, expected]) => {
    const result = util.checkPhone(phone)
    if (result === expected) {
      console.log(`  ✓ checkPhone('${phone}') = ${result}`)
      passed++
    } else {
      console.log(`  ✗ checkPhone('${phone}') = ${result}, 期望 ${expected}`)
      failed++
    }
  })
} catch (err) {
  console.log('  ✗ 工具函数测试失败:', err.message)
  failed++
}

// 测试3: 检查云函数结构
console.log('\n=== 云函数结构测试 ===\n')
try {
  const cloudFunctions = [
    'getCompany',
    'getDevices',
    'getCases',
    'getVideos',
    'getSettings',
    'submitAppointment',
    'submitCooperation'
  ]

  cloudFunctions.forEach(fn => {
    const fnPath = path.join(ROOT, 'cloudfunctions', fn, 'index.js')
    if (fs.existsSync(fnPath)) {
      const content = fs.readFileSync(fnPath, 'utf-8')
      if (content.includes('exports.main')) {
        console.log(`  ✓ ${fn} 结构正确`)
        passed++
      } else {
        console.log(`  ✗ ${fn} 缺少 exports.main`)
        failed++
      }
    } else {
      console.log(`  ✗ ${fn}/index.js 不存在`)
      failed++
    }
  })
} catch (err) {
  console.log('  ✗ 云函数测试失败:', err.message)
  failed++
}

// 测试4: 管理后台路由测试
console.log('\n=== 管理后台路由测试 ===\n')
try {
  const routerPath = path.join(ROOT, 'admin', 'src', 'router', 'index.js')
  const routerContent = fs.readFileSync(routerPath, 'utf-8')

  // 检查根路由和子路由
  const expectedRoutes = ['/login', '/dashboard', '/company', '/device', '/case', '/video', '/appointment', '/cooperate']
  expectedRoutes.forEach(route => {
    // 匹配绝对路径或嵌套路径（path: 'dashboard' 或 path: '/dashboard'）
    const exactMatch = routerContent.includes(`path: '${route}'`)
    const nestedMatch = route !== '/login' && routerContent.includes(`path: '${route.replace('/', '')}'`)
    if (exactMatch || nestedMatch) {
      console.log(`  ✓ 路由 ${route}`)
      passed++
    } else {
      console.log(`  ✗ 路由 ${route} 未配置`)
      failed++
    }
  })
} catch (err) {
  console.log('  ✗ 路由测试失败:', err.message)
  failed++
}

// 最终统计
console.log('\n=== 测试统计 ===')
console.log(`通过: ${passed}`)
console.log(`失败: ${failed}`)
console.log(`总计: ${passed + failed}`)
console.log(`通过率: ${((passed / (passed + failed)) * 100).toFixed(2)}%`)

process.exit(failed > 0 ? 1 : 0)
