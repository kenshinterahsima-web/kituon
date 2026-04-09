import { SITUATIONS, EFFECTS, STUTTER_TYPES } from "./constants.js";
import { supabase } from "./supabaseClient.js";
import { createTipCard } from "./tipCard.js";

const $situation = document.getElementById("filterSituation");
const $type = document.getElementById("filterType");
const $effect = document.getElementById("filterEffect");
const $sortOrder = document.getElementById("sortOrder");
const $tipsList = document.getElementById("tipsList");
const $status = document.getElementById("statusMessage");
const $reload = document.getElementById("reloadButton");
const $prevPage = document.getElementById("prevPageButton");
const $nextPage = document.getElementById("nextPageButton");
const $pageInfo = document.getElementById("pageInfo");

let allTips = [];
let currentPage = 1;
const pageSize = 8;

function setStatus(message) {
  $status.textContent = message;
}

function fillSelect(selectEl, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectEl.append(option);
  });
}

function getFilteredSortedTips() {
  const situation = $situation.value;
  const stutterType = $type.value;
  const effect = $effect.value;

  const filtered = allTips.filter((tip) => {
    const situationMatch = !situation || tip.situation === situation;
    const typeMatch = !stutterType || tip.stutter_type === stutterType;
    const effectMatch = !effect || tip.effect === effect;
    return situationMatch && typeMatch && effectMatch;
  });
  return sortTips(filtered, $sortOrder.value);
}

function renderTips() {
  const sorted = getFilteredSortedTips();
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;
  const start = (currentPage - 1) * pageSize;
  const pageItems = sorted.slice(start, start + pageSize);

  $tipsList.innerHTML = "";

  if (pageItems.length === 0) {
    setStatus("条件に一致する投稿がありません。");
    updatePagination(1, 1);
    return;
  }

  setStatus(`${sorted.length}件中 ${start + 1}-${start + pageItems.length}件を表示`);
  pageItems.forEach((tip) =>
    $tipsList.append(
      createTipCard(tip, { setStatus, supabase, listContext: "list" })
    )
  );
  updatePagination(currentPage, totalPages);
}

function effectRank(effect) {
  if (effect === "めちゃ効いた") return 3;
  if (effect === "少し効いた") return 2;
  return 1;
}

function sortTips(tips, sortOrder) {
  const clone = [...tips];
  if (sortOrder === "oldest") {
    return clone.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }
  if (sortOrder === "effect_desc") {
    return clone.sort((a, b) => {
      const effectDiff = effectRank(b.effect) - effectRank(a.effect);
      if (effectDiff !== 0) return effectDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }
  return clone.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

async function fetchTips() {
  setStatus("投稿を読み込み中...");
  const { data, error } = await supabase
    .from("tips")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    setStatus("読み込みに失敗しました。Supabase設定を確認してください。");
    return;
  }

  allTips = data ?? [];
  currentPage = 1;
  renderTips();
}

function updatePagination(page, totalPages) {
  $pageInfo.textContent = `${page} / ${totalPages}`;
  $prevPage.disabled = page <= 1;
  $nextPage.disabled = page >= totalPages;
}

function init() {
  fillSelect($situation, SITUATIONS);
  fillSelect($type, STUTTER_TYPES);
  fillSelect($effect, EFFECTS);

  [$situation, $type, $effect, $sortOrder].forEach((el) =>
    el.addEventListener("change", () => {
      currentPage = 1;
      renderTips();
    })
  );
  $reload.addEventListener("click", fetchTips);
  $prevPage.addEventListener("click", () => {
    currentPage -= 1;
    renderTips();
  });
  $nextPage.addEventListener("click", () => {
    currentPage += 1;
    renderTips();
  });

  fetchTips();
}

init();
