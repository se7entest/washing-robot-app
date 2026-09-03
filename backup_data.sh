#!/bin/bash
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
for file in data/*.json; do
  cp "$file" "$BACKUP_DIR/"
done
cp .gitignore "$BACKUP_DIR/" 2>/dev/null
echo "备份完成: $BACKUP_DIR"
