# forAiswaryaByAbimanyu 🎉

A mobile‑friendly interactive birthday webpage built with Angular and deployed via GitHub Pages.

## 🚀 Live Site
👉 [https://abimanyukm.github.io/forAiswaryaByAbimanyu/](https://abimanyukm.github.io/forAiswaryaByAbimanyu/)

## 📂 Project Overview
- Built using Angular
- Deployed with GitHub Pages
- SEO optimized with sitemap.xml and robots.txt

## 🛠 Build & Deploy
```bash
ng build --configuration production --base-href "/forAiswaryaByAbimanyu/"
rm -rf docs
cp -r dist/<your-app-name>/browser docs
cp docs/index.html docs/404.html
git add docs
git commit -m "Deploy Angular app"
git push origin main
