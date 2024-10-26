# プロジェクトディレクトリ構造

```
.
├── docs/
│   ├── nextjs-tsx-deploy.md
│   ├── page-urls.md
│   └── directory-structure.md (このファイル)
├── src/
│   ├── components/
│   │   └── CssProblemsDemo.tsx
│   ├── pages/
│   │   ├── _app.tsx
│   │   └── index.tsx
│   └── styles/
│       └── globals.css
├── next.config.js
└── tsconfig.json
```

## ディレクトリとファイルの役割

### docs/
プロジェクトのドキュメンテーションを格納するディレクトリ。

- `nextjs-tsx-deploy.md`: Next.jsプロジェクトのデプロイに関する情報。
- `page-urls.md`: プロジェクト内の各ページのURLリスト。
- `directory-structure.md`: このファイル。プロジェクトの構造と各要素の役割を説明。

### src/
ソースコードを格納するメインディレクトリ。

#### components/
再利用可能なReactコンポーネントを格納するディレクトリ。

- `CssProblemsDemo.tsx`: CSS問題のデモを表示するコン��ーネント。

#### pages/
Next.jsのページコンポーネントを格納するディレクトリ。

- `_app.tsx`: アプリケーションのルートコンポーネント。全ページで共有される設定やレイアウトを定義。
- `index.tsx`: メインページのコンポーネント。

#### styles/
グローバルスタイルやスタイルに関連するファイルを格納するディレクトリ。

- `globals.css`: アプリケーション全体に適用されるグローバルなCSS定義。

### ルートディレクトリのファイル

- `next.config.js`: Next.jsの設定ファイル。ビルドやランタイムの挙動をカスタマイズするために使用。
- `tsconfig.json`: TypeScriptの設定ファイル。コンパイラオプションやプロジェクトの構造を定義。

## 注意事項

- この構造は現在のプロジェクト状態を反映しています。新しいファイルやディレクトリを追加した場合は、このドキュメントを更新してください。
- `src/`ディレクトリの使用は、コードの整理と管理を容易にするためのNext.jsの推奨プラクティスです。
- `pages/`ディレクトリ内のファイル名は、自動的にルーティングに使用されます。例えば、`pages/about.tsx`は`/about`と��うURLでアクセス可能になります。
