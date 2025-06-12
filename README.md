# React + TypeScript + Vite

[English](#english) | [Tiếng Việt](#tiếng-việt)

<a name="english"></a>
## English

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

<a name="tiếng-việt"></a>
## Tiếng Việt

Template này cung cấp một cài đặt tối thiểu để bắt đầu làm việc với React trong Vite, bao gồm HMR và một số quy tắc ESLint.

Hiện tại, có hai plugin chính thức có sẵn:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) sử dụng [Babel](https://babeljs.io/) cho Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) sử dụng [SWC](https://swc.rs/) cho Fast Refresh

### Mở rộng cấu hình ESLint

Nếu bạn đang phát triển một ứng dụng cho môi trường production, chúng tôi khuyến nghị cập nhật cấu hình để bật các quy tắc lint có nhận thức về kiểu dữ liệu:

```js
export default tseslint.config({
  extends: [
    // Xóa ...tseslint.configs.recommended và thay thế bằng cái này
    ...tseslint.configs.recommendedTypeChecked,
    // Hoặc, sử dụng cái này cho các quy tắc nghiêm ngặt hơn
    ...tseslint.configs.strictTypeChecked,
    // Tùy chọn, thêm cái này cho các quy tắc về phong cách
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // các tùy chọn khác...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

Bạn cũng có thể cài đặt [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) và [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) cho các quy tắc lint đặc thù của React:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Thêm các plugin react-x và react-dom
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // các quy tắc khác...
    // Bật các quy tắc typescript được khuyến nghị
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
