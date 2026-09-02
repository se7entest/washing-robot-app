# 微信小程序端 — 开发计划

> 基于 PRD.md v1.0 制定  
> 制定日期：2026-08-27  
> 状态：待执行

---

## 一、技术栈选择

| 层级 | 技术选型 | 理由 |
|------|----------|------|
| 微信小程序端 | 原生小程序（WXML + WXSS + JS） | 无需额外框架，微信官方支持最完善，性能最优 |
| 管理后台 | Vue 3 + Element Plus + Vite | 开发效率高，组件丰富，适合表单型管理后台 |
| 云端服务 | 腾讯云 CloudBase | 与小程序原生集成，免费版够用，无需服务器/域名 |
| 数据库 | CloudBase 云数据库（JSON） | 天然支持JSON，实时同步，免运维 |
| 对象存储 | CloudBase 云存储 | 存储图片/视频，自动CDN分发 |
| 云函数 | CloudBase 云函数 | 处理复杂业务逻辑（预约通知等） |

---

## 二、项目目录结构

```
微信小程序端/
│
├── PRD.md                          # 产品需求文档
├── DEVELOPMENT_PLAN.md             # 本开发计划
│
├── miniprogram/                    # 微信小程序端
│   ├── app.js                      # 应用入口
│   ├── app.json                    # 应用配置
│   ├── app.wxss                    # 全局样式
│   ├── project.config.json         # 微信开发者工具配置
│   ├── sitemap.json                # 小程序索引配置
│   ├── utils/                      # 工具函数
│   │   ├── request.js              # 云数据库请求封装
│   │   ├── upload.js               # 云存储上传封装
│   │   └── util.js                 # 通用工具函数
│   ├── pages/
│   │   ├── index/                  # 首页
│   │   │   ├── index.wxml
│   │   │   ├── index.wxss
│   │   │   ├── index.js
│   │   │   └── index.json
│   │   ├── company/                # 公司简介
│   │   │   ├── company.wxml
│   │   │   ├── company.wxss
│   │   │   ├── company.js
│   │   │   └── company.json
│   │   ├── device/                 # 设备列表
│   │   │   ├── device.wxml
│   │   │   ├── device.wxss
│   │   │   ├── device.js
│   │   │   └── device.json
│   │   ├── device-detail/          # 设备详情
│   │   │   ├── device-detail.wxml
│   │   │   ├── device-detail.wxss
│   │   │   ├── device-detail.js
│   │   │   └── device-detail.json
│   │   ├── case/                   # 案例列表
│   │   │   ├── case.wxml
│   │   │   ├── case.wxss
│   │   │   ├── case.js
│   │   │   └── case.json
│   │   ├── case-detail/            # 案例详情
│   │   │   ├── case-detail.wxml
│   │   │   ├── case-detail.wxss
│   │   │   ├── case-detail.js
│   │   │   └── case-detail.json
│   │   ├── video/                  # 视频列表
│   │   │   ├── video.wxml
│   │   │   ├── video.wxss
│   │   │   ├── video.js
│   │   │   └── video.json
│   │   ├── co operate/             # 合作共赢
│   │   │   ├── co operate.wxml
│   │   │   ├── co operate.wxss
│   │   │   ├── co operate.js
│   │   │   └── co operate.json
│   │   └── appointment/            # 预约演示服务
│   │       ├── appointment.wxml
│   │       ├── appointment.wxss
│   │       ├── appointment.js
│   │       └── appointment.json
│   ├── components/                 # 公共组件
│   │   ├── navbar/                 # 顶部导航栏
│   │   ├── tabbar/                 # 底部Tab栏
│   │   └── loading/                # 加载状态组件
│   └── assets/                     # 静态资源
│       ├── images/                 # 图片资源
│       └── icons/                  # 图标资源
│
├── admin/                          # 网页管理后台
│   ├── package.json                # Node.js依赖
│   ├── vite.config.js              # Vite配置
│   ├── index.html                  # 入口HTML
│   └── src/
│       ├── main.js                 # 应用入口
│       ├── App.vue                 # 根组件
│       ├── router/                 # 路由配置
│       │   └── index.js
│       ├── views/                  # 页面组件
│       │   ├── Login.vue           # 登录页
│       │   ├── Dashboard.vue       # 仪表盘
│       │   ├── Company.vue         # 公司简介管理
│       │   ├── Device.vue          # 设备管理
│       │   ├── Case.vue            # 案例管理
│       │   ├── Video.vue           # 视频管理
│       │   ├── Appointment.vue     # 预约记录查看
│       │   └── Co operate.vue      # 合作意向管理
│       ├── components/             # 公共组件
│       │   ├── Sidebar.vue         # 侧边栏
│       │   ├── Header.vue          # 顶部栏
│       │   └── DataTable.vue       # 数据表格组件
│       ├── api/                    # API请求
│       │   └── index.js
│       └── utils/                  # 工具函数
│           └── request.js
│
└── cloudfunctions/                 # CloudBase云函数
    ├── appointmentNotify/          # 预约通知云函数
    │   └── index.js
    └── initData/                   # 初始化数据云函数
        └── index.js
```

---

## 三、云端数据库设计

### 3.1 集合（Collection）列表

| 集合名称 | 用途 | 权限 |
|----------|------|------|
| company | 公司简介内容 | 公开读，管理员写 |
| devices | 设备信息 | 公开读，管理员写 |
| cases | 服务案例 | 公开读，管理员写 |
| videos | 视频信息 | 公开读，管理员写 |
| appointments | 预约记录 | 管理员读，用户写 |
| cooperations | 合作意向 | 管理员读，用户写 |
| settings | 首页配置（轮播图等） | 公开读，管理员写 |
| admins | 管理员账号 | 私有 |

### 3.2 各集合字段设计

#### company 集合

```json
{
  "_id": "自动生成",
  "content": "公司介绍文字（富文本）",
  "history": [
    { "year": "2020", "event": "公司发展事件" }
  ],
  "culture_title": "企业文化标题",
  "culture_content": "企业文化描述",
  "certificates": ["图片URL1", "图片URL2"],
  "updated_at": "2026-08-27T10:00:00Z"
}
```

#### devices 集合

```json
{
  "_id": "自动生成",
  "name": "设备名称",
  "image": "主图URL",
  "images": ["图片URL1", "图片URL2"],
  "specs": [
    { "name": "高度", "value": "XX米" },
    { "name": "重量", "value": "XXkg" }
  ],
  "features": ["功能特点1", "功能特点2"],
  "scenes": [
    { "title": "应用场景标题", "description": "描述文字", "image": "图片URL" }
  ],
  "sort": 0,
  "created_at": "2026-08-27T10:00:00Z",
  "updated_at": "2026-08-27T10:00:00Z"
}
```

#### cases 集合

```json
{
  "_id": "自动生成",
  "title": "案例标题",
  "image": "案例图片URL",
  "location": "项目地点",
  "date": "2026-08-27",
  "challenge": "挑战描述",
  "solution": "解决方案",
  "review": "客户评价（可选）",
  "sort": 0,
  "created_at": "2026-08-27T10:00:00Z",
  "updated_at": "2026-08-27T10:00:00Z"
}
```

#### videos 集合

```json
{
  "_id": "自动生成",
  "title": "视频标题",
  "video_url": "视频链接（预留抖音接口）",
  "description": "视频简介",
  "publish_date": "2026-08-27",
  "sort": 0,
  "created_at": "2026-08-27T10:00:00Z",
  "updated_at": "2026-08-27T10:00:00Z"
}
```

#### appointments 集合

```json
{
  "_id": "自动生成",
  "name": "姓名",
  "phone": "电话号码",
  "company": "公司名称",
  "date": "预约日期",
  "time": "预约时间段",
  "location_name": "预约地点名称",
  "location_lat": 纬度,
  "location_lng": 经度,
  "photos": ["照片URL1", "照片URL2"],
  "status": "pending",
  "created_at": "2026-08-27T10:00:00Z"
}
```

#### cooperations 集合

```json
{
  "_id": "自动生成",
  "name": "姓名",
  "phone": "电话号码",
  "company": "公司名称",
  "type": "合作类型",
  "description": "合作意向描述",
  "created_at": "2026-08-27T10:00:00Z"
}
```

#### settings 集合

```json
{
  "_id": "自动生成",
  "banners": [
    { "image": "图片URL", "link": "跳转链接" }
  ],
  "quick_links": [
    { "icon": "图标", "title": "标题", "page": "页面路径" }
  ],
  "highlights": [
    { "title": "标题", "content": "内容" }
  ],
  "updated_at": "2026-08-27T10:00:00Z"
}
```

#### admins 集合

```json
{
  "_id": "自动生成",
  "username": "管理员用户名",
  "password_hash": "加密后的密码",
  "created_at": "2026-08-27T10:00:00Z"
}
```

---

## 四、API接口设计

### 4.1 小程序端接口（通过云函数调用）

| 接口 | 方法 | 说明 |
|------|------|------|
| `getCompany` | 云函数 | 获取公司简介 |
| `getDevices` | 云函数 | 获取设备列表 |
| `getDeviceDetail` | 云函数 | 获取设备详情 |
| `getCases` | 云函数 | 获取案例列表 |
| `getCaseDetail` | 云函数 | 获取案例详情 |
| `getVideos` | 云函数 | 获取视频列表 |
| `getSettings` | 云函数 | 获取首页配置 |
| `submitAppointment` | 云函数 | 提交预约 |
| `submitCooperation` | 云函数 | 提交合作意向 |

### 4.2 管理后台接口（通过云函数调用）

| 接口 | 方法 | 说明 |
|------|------|------|
| `adminLogin` | 云函数 | 管理员登录 |
| `adminSaveCompany` | 云函数 | 保存公司简介 |
| `adminSaveDevice` | 云函数 | 保存设备 |
| `adminDeleteDevice` | 云函数 | 删除设备 |
| `adminSaveCase` | 云函数 | 保存案例 |
| `adminDeleteCase` | 云函数 | 删除案例 |
| `adminSaveVideo` | 云函数 | 保存视频 |
| `adminDeleteVideo` | 云函数 | 删除视频 |
| `adminGetAppointments` | 云函数 | 获取预约记录 |
| `adminGetCooperations` | 云函数 | 获取合作意向 |
| `adminSaveSettings` | 云函数 | 保存首页配置 |
| `adminUploadImage` | 云函数 | 上传图片到云存储 |

---

## 五、开发阶段计划

### 第一阶段：环境搭建与基础框架（预计2天）

**目标：** 完成项目初始化，搭建基础框架

| 步骤 | 任务 | 产出 |
|------|------|------|
| 1.1 | 注册腾讯云CloudBase，创建环境 | CloudBase环境ID、密钥 |
| 1.2 | 创建小程序项目，配置app.json | 小程序项目目录 |
| 1.3 | 配置底部Tab栏（6个Tab） | app.json中tab配置 |
| 1.4 | 创建公共工具函数（request.js, upload.js） | utils目录 |
| 1.5 | 创建管理后台项目骨架（Vue3+Vite+Element Plus） | admin目录 |
| 1.6 | 配置CloudBase SDK集成 | 两端都能调用云函数 |

---

### 第二阶段：小程序端核心页面开发（预计3天）

**目标：** 完成首页、设备、案例、预约四个核心页面

| 步骤 | 任务 | 产出 |
|------|------|------|
| 2.1 | 开发首页（轮播图+快速入口+精选案例） | pages/index/ |
| 2.2 | 开发设备列表页 | pages/device/ |
| 2.3 | 开发设备详情页 | pages/device-detail/ |
| 2.4 | 开发案例列表页 | pages/case/ |
| 2.5 | 开发案例详情页 | pages/case-detail/ |
| 2.6 | 开发预约表单页（含地图选点+照片上传） | pages/appointment/ |
| 2.7 | 对接云数据库，实现数据读取 | 各页面js文件 |

---

### 第三阶段：小程序端辅助页面开发（预计1天）

**目标：** 完成公司简介、视频、合作共赢页面

| 步骤 | 任务 | 产出 |
|------|------|------|
| 3.1 | 开发公司简介页 | pages/company/ |
| 3.2 | 开发视频列表页（预留抖音接口） | pages/video/ |
| 3.3 | 开发合作共赢页（含意向表单） | pages/ cooperate/ |
| 3.4 | 完善所有页面的交互细节 | 全局优化 |

---

### 第四阶段：管理后台开发（预计2天）

**目标：** 完成所有管理功能

| 步骤 | 任务 | 产出 |
|------|------|------|
| 4.1 | 开发登录页 | views/Login.vue |
| 4.2 | 开发仪表盘（数据统计） | views/Dashboard.vue |
| 4.3 | 开发公司简介管理页 | views/Company.vue |
| 4.4 | 开发设备管理页（增删改查） | views/Device.vue |
| 4.5 | 开发案例管理页（增删改查） | views/Case.vue |
| 4.6 | 开发视频管理页（增删改查） | views/Video.vue |
| 4.7 | 开发预约记录查看页 | views/Appointment.vue |
| 4.8 | 开发合作意向查看页 | views/ cooperate.vue |

---

### 第五阶段：云函数与数据对接（预计1天）

**目标：** 完成所有云函数编写，实现数据同步

| 步骤 | 任务 | 产出 |
|------|------|------|
| 5.1 | 编写所有数据读取云函数 | cloudfunctions/ |
| 5.2 | 编写所有数据写入云函数 | cloudfunctions/ |
| 5.3 | 编写预约通知云函数（微信消息） | cloudfunctions/appointmentNotify/ |
| 5.4 | 编写图片上传云函数 | cloudfunctions/ |
| 5.5 | 部署所有云函数到CloudBase | 云端部署完成 |

---

### 第六阶段：测试与验收（预计1天）

**目标：** 完成功能测试，确保符合验收标准

| 步骤 | 任务 | 产出 |
|------|------|------|
| 6.1 | 功能测试（对照PRD验收标准逐项检查） | 测试报告 |
| 6.2 | 兼容性测试（iOS/Android） | 兼容性报告 |
| 6.3 | 性能测试（加载速度） | 性能报告 |
| 6.4 | Bug修复 | 修复记录 |
| 6.5 | 文档整理 | 最终交付物 |

---

## 六、每日开发任务清单

### Day 1：环境搭建

- [ ] 注册腾讯云CloudBase账号
- [ ] 创建CloudBase环境，获取环境ID和密钥
- [ ] 初始化小程序项目（微信开发者工具）
- [ ] 配置app.json（Tab栏、页面路径）
- [ ] 创建utils目录，编写request.js和upload.js
- [ ] 初始化管理后台项目（Vue3 + Vite + Element Plus）
- [ ] 配置CloudBase SDK

### Day 2-3：小程序核心页面

- [ ] 开发首页（index）
  - [ ] 轮播图组件
  - [ ] 快速入口4宫格
  - [ ] 精选案例列表
  - [ ] 最新动态列表
- [ ] 开发设备列表页（device）
  - [ ] 设备卡片列表
  - [ ] 分类筛选功能
  - [ ] 云数据库读取
- [ ] 开发设备详情页（device-detail）
  - [ ] 图片轮播
  - [ ] 技术参数表格
  - [ ] 功能特点列表
  - [ ] 应用场景展示
- [ ] 开发案例列表页（case）
  - [ ] 案例卡片网格
  - [ ] 分类筛选
  - [ ] 云数据库读取
- [ ] 开发案例详情页（case-detail）
  - [ ] 图片展示
  - [ ] 项目信息展示
  - [ ] 挑战与解决方案
- [ ] 开发预约表单页（appointment）
  - [ ] 表单组件（姓名/电话/公司/时间）
  - [ ] 地图选点组件
  - [ ] 照片上传组件
  - [ ] 表单验证
  - [ ] 提交云函数调用

### Day 4：小程序辅助页面

- [ ] 开发公司简介页（company）
  - [ ] 公司介绍富文本
  - [ ] 发展历程时间轴
  - [ ] 企业文化展示
  - [ ] 资质证书轮播
- [ ] 开发视频列表页（video）
  - [ ] 视频列表展示
  - [ ] 预留抖音接口注释
  - [ ] 空状态提示
- [ ] 开发合作共赢页（ cooperate）
  - [ ] 合作理念介绍
  - [ ] 三种合作模式卡片
  - [ ] 合作优势列表
  - [ ] 意向提交表单
  - [ ] 表单验证
  - [ ] 提交云函数调用

### Day 5-6：管理后台

- [ ] 开发登录页（Login.vue）
  - [ ] 用户名密码输入
  - [ ] 登录云函数调用
  - [ ] 登录状态管理
- [ ] 开发布局框架
  - [ ] 侧边栏导航（Sidebar.vue）
  - [ ] 顶部栏（Header.vue）
  - [ ] 主内容区
- [ ] 开发仪表盘（Dashboard.vue）
  - [ ] 数据统计卡片
  - [ ] 近期预约列表
  - [ ] 近期合作意向列表
- [ ] 开发公司简介管理（Company.vue）
  - [ ] 简介文字编辑
  - [ ] 发展历程编辑
  - [ ] 企业文化编辑
  - [ ] 资质证书上传
  - [ ] 保存云函数调用
- [ ] 开发设备管理（Device.vue）
  - [ ] 设备列表表格
  - [ ] 新增/编辑弹窗
  - [ ] 图片上传
  - [ ] 增删改查云函数调用
- [ ] 开发案例管理（Case.vue）
  - [ ] 案例列表表格
  - [ ] 新增/编辑弹窗
  - [ ] 图片上传
  - [ ] 增删改查云函数调用
- [ ] 开发视频管理（Video.vue）
  - [ ] 视频列表表格
  - [ ] 新增/编辑弹窗
  - [ ] 增删改查云函数调用
- [ ] 开发预约记录查看（Appointment.vue）
  - [ ] 预约列表表格
  - [ ] 详情查看
  - [ ] 导出CSV功能
- [ ] 开发合作意向管理（ cooperate.vue）
  - [ ] 意向列表表格
  - [ ] 详情查看

### Day 7：云函数与测试

- [ ] 编写所有云函数
  - [ ] 数据读取云函数（8个）
  - [ ] 数据写入云函数（6个）
  - [ ] 预约通知云函数
  - [ ] 图片上传云函数
- [ ] 部署云函数到CloudBase
- [ ] 功能测试（14项验收标准逐项检查）
- [ ] 兼容性测试
- [ ] Bug修复
- [ ] 文档整理

---

## 七、开发注意事项

### 7.1 CloudBase配置

1. 登录 [腾讯云CloudBase控制台](https://cloud.tencent.com/product/tcb)
2. 创建免费环境（选择"开发测试"类型）
3. 记录环境ID（如：xxx-xxx）
4. 开通云数据库和云存储
5. 下载开发工具包

### 7.2 小程序配置

1. 在微信开发者工具中创建小程序项目
2. 填写小程序AppID（如需测试可用测试号）
3. 在app.json中配置tabBar
4. 在project.config.json中配置CloudBase环境ID

### 7.3 管理后台配置

1. 在admin目录下执行：
   ```bash
   npm install
   npm install element-plus @cloudbase/js-sdk
   ```
2. 配置CloudBase环境ID
3. 启动开发服务器：
   ```bash
   npm run dev
   ```

### 7.4 数据安全

1. 云数据库设置权限规则（公开读，管理员写）
2. 管理后台登录状态通过CloudBase鉴权
3. 敏感数据（如电话号码）在后台展示时部分脱敏

---

## 八、验收检查清单

### 8.1 功能验收（14项）

- [ ] 小程序能正常启动，首页正常显示
- [ ] 底部6个Tab切换正常
- [ ] 首页轮播图自动播放（3-5秒间隔）
- [ ] 设备列表正常展示，点击可查看详情
- [ ] 案例列表正常展示，点击可查看详情
- [ ] 视频列表页面正常加载
- [ ] 公司简介页面正常展示
- [ ] 预约表单提交成功，后台能收到记录
- [ ] 合作意向提交成功，后台能收到记录
- [ ] 地图选点功能正常
- [ ] 照片上传功能正常（拍照+相册）
- [ ] 管理后台能登录
- [ ] 管理后台能增删改设备，小程序同步更新
- [ ] 管理后台能查看预约记录

### 8.2 性能验收

- [ ] 首页加载时间不超过3秒
- [ ] 图片正常显示，无大量空白
- [ ] 表单提交后2秒内给出反馈
- [ ] 管理后台保存后，小程序刷新5秒内同步

### 8.3 兼容性验收

- [ ] iOS微信上功能正常
- [ ] Android微信上功能正常
- [ ] 主流手机屏幕（375px-414px宽度）布局正常

---

## 九、后续扩展计划（非第一版）

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 用户登录/注册 | 会员体系，收藏功能 | P2 |
| 抖音视频嵌入 | 接入抖音开放平台 | P2 |
| 短信通知 | 预约成功短信提醒 | P2 |
| 邮件通知 | 预约成功邮件提醒 | P2 |
| 数据分析 | 访问量统计、转化分析 | P3 |
| 多语言支持 | 英文版本 | P3 |

---

## 十、文件创建顺序

按以下顺序创建文件，确保依赖关系正确：

1. `miniprogram/app.json` — 先配置页面路径
2. `miniprogram/app.js` — 初始化CloudBase
3. `miniprogram/app.wxss` — 全局样式
4. `miniprogram/utils/request.js` — 请求工具
5. `miniprogram/utils/upload.js` — 上传工具
6. `miniprogram/pages/index/` — 首页（第一个页面）
7. `miniprogram/pages/device/` — 设备列表
8. `miniprogram/pages/device-detail/` — 设备详情
9. `miniprogram/pages/case/` — 案例列表
10. `miniprogram/pages/case-detail/` — 案例详情
11. `miniprogram/pages/appointment/` — 预约表单
12. `miniprogram/pages/company/` — 公司简介
13. `miniprogram/pages/video/` — 视频列表
14. `miniprogram/pages/ cooperate/` — 合作共赢
15. `cloudfunctions/` — 所有云函数
16. `admin/` — 管理后台

---

*开发计划结束。请确认后开始执行。*
