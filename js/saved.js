import { supabase } from "./supabaseClient.js";
import { createTipCard } from "./tipCard.js";
import { getSavedIds } from "./bookmarks.js";

const $list = document.getElementById("savedList");
const $status = document.getElementById("savedStatus");

function setStatus(message) {
  $status.textContent = message;
}

function refreshEmptyMessage() {
  if ($list.children.length === 0) {
    setStatus("保存した投稿はまだありません。");
  } else {
    setStatus(`${$list.children.length}件を保存中`);
  }
}

async function loadSaved() {
  const ids = getSavedIds();
  $list.innerHTML = "";

  if (ids.length === 0) {
    setStatus("保存した投稿はまだありません。");
    return;
  }

  setStatus("読み込み中...");
  const numericIds = ids.map((id) => Number(id));
  const { data, error } = await supabase.from("tips").select("*").in("id", numericIds);

  if (error) {
    setStatus("読み込みに失敗しました。Supabase設定を確認してください。");
    return;
  }

  const byId = new Map((data ?? []).map((t) => [String(t.id), t]));
  const ordered = ids.map((id) => byId.get(String(id))).filter(Boolean);

  ordered.forEach((tip) => {
    $list.append(createTipCard(tip, { setStatus, supabase, listContext: "saved" }));
  });

  if (ordered.length === 0) {
    setStatus("保存した投稿が見つかりませんでした（削除された可能性があります）。");
    return;
  }

  setStatus(`${ordered.length}件を保存中`);
}

function init() {
  document.addEventListener("kituon-saved-list-changed", refreshEmptyMessage);
  loadSaved();
}

init();
