// 测试数据读取功能
const fs = require('fs')
const path = require('path')

console.log('=== GitHub 方案数据测试 ===\n')

const dataDir = path.join(__dirname, '..', 'data')
const jsonFiles = ['company', 'devices', 'cases', 'videos', 'settings', 'appointments', 'cooperations']

let passed = 0
let failed = 0

jsonFiles.forEach(file => {
  const filePath = path.join(dataDir, `${file}.json`)
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(content)
    console.log(`✓ ${file}.json - ${Array.isArray(data) ? data.length + ' 条记录' : '对象数据'}`)
    passed++
  } catch (err) {
    console.log(`✗ ${file}.json - 错误: ${err.message}`)
    failed++
  }
})

console.log(`\n=== 测试结果 ===`)
console.log(`通过: ${passed}/${jsonFiles.length}`)
console.log(`失败: ${failed}`)

process.exit(failed > 0 ? 1 : 0)
