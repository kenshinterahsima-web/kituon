const STORAGE_KEY = "kituon_saved_tip_ids";

export function getSavedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function setSavedIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function isSaved(tipId) {
  return getSavedIds().includes(String(tipId));
}

/** @returns {boolean} 保存後の状態（true=保存済み） */
export function toggleSaved(tipId) {
  const sid = String(tipId);
  const ids = [...getSavedIds()];
  const index = ids.indexOf(sid);
  if (index >= 0) {
    ids.splice(index, 1);
    setSavedIds(ids);
    return false;
  }
  ids.push(sid);
  setSavedIds(ids);
  return true;
}
