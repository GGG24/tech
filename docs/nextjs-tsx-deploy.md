# 既存TSXファイルを使用したNext.jsプロジェクトのデプロイガイド

## 1. プロジェクト構成の確認と準備

### 1.1 必要なファイル構成
```plaintext
your-project/
├── src/
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── index.tsx
│   │   └── [...その他のページ].tsx
│   ├── components/
│   │   └── [...コンポーネントファイル].tsx
│   └── styles/
│       └── [...スタイルファイル].css
├── public/
│   └── [...静的ファイル]
├── next.config.js
├── tsconfig.json
└── package.json
```

### 1.2 TypeScript設定の確認
`tsconfig.json`の重要な設定：

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## 2. デプロイ用の設定調整

### 2.1 `next.config.js`の設定
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/your-repo-name',
  typescript: {
    // ビルド時の型チェックを有効化
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
```

### 2.2 型定義の調整
必要に応じて`src/types`ディレクトリを作成し、共通の型定義を整理：

```typescript
// src/types/index.ts
export interface CommonProps {
  // 共通のプロパティ型定義
}
```

### 2.3 パス解決の調整
TSXファイルでの画像やその他のアセットの参照を修正：

```tsx
// 修正前
import Image from 'next/image';
import logo from '/public/logo.png';

// 修正後
import Image from 'next/image';
import logo from '@/public/logo.png';

// または
<img src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/logo.png`} />
```

## 3. ビルドとデプロイの設定

### 3.1 `package.json`の設定
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "deploy": "next build && touch out/.nojekyll"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "typescript": "latest"
  }
}
```

### 3.2 GitHub Actionsワークフロー
`.github/workflows/deploy.yml`:

```yaml
name: Deploy Next.js site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: "16"
          cache: 'npm'
          
      - name: Setup Pages
        uses: actions/configure-pages@v3
        
      - name: Install dependencies
        run: npm ci
        
      - name: Type check
        run: npm run type-check
        
      - name: Build with Next.js
        run: npm run build
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v1
```

## 4. 既存TSXファイルの調整

### 4.1 データフェッチングの修正
静的生成に対応するため、データフェッチングを調整：

```tsx
// pages/[id].tsx
import { GetStaticProps, GetStaticPaths } from 'next';

export const getStaticPaths: GetStaticPaths = async () => {
  // 静的に生成するパスを定義
  return {
    paths: [
      { params: { id: '1' } },
      { params: { id: '2' } }
    ],
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // 静的データを返す
  return {
    props: {
      // 静的データ
    }
  };
};
```

### 4.2 クライアントサイドのみの機能の調整
```tsx
import { useEffect, useState } from 'react';

const Component: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    // クライアントサイドのみのコンテンツ
  );
};
```

## 5. デプロイ後の確認事項

### 5.1 型チェック
```bash
# 型エラーがないか確認
npm run type-check

# ビルドエラーがないか確認
npm run build
```

### 5.2 動作確認
以下の項目を特に注意して確認：

1. ルーティング
   - 動的ルートの動作
   - 404ページの表示
   - クライアントサイドナビゲーション

2. データ表示
   - 静的データの表示
   - 画像の表示
   - フォントの適用

3. インタラクション
   - クライアントサイドの機能
   - フォームの動作
   - アニメーション

## 6. トラブルシューティング

### 6.1 よくある型エラーと解決策
1. `Property 'xxx' does not exist on type 'yyy'`
   ```tsx
   // 解決策: 型定義の追加
   interface Props {
     xxx: string;
   }
   ```

2. `Cannot find module 'xxx' or its corresponding type declarations`
   ```bash
   # 解決策: 必要な型定義のインストール
   npm install --save-dev @types/xxx
   ```

### 6.2 ビルドエラーの解決
1. 画像の最適化エラー
   ```tsx
   // next/image の代わりに img タグを使用
   <img
     src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/example.png`}
     alt="example"
   />
   ```

2. 動的インポートのエラー
   ```tsx
   // 動的インポートを静的インポートに変更
   import Dynamic from '@/components/Dynamic';
   ```
