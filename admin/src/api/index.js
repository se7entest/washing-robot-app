// GitHub API 数据请求封装
// 数据存储在 GitHub 仓库，通过 REST API 读取和写入
// Token 通过后台设置页面配置，存储在 localStorage 中

const GITHUB_REPO = 'se7entest/washing-robot-app'  // 格式：用户名/仓库名
const GITHUB_BRANCH = 'main'
const TOKEN_KEY = 'github_token'
// jsdelivr CDN 地址（读取数据用，国内稳定）
const CDN_BASE = `https://cdn.jsdelivr.net/gh/${GITHUB_REPO}@${GITHUB_BRANCH}`

/**
 * 获取存储的 GitHub Token
 */
function getGithubToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

/**
 * 发送 GitHub API 请求
 */
async function githubRequest(url, options = {}) {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'washing-robot-admin',
    ...options.headers
  }
  const token = getGithubToken()
  if (token) {
    headers['Authorization'] = `token ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  if (!response.ok) {
    throw new Error(`GitHub API 错误: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * 将 base64 字符串解码为 UTF-8 文本（支持中文）
 */
function base64ToUtf8(base64) {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return new TextDecoder('utf-8').decode(bytes)
}

/**
 * 获取仓库内容
 * 返回 { data, sha } 对象，sha用于后续更新操作
 */
async function getRepositoryContent(path) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`
  const response = await githubRequest(url)
  // 返回解析后的数据和原始sha
  if (response.content) {
    const decoded = base64ToUtf8(response.content.replace(/\n/g, ''))
    return {
      data: JSON.parse(decoded),
      sha: response.sha
    }
  }
  return response
}

/**
 * 更新文件内容
 */
async function updateRepositoryContent(path, content, message = 'Update via admin') {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`
  const current = await getRepositoryContent(path)
  const sha = current.sha

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'washing-robot-admin',
      'Authorization': getGithubToken() ? `token ${getGithubToken()}` : '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: message,
      content: btoa(unescape(encodeURIComponent(content))),
      sha: sha,
      branch: GITHUB_BRANCH
    })
  })

  if (!response.ok) {
    throw new Error(`更新失败: ${response.status}`)
  }
  return await response.json()
}

/**
 * 创建文件
 */
async function createRepositoryContent(path, content, message = 'Create via admin') {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'washing-robot-admin',
      'Authorization': getGithubToken() ? `token ${getGithubToken()}` : '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: message,
      content: btoa(unescape(encodeURIComponent(content)))
    })
  })
  return await response.json()
}

// 导出 API 方法
export const api = {
  // 公司简介
  async getCompany() {
    const result = await getRepositoryContent(`data/company.json`)
    return result.data
  },
  async saveCompany(data) {
    return updateRepositoryContent('data/company.json', JSON.stringify(data, null, 2), 'Update company info')
  },

  // 设备
  async getDevices() {
    const result = await getRepositoryContent('data/devices.json')
    return result.data
  },
  async saveDevice(device) {
    const devices = await this.getDevices()
    const index = devices.findIndex(d => d._id === device._id)
    if (index >= 0) {
      devices[index] = device
    } else {
      devices.push(device)
    }
    return updateRepositoryContent('data/devices.json', JSON.stringify(devices, null, 2), `Update device: ${device.name}`)
  },
  async deleteDevice(id) {
    const devices = await this.getDevices()
    const filtered = devices.filter(d => d._id !== id)
    return updateRepositoryContent('data/devices.json', JSON.stringify(filtered, null, 2), `Delete device: ${id}`)
  },

  // 案例
  async getCases() {
    const result = await getRepositoryContent('data/cases.json')
    return result.data
  },
  async saveCase(caseData) {
    const cases = await this.getCases()
    const index = cases.findIndex(c => c._id === caseData._id)
    if (index >= 0) {
      cases[index] = caseData
    } else {
      cases.push(caseData)
    }
    return updateRepositoryContent('data/cases.json', JSON.stringify(cases, null, 2), `Update case: ${caseData.title}`)
  },
  async deleteCase(id) {
    const cases = await this.getCases()
    const filtered = cases.filter(c => c._id !== id)
    return updateRepositoryContent('data/cases.json', JSON.stringify(filtered, null, 2), `Delete case: ${id}`)
  },

  // 视频
  async getVideos() {
    const result = await getRepositoryContent('data/videos.json')
    return result.data
  },
  async saveVideo(video) {
    const videos = await this.getVideos()
    const index = videos.findIndex(v => v._id === video._id)
    if (index >= 0) {
      videos[index] = video
    } else {
      videos.push(video)
    }
    return updateRepositoryContent('data/videos.json', JSON.stringify(videos, null, 2), `Update video: ${video.title}`)
  },
  async deleteVideo(id) {
    const videos = await this.getVideos()
    const filtered = videos.filter(v => v._id !== id)
    return updateRepositoryContent('data/videos.json', JSON.stringify(filtered, null, 2), `Delete video: ${id}`)
  },

  // 预约记录
  async getAppointments() {
    const result = await getRepositoryContent('data/appointments.json')
    return result.data
  },
  async saveAppointment(data) {
    const appointments = await this.getAppointments()
    appointments.unshift({ ...data, _id: `appointment-${Date.now()}`, created_at: new Date().toISOString() })
    return updateRepositoryContent('data/appointments.json', JSON.stringify(appointments, null, 2), 'New appointment')
  },

  // 合作意向
  async getCooperations() {
    const result = await getRepositoryContent('data/cooperations.json')
    return result.data
  },
  async saveCooperation(data) {
    const cooperations = await this.getCooperations()
    cooperations.unshift({ ...data, _id: `cooperation-${Date.now()}`, created_at: new Date().toISOString() })
    return updateRepositoryContent('data/cooperations.json', JSON.stringify(cooperations, null, 2), 'New cooperation')
  },

  // 最新动态
  async getNews() {
    const result = await getRepositoryContent('data/news.json')
    const data = result.data
    return Array.isArray(data) ? data : (data.news || [])
  },
  async saveNews(item) {
    const news = await this.getNews()
    const index = news.findIndex(n => n._id === item._id)
    if (index >= 0) {
      news[index] = item
    } else {
      news.unshift(item)
    }
    return updateRepositoryContent('data/news.json', JSON.stringify({ news }, null, 2), `Update news: ${item.title}`)
  },
  async deleteNews(id) {
    const news = await this.getNews()
    const filtered = news.filter(n => n._id !== id)
    return updateRepositoryContent('data/news.json', JSON.stringify({ news: filtered }, null, 2), `Delete news: ${id}`)
  },

  // 首页配置
  async getSettings() {
    const result = await getRepositoryContent('data/settings.json')
    return result.data
  },
  async saveSettings(data) {
    return updateRepositoryContent('data/settings.json', JSON.stringify(data, null, 2), 'Update settings')
  },

  // 图片上传（上传到仓库 assets/images/ 目录）
  async uploadImage(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const base64 = e.target.result.split(',')[1]
          const fileName = `miniprogram/assets/images/${Date.now()}_${file.name}`
          const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${fileName}`
          const response = await fetch(url, {
            method: 'PUT',
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'Authorization': getGithubToken() ? `token ${getGithubToken()}` : '',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: `Upload image: ${file.name}`,
              content: base64,
              branch: GITHUB_BRANCH
            })
          })
          const result = await response.json()
          if (result.content && result.content.download_url) {
            resolve(result.content.download_url)
          } else if (result.message && result.message.includes('failed')) {
            reject(new Error('上传失败，请检查 Token 权限'))
          } else {
            reject(new Error('上传失败'))
          }
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },

  // 视频上传（直接上传文件到仓库）
  async uploadVideo(file) {
    const fileName = `miniprogram/assets/videos/${file.name}`
    const buffer = await file.arrayBuffer()
    const base64Content = btoa(String.fromCharCode(...new Uint8Array(buffer)))

    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${fileName}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': getGithubToken() ? `token ${getGithubToken()}` : '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Upload video: ${file.name}`,
        content: base64Content,
        branch: GITHUB_BRANCH
      })
    })
    return await response.json()
  },
  GITHUB_REPO,
  GITHUB_BRANCH
}
