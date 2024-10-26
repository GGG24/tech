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
