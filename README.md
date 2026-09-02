# 清洗机器人小程序 — 项目说明

> 最后更新：2026-08-28

## 项目状态 ✅ 已完成

所有开发阶段已完成，所有测试已100%通过。

**GitHub 仓库**: https://github.com/se7entest/washing-robot-app
**管理后台登录**: admin / admin123

---

## 一、数据存储方案

本项目使用 **GitHub 仓库** 存储数据，完全免费，永久有效。

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   小程序端       │────▶│  GitHub 仓库    │◀────│  管理后台       │
│  (用户访问)      │     │  (数据存储)     │     │  (PC浏览器)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## 二、项目结构

```
微信小程序端/
├── PRD.md                     # 产品需求文档
├── DEVELOPMENT_PLAN.md        # 开发计划
├── README.md                  # 本文件
│
├── miniprogram/               # 微信小程序端
│   ├── app.js / app.json / app.wxss
│   ├── utils/                 # 工具函数（request.js, upload.js, util.js）
│   ├── assets/
│   │   ├── images/            # 占位图片
│   │   ├── icons/             # TabBar 图标
│   │   └── videos/            # 演示视频（demo.mp4）
│   └── pages/                 # 9个页面
│       ├── index/             # 首页（轮播图 + 快速入口 + 精选案例 + 视频 + 动态）
│       ├── device/            # 设备列表
│       ├── device-detail/     # 设备详情
│       ├── case/              # 案例列表
│       ├── case-detail/       # 案例详情
│       ├── video/             # 视频列表（预留抖音接口）
│       ├── video-play/        # 视频播放页
│       ├── company/           # 公司简介
│       ├── cooperate/         # 合作共赢
│       └── appointment/       # 预约演示表单
│
├── data/                      # 数据文件（自动同步到 GitHub）
│   ├── company.json           # 公司简介
│   ├── devices.json           # 设备列表（2台）
│   ├── cases.json             # 服务案例（3个）
│   ├── videos.json            # 视频列表（1个演示视频）
│   ├── settings.json          # 首页配置（轮播图、快速入口、最新动态）
│   ├── appointments.json      # 预约记录
│   └── cooperations.json      # 合作意向
│
├── cloudfunctions/            # 云函数（预留 CloudBase 接口）
│   ├── getCompany/index.js
│   ├── getDevices/index.js
│   ├── getCases/index.js
│   ├── getVideos/index.js
│   ├── getSettings/index.js
│   ├── submitAppointment/index.js
│   └── submitCooperation/index.js
│
├── admin/                     # 管理后台（Vue 3 + Element Plus + Vite）
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── router/            # 路由配置（含登录守卫）
│       ├── api/               # GitHub REST API 封装
│       ├── utils/             # 认证工具（admin / admin123）
│       └── views/             # 8个管理页面
│           ├── Login.vue
│           ├── Dashboard.vue
│           ├── Company.vue
│           ├── Device.vue
│           ├── Case.vue
│           ├── Video.vue
│           ├── Appointment.vue
│           └── Cooperate.vue
│
└── tests/                     # 测试文件（117项全部通过）
    ├── structure.test.js      # 结构验证（70项）
    ├── config.test.js         # 配置验证（40项）
    └── data.test.js           # 数据验证（7项）
```

---

## 三、快速开始

### 启动管理后台

```bash
cd admin
npm install
npm run dev
```

浏览器打开 http://localhost:5173，使用 admin / admin123 登录。

### 推送数据更新

在 admin 中修改数据后，保存会自动同步到 GitHub。也可手动更新：

```bash
cd "c:/Users/Administrator/Desktop/微信小程序端"
git add data/
git commit -m "更新数据"
git push origin main
```

---

## 四、测试结果

| 测试项 | 结果 |
|--------|------|
| 项目结构验证 | 70/70 通过 |
| 配置验证 | 40/40 通过 |
| 数据文件验证 | 7/7 通过 |
| **总计** | **117/117 全部通过** |

---

## 五、功能说明

### 小程序端
- 首页：轮播图、快速入口（4宫格）、视频演示、精选案例（横向滚动）、最新动态
- 设备：列表展示 + 详情页（参数、功能特点、应用场景）
- 案例：列表展示 + 详情页（挑战、解决方案、客户评价）
- 视频：列表展示，点击跳转播放页（预留抖音接口）
- 合作：合作模式介绍 + 意向提交表单
- 预约：完整表单（姓名/电话/公司/日期时间/地图选点/照片上传）

### 管理后台
- 登录认证（admin / admin123）
- 仪表盘：数据统计（设备/案例/预约/合作数量）
- 公司简介管理
- 设备管理（增删改查）
- 案例管理（增删改查）
- 视频管理（增删改查 + 视频文件上传）
- 预约记录查看（支持导出 CSV）
- 合作意向查看（支持导出 CSV）

---

## 六、预留功能

以下功能已预留接口，后期可按需启用：

| 功能 | 说明 |
|------|------|
| 抖音视频嵌入 | 在 video.js 中接入抖音 API |
| 用户登录/注册 | 在 app.js 中启用 |
| 图片上传 | 使用微信云存储 |
| 短信/邮件通知 | 预留接口 |

---

**项目已准备就绪，管理后台修改数据后小程序端自动同步。**
