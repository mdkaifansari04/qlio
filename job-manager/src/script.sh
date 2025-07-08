#!/bin/bash

echo "[INFO] Starting fetch job..."
sleep 1

echo "[INFO] Fetching todos from API..."
sleep 1

RESPONSE=$(curl -s https://jsonplaceholder.typicode.com/todos/)

if [ $? -ne 0 ]; then
  echo "[ERROR] Failed to fetch data from API."
  exit 1
fi

echo "[INFO] Successfully fetched todos."
sleep 1

echo "[INFO] Showing top 5 todos:"
echo "$RESPONSE" | jq '.[:5][] | "[TODO] \(.title) [\(.completed)]"'

echo "[INFO] Fetch job completed ✅"
exit 0
