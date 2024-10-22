#!/bin/bash

# プロジェクトのルートディレクトリにいることを確認

# 必要なディレクトリを作成
mkdir -p src/components public

# css-problems-demo.tsx を適切な場所に移動
mv -f css-problems-demo.tsx src/components/CssProblemsDemo.tsx

# docs ディレクトリの内容を処理
mv -f docs/nextjs-tsx-deploy.md ./
rm -f docs/nextjs-tsx-deploy.mdZone.Identifier
rm -rf docs

# Downloads フォルダの不要なファイルを削除（必要に応じて）
rm -f "/c/Users/81801/Downloads/nextjs-tsx-deploy.md"

# ファイルの存在を確認し、存在しない場合は空のファイルを作成
touch public/favicon.ico

# src ディレクトリ内のファイルとディレクトリを確認
ls -R src

# プロジェクト構造を表示
if command -v tree > /dev/null; then
    tree -L 3
else
    find . -maxdepth 3 -type d
fi

echo "プロジェクトのセットアップが完了しました。"
