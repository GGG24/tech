# Docker×Next.jsによるGitHub Pages環境構築ガイド

このガイドでは、Dockerを使用してNext.jsプロジェクトを初期化し、GitHub Pagesで公開するまでの手順を説明します。特に、初めてGitHub ActionsやGitHub Pages機能を使う方を対象としています。

## 完成版のディレクトリ構成

```
①my-nextjs-project/
├── ②.github/
│   └── ③workflows/
│       └── ④deploy.yml
├── ⑤out/
├── ⑥Dockerfile
├── ⑦.dockerignore
├── ⑧package.json
├── ⑨next.config.js
├── ⑩docs/  # 検討中の資料用のディレクトリ（GitHub Pagesで公開しない）
│   └── ⑪sample-draft.md
├── ⑫docker-compose.yml  # ここにDocker Composeファイルを配置
├── ⑬init.sh  # Next.jsプロジェクトを初期化するスクリプト
└── ⑭src/
    ├── ⑮components/
    │   └── ⑯CssProblemsDemo.tsx
    ├── ⑰pages/
    │   └── ⑱index.tsx
    └── ⑲styles/
        └── ⑳globals.css
```

## 1. プロジェクトの初期化

1. 新しいリポジトリをGitHubで作成します。

2. ローカルマシンでプロジェクトディレクトリを作成し、初期化します。
   ```bash
   mkdir my-nextjs-project
   cd my-nextjs-project
   git init
   git remote add origin https://github.com/yourusername/your-repo-name.git
   ```

### ディレクトリ構成
```
①my-nextjs-project/
```

## 2. Docker環境の設定

1. **Dockerfileの作成**:
   プロジェクトのルートディレクトリに`Dockerfile`を作成し、以下の内容を追加します。
   ````dockerfile
   # ベースイメージとしてNode.jsを使用
   FROM node:14

   # 作業ディレクトリを設定
   WORKDIR /app

   # Next.jsプロジェクトを初期化するためのスクリプトを作成
   COPY init.sh ./
   RUN chmod +x init.sh
   RUN ./init.sh

   # アプリケーションを起動
   CMD ["npm", "start"]

   # コンテナがリッスンするポートを指定
   EXPOSE 3000
   ````

2. **初期化スクリプトの作成**:
   プロジェクトのルートディレクトリに`init.sh`というスクリプトファイルを作成し、以下の内容を追加します。
   ````bash
   #!/bin/bash

   # Next.jsプロジェクトを初期化
   npx create-next-app@latest . --typescript
   ````

3. **.dockerignoreの作成**:
   Dockerイメージに不要なファイルを含めないようにするため、プロジェクトのルートディレクトリに`.dockerignore`ファイルを作成し、以下の内容を追加します。
   ```plaintext
   node_modules
   npm-debug.log
   out
   ```

4. **.gitignoreの作成**:
   Gitに不要なファイルを含めないようにするため、プロジェクトのルートディレクトリに`.gitignore`ファイルを作成し、以下の内容を追加します。
   ```plaintext
   node_modules
   out
   .env
   .dockerignore
   ```

### ディレクトリ構成
```
①my-nextjs-project/
├── ②Dockerfile
├── ③.dockerignore
├── ④.gitignore
└── ⑤init.sh  # ここにinit.shを配置
```

5. **Docker Composeの設定**:
   プロジェクトのルートディレクトリに`docker-compose.yml`ファイルを作成し、以下の内容を追加します。
   ````yaml
   version: '3.8'

   services:
     app:
       build:
         context: .
         dockerfile: Dockerfile
       ports:
         - "3000:3000"  # デフォルトのポートを指定
       volumes:
         - ./src:/app/src
         - ./package.json:/app/package.json
         - ./next.config.js:/app/next.config.js
       environment:
         - NODE_ENV=development
   ````

### ディレクトリ構成
```
①my-nextjs-project/
├── ②Dockerfile
├── ③.dockerignore
├── ④.gitignore
├── ⑤init.sh
└── ⑥docker-compose.yml
```

6. **ポート自動設定スクリプトの作成**:
   `docker-setup.sh`というスクリプトファイルを作成し、以下の内容を追加します。このスクリプトは空いているポートを自動的に見つけて、Dockerコンテナを起動します。
   ````bash
   #!/bin/bash

   # 空いているポートを探す
   find_free_port() {
     local port=3000
     local max_port=3005
     while [ $port -le $max_port ]; do
       if ! lsof -i :$port > /dev/null; then
         echo $port
         return
       fi
       port=$((port + 1))
     done
     echo "No free ports found"
     exit 1
   }

   # 使用するポートを取得
   PORT=$(find_free_port)

   # 環境変数を設定
   export PORT

   # Docker Composeの実行
   if [ "$(docker-compose ps -q app)" ]; then
     echo "既存のコンテナを再起動しています..."
     docker-compose down
   fi

   echo "Docker Composeを使用してコンテナを起動しています..."
   docker-compose up --build -d

   # アクセス用URLの提示
   echo "コンテナが起動しました。以下のURLでアクセスできます:"
   echo "http://localhost:$PORT"
   ````

7. **スクリプトの実行**:
   スクリプトを実行することで、ビルドと起動を一度に行うことができます。
   ```bash
   chmod +x docker-setup.sh
   ./docker-setup.sh
   ```

### ディレクトリ構成
```
①my-nextjs-project/
├── ②Dockerfile
├── ③.dockerignore
├── ④.gitignore
├── ⑤docker-compose.yml
├── ⑥docker-setup.sh
└── ⑦init.sh
```

## 3. Next.jsプロジェクトの初期化

`init.sh`スクリプトを実行すると、以下のファイルとディレクトリが自動的に生成されます。

- **`package.json`**: プロジェクトの依存関係やスクリプトを管理するファイル。
- **`next.config.js`**: Next.jsの設定を行うためのファイル。
- **`src/`**: アプリケーションのソースコードを格納するディレクトリ。
  - **`src/pages/`**: ページコンポーネントを格納するディレクトリ。デフォルトで`index.tsx`が生成されます。
  - **`src/styles/`**: スタイルシートを格納するディレクトリ。デフォルトで`globals.css`が生成されます。
  - **`src/components/`**: コンポーネントを格納するためのディレクトリ（手動で作成する必要があります）。

### ディレクトリ構成
```
①my-nextjs-project/
└── ②src/
    ├── ③pages/
    │   └── ④index.tsx
    ├── ⑤styles/
    │   └── ⑥globals.css
    └── ⑦components/
```

## 4. GitHub Pages用の設定

1. `next.config.js`ファイルを作成し、以下の内容を追加します：
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     assetPrefix: '/your-repo-name/',
     basePath: '/your-repo-name',
   };

   module.exports = nextConfig;
   ```
   `your-repo-name`をあなたのGitHubリポジトリ名に置き換えてください。

2. `package.json`ファイルの`scripts`セクションに以下を追加します：
   ```json
   "scripts": {
     "build": "next build && next export",
     "deploy": "npm run build && touch out/.nojekyll && git add out/ && git commit -m \"Deploy to gh-pages\" && git subtree push --prefix out origin gh-pages"
   }
   ```

### ディレクトリ構成
```
①my-nextjs-project/
├── ②Dockerfile
├── ③.dockerignore
├── ④.gitignore
├── ⑤docker-compose.yml
├── ⑥docker-setup.sh
├── ⑦src/
│   ├── ⑧pages/
│   │   └── ⑨index.tsx
│   ├── ⑩styles/
│   │   └��─ ⑪globals.css
│   └── ⑫components/
└── ⑬next.config.js
```

## 5. GitHub Actionsの設定

1. プロジェクトのルートに`.github/workflows`ディレクトリを作成します。

2. `.github/workflows/deploy.yml`ファイルを作成し、以下の内容を追加します：
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches:
         - main

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '14'
         - name: Install dependencies
           run: npm ci
         - name: Build
           run: npm run build
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./out
   ```

### ディレクトリ構成
```
①my-nextjs-project/
├── ②.github/
│   └── ③workflows/
│       └── ④deploy.yml
├── ⑤Dockerfile
├── ⑥.dockerignore
├── ⑦.gitignore
├── ⑧docker-compose.yml
├── ⑨docker-setup.sh
├── ⑩src/
│   ├── ⑪pages/
│   │   └── ⑫index.tsx
│   ├── ⑬styles/
│   │   └── ⑭globals.css
│   └── ⑮components/
└── ⑯next.config.js
```

## 6. デプロイ

1. 変更をコミットし、GitHubにプッシュします。
   ```bash
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. GitHubリポジトリの"Settings" > "Pages"に移動し、"Source"を"gh-pages"ブランチに設定します。

3. GitHub Actionsが自動的にビルドとデプロイを行います。

4. 数分後、`https://yourusername.github.io/your-repo-name/`でサイトが公開されます。

### 気になること
- **Dockerを利用することでローカルホスト側はNode.jsなどを入れなくて済む**:
  - はい、その通りです。Dockerを使用することで、ローカル環境にNode.jsをインストールする必要がなくなります。すべての依存関係はDockerコンテナ内で管理されます。

このガイドに従うことで、Dockerを使用してNext.jsプロジェクトをGitHub Pagesで公開することができます。プロジェクトの発展に応じて、さらにページやコンポーネントを追加してください。
