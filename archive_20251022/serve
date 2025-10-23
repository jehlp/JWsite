#!/bin/bash
pkill -f jekyll
[ "$1" = "stop" ] && { echo "Server stopped"; exit 0; }
[ "$1" = "restart" ] && sleep 1 && $0 && { echo "Server restarted"; exit 0; }
mkdir -p logs
[ -f logs/latest.log ] && mv logs/latest.log logs/$(date -r logs/latest.log +%Y%m%d_%H%M%S).log
bundle exec jekyll serve --livereload > logs/latest.log 2>&1 & echo "Server Started: http://localhost:4000"