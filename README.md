# Futuristic Portfolio 2026 (React + Vite)

Website cá nhân phong cách cyberpunk/futuristic với:

- React (Vite)
- Framer Motion cho animation
- TailwindCSS cho styling
- UI glassmorphism + nền động + 3D hover
- Dark/Light mode với toggle animate mượt

## 1. Cài đặt

Yêu cầu:

- Node.js 18+ (khuyên dùng 20+)
- npm 9+

Chạy:

```bash
npm install
npm run dev
```

Mở trình duyệt tại địa chỉ được Vite in ra (thường là `http://localhost:5173`).

## 2. Build production

```bash
npm run build
npm run preview
```

## 3. Cấu trúc thư mục

```text
.
|-- public/
|   `-- avatar.jpg
|-- src/
|   |-- components/
|   |   |-- cards/
|   |   |   `-- ProjectCard.jsx
|   |   |-- common/
|   |   |   |-- Reveal.jsx
|   |   |   |-- RippleButton.jsx
|   |   |   |-- SectionTitle.jsx
|   |   |   `-- ThemeToggle.jsx
|   |   |-- effects/
|   |   |   `-- ParticleField.jsx
|   |   |-- layout/
|   |   |   |-- AnimatedBackground.jsx
|   |   |   |-- LoadingScreen.jsx
|   |   |   `-- Navbar.jsx
|   |   `-- sections/
|   |       |-- AboutSection.jsx
|   |       |-- ContactSection.jsx
|   |       |-- HeroSection.jsx
|   |       |-- ProjectsSection.jsx
|   |       `-- SkillsSection.jsx
|   |-- data/
|   |   `-- siteData.js
|   |-- hooks/
|   |   |-- useMouseDepth.js
|   |   |-- useTheme.js
|   |   `-- useTypewriter.js
|   |-- App.jsx
|   |-- index.css
|   `-- main.jsx
|-- .gitignore
|-- index.html
|-- package.json
|-- postcss.config.js
|-- tailwind.config.js
`-- vite.config.js
```

## 4. Điểm nổi bật đã triển khai

- Loading screen full-screen:
  - Progress 0 -> 100%
  - Neon glow + blur
  - Fade-out mượt với `AnimatePresence`
- Intro animation:
  - Typewriter text từng chữ
  - Avatar scale-in + blur giảm dần
  - Particle chuyển động nhẹ
- Background động:
  - Animated gradient
  - 3 parallax layers (far/mid/near)
  - Mouse depth 3D effect bằng custom hook
- Glassmorphism UI:
  - Navbar fixed trong suốt
  - `backdrop-filter: blur()`
  - Border mờ + shadow mềm + hover glow
- Parallax scrolling:
  - Section dịch chuyển tốc độ khác nhau theo scroll
  - Hero zoom-out khi scroll
  - Text/card reveal khi vào viewport
- 3D effects:
  - Project card tilt theo chuột
  - Ripple button animation
  - Neon glow text-shadow
- Dark mode:
  - Mặc định dark
  - Toggle dark/light có animation

## 5. Chỉnh nội dung cá nhân

Sửa dữ liệu tại:

- `src/data/siteData.js`

Bạn có thể cập nhật:

- Tên, chức danh
- Skills + phần trăm
- Danh sách project
- Email/social links

## 6. Docker production

Build image:

```bash
docker compose build
```

Run container:

```bash
docker compose up -d
```

Open: `http://localhost:8080`

Stop:

```bash
docker compose down
```

If you need Discord ID at build time:

```bash
set VITE_DISCORD_USER_ID=1043123309983846482
docker compose build --no-cache
```

## 7. Push len GitHub repo

Repo: `https://github.com/Huyphan68080/profile.github.io.git`

```bash
git init
git branch -M main
git add .
git commit -m "feat: add futuristic portfolio with docker setup"
git remote add origin https://github.com/Huyphan68080/profile.github.io.git
git push -u origin main
```

If `origin` already exists:

```bash
git remote set-url origin https://github.com/Huyphan68080/profile.github.io.git
git push -u origin main
```

## 8. Auto deploy GitHub Pages (Actions)

Workflow da duoc them tai:

- `.github/workflows/deploy-pages.yml`

M?i l?n push v�o `main`, GitHub Actions s?:

1. `npm ci`
2. `npm run build`
3. Upload `dist`
4. Deploy l�n GitHub Pages

Can boi tren GitHub:

1. Vao `Settings` -> `Pages`
2. O `Build and deployment`, chon `Source: GitHub Actions`

(Tuy chon) Neu muon set Discord ID qua CI:

1. Vao `Settings` -> `Secrets and variables` -> `Actions`
2. Tao repository variable: `VITE_DISCORD_USER_ID`

## 9. Neu gap loi Pages API (Resource not accessible by integration)

Workflow da doi sang deploy theo nhanh `gh-pages` (khong goi Pages REST API).

Can set 1 lan tren GitHub:

1. `Settings` -> `Pages`
2. `Build and deployment` -> `Source: Deploy from a branch`
3. Chon branch: `gh-pages`, folder: `/ (root)`

Sau do moi lan push `main`, workflow se build va cap nhat `gh-pages` tu dong.
