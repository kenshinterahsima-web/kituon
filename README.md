# Kituon

吃音当事者向けの体験共有 Web サイトです。  
HTML / CSS / JavaScript と Supabase で構成され、Vercel にそのままデプロイできます。

## ページ構成

- `index.html`: ヒントを探す（一覧・絞り込み）
- `saved.html`: 保存したヒント（ブックマーク一覧）
- `submit.html`: 体験を投稿する（フォーム）
- `js/config.js`: Supabase接続設定

## セットアップ（Supabase）

1. Supabase で新規プロジェクトを作成
2. SQL Editor で `supabase/schema.sql` を実行
3. `js/config.js` の以下を実値に置換

```js
window.SUPABASE_URL = "YOUR_SUPABASE_URL";
window.SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
```

## 補足機能

- 一覧ページで並び替え（新しい順 / 古い順 / 効果が高い順）
- 投稿時の簡易バリデーション（文字数、選択値、連絡先情報の抑止）
- 一覧ページでページネーション（1ページ8件）
- 各投稿のブックマークで保存（`localStorage`、端末内のみ）／`保存` ページで一覧表示
- 各投稿に「不適切として通報」ボタンを設置（`tip_reports` テーブルへ保存）

## 既存環境への反映

すでに `tips` テーブルだけ作成済みの場合は、`supabase/schema.sql` を再実行してください。  
`tip_reports` テーブルとRLSポリシーが追加されます。

## ローカル確認

静的ファイルを配信できるサーバーで確認します（例: VS Code Live Server）。

## Vercel デプロイ

1. このフォルダを GitHub に push
2. Vercel でリポジトリを Import
3. Framework Preset は `Other`（静的サイト）でデプロイ

特別なビルドコマンドは不要です。
