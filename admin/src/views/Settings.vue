<template>
  <div class="page-container">
    <div class="page-header">
      <h2>系统设置</h2>
    </div>

    <el-card class="settings-card">
      <template #header>
        <span>GitHub 访问令牌</span>
      </template>

      <el-form label-width="200px">
        <el-form-item label="Personal Access Token (PAT)">
          <el-input
            v-model="token"
            type="password"
            show-password
            placeholder="请输入 GitHub Personal Access Token"
          />
        </el-form-item>

        <el-form-item label="说明">
          <div class="token-info">
            <p>1. 访问 <a href="https://github.com/settings/tokens" target="_blank">GitHub 设置</a> → Developer settings → Personal access tokens</p>
            <p>2. 点击 "Generate new token (classic)"</p>
            <p>3. 勾选 <strong>repo</strong> 权限（完整仓库访问）</p>
            <p>4. 复制生成的 Token 粘贴到上方</p>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveToken" :loading="saving">保存 Token</el-button>
          <el-button @click="testToken" :loading="testing">测试连接</el-button>
        </el-form-item>
      </el-form>

      <el-alert
        v-if="testResult"
        :title="testResult.success ? '连接成功！' : '连接失败：' + testResult.error"
        :type="testResult.success ? 'success' : 'error'"
        :closable="false"
        style="margin-top: 20px"
      />
    </el-card>

    <el-card class="settings-card" style="margin-top: 20px">
      <template #header>
        <span>Token 状态</span>
      </template>

      <div class="token-status">
        <el-tag :type="hasToken ? 'success' : 'danger'" size="large">
          {{ hasToken ? '已配置' : '未配置' }}
        </el-tag>
        <span style="margin-left: 10px; color: #666">
          {{ hasToken ? '后台可以写入数据到 GitHub' : '需要配置 Token 才能保存数据' }}
        </span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const token = ref(localStorage.getItem('github_token') || '')
const saving = ref(false)
const testing = ref(false)
const testResult = ref(null)

const TOKEN_KEY = 'github_token'

const hasToken = computed(() => {
  return localStorage.getItem(TOKEN_KEY) !== null
})

onMounted(() => {
  const saved = localStorage.getItem(TOKEN_KEY)
  if (saved) {
    token.value = saved
  }
})

const saveToken = async () => {
  if (!token.value) {
    ElMessage.warning('请输入 Token')
    return
  }

  saving.value = true
  try {
    localStorage.setItem(TOKEN_KEY, token.value)
    ElMessage.success('Token 保存成功')
    testResult.value = { success: true, message: 'Token 已保存' }
  } catch (err) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

const testToken = async () => {
  if (!token.value) {
    ElMessage.warning('请先输入 Token')
    return
  }

  testing.value = true
  testResult.value = null

  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token.value}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      testResult.value = { success: true, message: `连接成功！用户: ${data.login}` }
      ElMessage.success('Token 有效')
    } else {
      const error = await response.json()
      testResult.value = { success: false, error: error.message }
      ElMessage.error('Token 无效或权限不足')
    }
  } catch (err) {
    testResult.value = { success: false, error: err.message }
    ElMessage.error('网络错误')
  } finally {
    testing.value = false
  }
}
</script>

<style scoped>
.page-container {
  padding: 20px;
}
.page-header {
  margin-bottom: 20px;
}
.page-header h2 {
  color: #333;
}
.settings-card {
  max-width: 800px;
}
.token-info {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}
.token-info a {
  color: #409eff;
  text-decoration: none;
}
.token-info a:hover {
  text-decoration: underline;
}
.token-info p {
  margin: 5px 0;
}
.token-status {
  display: flex;
  align-items: center;
}
</style>
