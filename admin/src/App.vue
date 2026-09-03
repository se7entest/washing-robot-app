<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <span>🤖</span>
        <span>清洗机器人</span>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="nav-item" active-class="active">
          <el-icon><DataBoard /></el-icon>
          <span>仪表盘</span>
        </router-link>
        <router-link to="/news" class="nav-item" active-class="active">
          <el-icon><Bell /></el-icon>
          <span>最新动态</span>
        </router-link>
        <router-link to="/device" class="nav-item" active-class="active">
          <el-icon><Cpu /></el-icon>
          <span>设备管理</span>
        </router-link>
        <router-link to="/case" class="nav-item" active-class="active">
          <el-icon><FolderOpened /></el-icon>
          <span>服务案例</span>
        </router-link>
        <router-link to="/video" class="nav-item" active-class="active">
          <el-icon><VideoPlay /></el-icon>
          <span>视频管理</span>
        </router-link>
        <router-link to="/company" class="nav-item" active-class="active">
          <el-icon><School /></el-icon>
          <span>公司简介</span>
        </router-link>
        <router-link to="/appointment" class="nav-item" active-class="active">
          <el-icon><Calendar /></el-icon>
          <span>预约记录</span>
        </router-link>
        <router-link to="/cooperate" class="nav-item" active-class="active">
          <el-icon><Handshake /></el-icon>
          <span>合作意向</span>
        </router-link>
        <router-link to="/settings" class="nav-item" active-class="active">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <el-button type="danger" size="small" @click="handleLogout" style="width: 100%">
          退出登录
        </el-button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { TOKEN_KEY } from './utils/auth'

const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem(TOKEN_KEY)
  router.push('/login')
}
</script>

<!-- Sidebar layout - FINAL v3.0 (2026-09-01 14:00) -->
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}
</style>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* 侧边栏 */
.sidebar {
  width: 220px;
  background: #1a1a2e;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  gap: 8px;
}

.sidebar-logo span:first-child {
  font-size: 22px;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 20px;
  color: #bfcbd9;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.nav-item.active {
  background: rgba(64, 158, 255, 0.15);
  color: #409eff;
  border-left-color: #409eff;
}

.nav-item .el-icon {
  font-size: 16px;
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

/* 主内容区 */
.main-content {
  flex: 1;
  background: #f0f2f5;
  overflow-y: auto;
}
</style>
