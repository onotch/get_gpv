GPVの過去の予想図をローカルにアーカイブするスクリプトです。
全エリアの「雨量・雲量」「気温・湿度」「気圧・風速」の予想図でGPVのサイトからアクセスできる過去データ（3時間分）をダウンロードします。
このスクリプトをGPVが更新されるタイミング（３時間毎）に合わせて実行することで予想図をダウンロードし続けることができます。

## インストール方法
### 1. gdateコマンドを使うためbrewとcoreutilsをインストールする（MacOSのみ）
```
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
$ brew install coreutils
```

### 2. 環境に合わせてスクリプトを変更する
- Linuxの場合はスクリプトの冒頭にあるdateコマンドのエイリアスをコメントアウトし、shebangを`#!/bin/sh`から`#!/bin/bash`に変更する
- 特定の情報だけアーカイブしたい場合はスクリプトの`TYPE`と`AREA`の配列で不要なものを削除する

### 3. スクリプトに実行権限を付与する
```
$ chmod +x get_gpv.sh
```

### 4. 定期的（３時間毎）にスクリプトを実行させるためcrontabもしくはlaunchdでジョブスケジューリングする
#### a. crontabに設定する場合
```
$ crontab cron.conf
```
**設定ファイル内の`/Users/hoge/`は適切なパスに書き換えてください。**

#### b. launchdに設定する場合（MacOSのみ）
```
$ cp get_gpv.plist ~/Library/LaunchAgents/
$ launchctl load ~/Library/LaunchAgents/get_gpv.plist
```
**設定ファイル内の`/Users/hoge/`は適切なパスに書き換えてください**

## アーカイブした画像を見るには
`archive/index.html`をWebブラウザで開いてください。

## GPV本家
http://weather-gpv.info/
