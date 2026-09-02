// 管理后台认证配置
// 实际部署时建议通过环境变量或后端服务管理

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
}

export function validateLogin(username, password) {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}

export const TOKEN_KEY = 'admin_token'
