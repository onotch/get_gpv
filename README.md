GPVの予想図をローカルにアーカイブするスクリプトです。

全エリアの「雨量・雲量」「気温・湿度」「気圧・風速」の予想図でGPVのサイトからアクセスできる一番過去のもの（3時間前）をダウンロードします。

※特定の情報だけアーカイブしたい場合はスクリプトのTYPEとAREAの配列で必要なものだけ残してください

◆インストール方法

1. （MacOS上で実行する場合）gdateコマンドを使うためbrewとcoreutilsをインストールする

$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

$ brew install coreutils

2. スクリプトに実行権限を付与する

$ chmod +x get_gpv.sh

3. 定期的に実行させるため以下のいずれかを設定する

3-1. crontabに設定する場合

$ crontab cron.conf

※設定ファイル内の /Users/hoge/ は適切なパスに書き換えてください

3-2. launchdに設定する場合（MacOSのみ）

$ cp get_gpv.plist ~/Library/LaunchAgents/

$ launchctl load ~/Library/LaunchAgents/get_gpv.plist

※設定ファイル内の /Users/hoge/ は適切なパスに書き換えてください
