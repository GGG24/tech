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
