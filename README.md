# News kawaii — GitHub連携で完全自動更新にする手順

このフォルダの中身をGitHubに置いて、Netlifyとつなぐと、
**毎日 朝6時 / 昼12時 / 夕18時 / 夜22時** に速報ティッカーが自動で最新ニュースになります。
(天気・地震・NASAのカードは、すでに開くたび自動更新です)

## 手順(15分・1回だけ)

### 1. GitHubのアカウントを作る
https://github.com/ を開いて「Sign up」。メールアドレスがあれば無料で作れます。

### 2. リポジトリ(置き場所)を作る
ログイン後、右上の「+」→「New repository」。
- Repository name: `news-kawaii`
- 「Public」を選ぶ
- 「Create repository」を押す

### 3. ファイルをアップロードする
できたページの「uploading an existing file」というリンクを押して、
**このzipを解凍した中身を全部**(フォルダごと)ドラッグ&ドロップ →「Commit changes」。

> うまく `.github` フォルダが入らないときは:
> 「Add file」→「Create new file」→ ファイル名の欄に
> `.github/workflows/news-update.yml` と入力し、
> このzip内の同名ファイルの中身をコピペして「Commit changes」。

### 4. NetlifyとGitHubをつなぐ
Netlifyの `news-kawaii` プロジェクト →
**Project configuration → Build & deploy → Continuous deployment** →
「Link repository」(またはLink site to Git)→ GitHub → `news-kawaii` を選択。
- Build command: **空欄のまま**
- Publish directory: **そのまま(空欄または「/」)**

これで「GitHubのファイルが変わると、自動でサイトに公開」になります。

### 5. 自動更新をONにする
GitHubのリポジトリの「Actions」タブ → 有効化のボタンを押す →
左の「news-update」→「Run workflow」で1回テスト実行。
緑のチェックがつけば成功です。あとは毎日4回、勝手に動きます。

## これ以降のこと
- 速報ティッカー: 全自動(1日4回)
- 天気・地震・NASAカード: 開くたび最新(全自動)
- 記事カードの入れ替え: Claudeが作った新しい `index.html` を、GitHubの「Add file → Upload files」で上書きアップロードすればOK(Netlifyへの反映は自動)

## しくみ(かんたんに)
`scripts/update-news.mjs` がNHKのRSS(公式配信の見出し)を取りに行き、
`news-auto.json` を書き換えます。サイトはこのファイルを読んでティッカーを流します。
見出しは「事実の伝達+出典リンク」の範囲で使っています。
