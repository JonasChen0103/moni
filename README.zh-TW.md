# Moni — 個人財務 PWA

<p align="center">
  <img src="public/favicon.svg" width="80" alt="Moni logo" />
</p>

<p align="center">
  多幣別個人財務追蹤 PWA，採用 iOS Cupertino 設計語言，可安裝至任何裝置。
  <br>
  <a href="README.md">English</a>
</p>

---

## 功能

- **多幣別即時匯率** — 自動抓取匯率並快取 1 小時，基礎貨幣為新臺幣（TWD）。
- **8 種帳戶類型** — 信用卡（帳單日/繳款日/額度）、支票帳戶、儲蓄帳戶、簽帳卡、保險（保費/繳費頻率/到期日）、投資（持倉部位）、現金、預付卡（悠遊卡、PX Pay、自動加值、快速扣款）。
- **臺灣信用卡分期與真實年利率** — 以臺灣實際分期方案建模，使用 IRR（Newton-Raphson 法）計算 APR，而非簡化的「手續費 × 12」算法。範例：NT$36,000 / 12 期 / 每期 NT$3,180 → APR ≈ 10.98%。
- **分帳與欠款追蹤** — 與朋友聚餐先付帳？記錄你幫誰付了多少錢，系統自動統整每個人的淨欠款，支援標記已還清。
- **週期性交易** — 支援每日/每週/每月/每年週期，可設定結束日期。
- **6–12 個月財務預測** — 預測淨資產走勢，涵蓋週期收支、分期付款、保險保費，全部換算為新臺幣。
- **離線優先 PWA** — 使用 IndexedDB（Dexie.js）本地儲存，Service Worker 支援離線存取，可安裝至任何裝置的主畫面。
- **PocketBase 同步** — 可選連接自架 PocketBase 伺服器，實現多裝置同步。
- **響應式設計** — 適配各種螢幕尺寸，iOS Cupertino 風格介面。

## 技術棧

| 層級 | 技術 |
|------|------|
| 框架 | React 19 + TypeScript |
| 建置 | Vite 8 |
| 樣式 | Tailwind CSS 4（Cupertino 設計系統） |
| 狀態管理 | Zustand |
| 本地資料庫 | Dexie.js（IndexedDB） |
| 圖表 | Recharts |
| PWA | vite-plugin-pwa（Workbox） |
| 同步 | PocketBase JS SDK |
| 測試 | Vitest |
| 程式碼檢查 | oxlint |

## 開始使用

```bash
git clone https://github.com/JonasChen0103/moni.git
cd moni
npm install
npm run dev        # http://localhost:5173
npm run test       # 執行測試
npm run lint       # 程式碼檢查
npm run build      # 正式建置
npm run preview    # 預覽建置結果
```

## PocketBase 設定

Moni 完全離線可用。如需啟用多裝置同步：

1. 下載 [PocketBase](https://pocketbase.io/) 並在電腦上執行。
2. 透過管理介面匯入 `pocketbase-schema.json`（設定 → 匯入 collections）。
3. 在 PocketBase 管理面板建立使用者帳號。
4. 在 Moni 中前往「設定 → PocketBase Sync」，輸入伺服器 URL 和帳號密碼。

## iOS 部署

透過 [Codemagic](https://codemagic.io/) 建置原生 iOS 版本：

1. 將此 repo 連接至 Codemagic。
2. 使用 PWA 轉 iOS 的工作流程（Capacitor 或類似方案）。
3. 或者直接將 PWA 加入主畫面 — 完全支援離線運作。

## 專案結構

```
src/
├── components/
│   ├── cupertino/       # iOS 風格 UI 元件庫
│   ├── AccountForm      # 帳戶新增/編輯
│   ├── TransactionForm  # 交易新增/編輯
│   ├── InstallmentForm / InstallmentDetail
│   ├── RecurringForm
│   ├── DebtForm         # 分帳記錄
│   └── DebtSummary      # 誰欠誰統計
├── db/                  # Dexie.js 資料庫結構
├── models/              # TypeScript 型別定義
├── pages/               # 儀表板、帳戶、活動紀錄、預測、設定
├── services/
│   ├── fx               # 匯率抓取與轉換
│   ├── irr              # 年利率計算（Newton-Raphson IRR）
│   ├── forecast         # 淨資產預測引擎
│   └── pocketbase       # PocketBase 同步客戶端
└── stores/              # Zustand 狀態管理
```

## 貢獻

1. Fork 此 repo
2. 建立功能分支：`git checkout -b feature/my-feature`
3. 提交變更：`git commit -m "Add my feature"`
4. 推送並建立 PR

## 授權

MIT
