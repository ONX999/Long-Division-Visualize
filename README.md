# Long Division & Multiplication Visualizer

直式計算器 - 支援除法與乘法的步驟顯示器。前端純靜態網頁，直接部署到 GitHub Pages 即可使用。

## 功能特色

✨ **雙運算支援**：除法（Long Division）與乘法運算
🧮 **計算機輸入模組**：使用數字鍵盤輸入，類似真實計算機
📱 **iOS 最佳化**：完美適配 iPhone 螢幕尺寸
🎨 **現代化介面**：美觀的漸層配色與直覺操作
📊 **步驟可視化**：顯示完整直式計算過程與逐步說明
🚀 **自動部署**：GitHub Actions 自動部署至 GitHub Pages

## 使用方式

1. 選擇運算類型（除法或乘法）
2. 使用數字鍵盤輸入第一個數字
3. 點擊切換按鈕（⇅）切換到第二個輸入框
4. 輸入第二個數字
5. 點擊等號（=）查看計算結果
6. 查看直式計算圖與逐步過程

## 部署方式

### GitHub Pages 自動部署
1. Fork 或上傳此專案到您的 GitHub repository
2. 在 Settings > Pages 中啟用 GitHub Pages
3. 選擇 Source 為 "GitHub Actions"
4. 每次推送到 main 分支時會自動部署

### 本地運行
使用任何靜態伺服器即可運行，例如：
```bash
python3 -m http.server 8080
```

## 技術特點

- 純 HTML/CSS/JavaScript，無需框架
- 響應式設計，支援各種螢幕尺寸
- iOS 安全區域支援（Safe Area）
- 現代化 UI 設計，使用 CSS 變數
- 無障礙設計（details/summary 折疊面板）

## 延伸功能

可擴充支援：
- 小數運算
- 負數運算
- 更多運算類型（加減法等）
- 步驟動畫化
- 歷史記錄功能
