import { isSaved, toggleSaved } from "./bookmarks.js";

function bookmarkSvg(filled) {
  if (filled) {
    return `<svg class="tip-bookmark-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M6.32 2.577a49.716 49.716 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clip-rule="evenodd"/></svg>`;
  }
  return `<svg class="tip-bookmark-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"/></svg>`;
}

function updateBookmarkButton(btn, saved) {
  btn.classList.toggle("tip-bookmark--saved", saved);
  btn.setAttribute("aria-label", saved ? "保存から削除" : "保存");
  btn.innerHTML = bookmarkSvg(saved);
}

/**
 * @param {object} tip
 * @param {{ setStatus?: (msg: string) => void; supabase: object | null; listContext?: "list" | "saved" }} options
 */
export function createTipCard(tip, options = {}) {
  const { setStatus = () => {}, supabase, listContext = "list" } = options;

  const item = document.createElement("article");
  item.className = "tip-item";

  const topRow = document.createElement("div");
  topRow.className = "tip-item-top";

  const meta = document.createElement("div");
  meta.className = "tip-meta";
  meta.innerHTML = `
    <span class="tag">${escapeHtml(tip.situation)}</span>
    <span class="tag">${escapeHtml(tip.stutter_type)}</span>
    <span class="tag">${escapeHtml(tip.effect)}</span>
  `;

  const bookmarkBtn = document.createElement("button");
  bookmarkBtn.type = "button";
  bookmarkBtn.className = "tip-bookmark";
  updateBookmarkButton(bookmarkBtn, isSaved(tip.id));

  bookmarkBtn.addEventListener("click", () => {
    const now = toggleSaved(tip.id);
    updateBookmarkButton(bookmarkBtn, now);
    if (listContext === "saved" && !now) {
      item.remove();
      document.dispatchEvent(new CustomEvent("kituon-saved-list-changed"));
    }
  });

  topRow.append(meta, bookmarkBtn);

  const text = document.createElement("p");
  text.className = "tip-text";
  text.textContent = tip.tried_text;

  const reportButton = document.createElement("button");
  reportButton.className = "tip-report-button";
  reportButton.type = "button";
  reportButton.textContent = "不適切として通報";
  reportButton.addEventListener("click", () => reportTip(tip.id, reportButton, supabase, setStatus));

  item.append(topRow, text, reportButton);
  return item;
}

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

async function reportTip(tipId, buttonEl, supabase, setStatus) {
  if (!supabase) {
    setStatus("通報機能を使うには Supabase設定が必要です。");
    return;
  }
  const ok = window.confirm("この投稿を不適切として通報しますか？");
  if (!ok) return;

  buttonEl.disabled = true;
  buttonEl.textContent = "通報中...";
  const { error } = await supabase.from("tip_reports").insert({ tip_id: tipId });

  if (error) {
    setStatus("通報に失敗しました。時間をおいて再度お試しください。");
    buttonEl.disabled = false;
    buttonEl.textContent = "不適切として通報";
    return;
  }

  buttonEl.textContent = "通報済み";
}
