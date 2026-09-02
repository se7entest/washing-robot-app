#!/bin/bash
# 数据备份脚本
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# 备份所有 JSON 数据文件
for file in data/*.json; do
  cp "$file" "$BACKUP_DIR/"
done

# 备份配置
cp .gitignore "$BACKUP_DIR/" 2>/dev/null

echo "备份完成: $BACKUP_DIR"
ls -la "$BACKUP_DIR"
