# 智慧解語

2026 三好 AI 創新應用競賽原型 —— 做好事、說好話、存好心；給人信心、歡喜、希望、方便。
輸入心事 → 從內建經文庫（assets/data/sutras.json，62 則）檢索相關經句 → 用 AI（有設定金鑰時）或內建模板產生溫暖回覆，並播放鐘聲。

## 在手機上預覽（Expo Go）
1. 安裝 Node.js 20 以上版本，手機安裝 **Expo Go**（App Store / Google Play）。
2. `npm install`
3. `npx expo start`（手機與電腦要連同一個 Wi‑Fi；不同網路可用 `npx expo start --tunnel`）
4. Android 用 Expo Go 掃 QR Code；iPhone 用相機掃 QR Code。
網頁預覽：`npx expo start --web`

## 設定 AI 金鑰（選用）
複製 `.env.example` 為 `.env`（已列入 .gitignore），填入：
```
EXPO_PUBLIC_GEMINI_API_KEY=...            # 預設使用 Google Gemini（generateContent）
EXPO_PUBLIC_GEMINI_MODEL=gemini-flash-lite-latest
EXPO_PUBLIC_OPENAI_API_KEY=...            # 選用：Gemini 失敗時改用 OpenAI 相容服務
```
重新執行 `npx expo start` 即可。流程：先在本機檢索 8 段候選經文，再由 AI 挑最貼切的一段並寫出回覆。回覆一定要逐字引用所選經文，否則改用模板。沒有金鑰、離線或呼叫失敗時，也會自動改用模板回覆。
⚠️ `EXPO_PUBLIC_` 開頭的變數會被打包進 App／網頁。正式上線請改由自己的後端代理呼叫，不要把金鑰放在 App 裡。

## 打包 APK / IPA（EAS）
```
npm i -g eas-cli
eas login
eas build -p android --profile preview      # 產生可直接安裝的 APK
eas build -p ios --profile production       # 產生 IPA（需要 Apple 開發者帳號）
```
相關設定在 `eas.json`。

## 專案結構
- `App.tsx`：主畫面
- `src/theme.ts`：所有顏色、字級、間距（調整 UI 從這裡開始）
- `src/logic.ts`：關鍵字檢索、危機偵測、LLM 呼叫與模板回覆
- `src/BuddhaArt.tsx`：原創 SVG 佛像插圖
- `assets/chime.wav`：用 Python 合成的頌缽鐘聲
- `assets/data/sutras.json`：經文庫（含 CBETA 經號）；`tools/` 內是產生經文庫與 CBETA 校對的腳本

## 安全提醒
偵測到「自殺」「想死」等字眼時，畫面會顯示安心專線 1925、生命線 1995、張老師專線 1980。本 App 無法取代專業心理協助。

## 網頁版（免安裝）
`npm run build:web` 會產生 `dist-web/`，路徑都是相對的，可以放到任何靜態主機（包含子路徑），也可以直接用瀏覽器開啟 `index.html`。
本機預覽：`npx serve dist-web` 或 `python3 -m http.server -d dist-web 8090`
