#!/bin/sh
# 產生可靜態託管（含子路徑與 file://）的網頁版到 dist-web/
set -e
rm -rf dist-web && npx expo export --platform web --output-dir dist-web
sed -i 's#"/_expo/#"./_expo/#g; s#"/favicon.ico"#"./favicon.ico"#g' dist-web/index.html
sed -i 's#"/assets/assets/#"./assets/assets/#g' dist-web/_expo/static/js/web/*.js
