import { SITUATIONS, EFFECTS, STUTTER_TYPES } from "./constants.js";
import { supabase } from "./supabaseClient.js";

const $form = document.getElementById("tipForm");
const $situation = document.getElementById("situation");
const $effect = document.getElementById("effect");
const $stutterType = document.getElementById("stutterType");
const $triedText = document.getElementById("triedText");
const $submitButton = document.getElementById("submitButton");
const $message = document.getElementById("submitMessage");

function fillSelect(selectEl, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectEl.append(option);
  });
}

function setMessage(message) {
  $message.textContent = message;
}

function validatePayload(payload) {
  if (!SITUATIONS.includes(payload.situation)) {
    return "場面を選択してください。";
  }
  if (!EFFECTS.includes(payload.effect)) {
    return "効果を選択してください。";
  }
  if (!STUTTER_TYPES.includes(payload.stutter_type)) {
    return "吃音のタイプを選択してください。";
  }

  const text = payload.tried_text;
  if (text.length < 8) {
    return "試したことは8文字以上で入力してください。";
  }
  if (text.length > 600) {
    return "試したことは600文字以内で入力してください。";
  }

  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/;
  const phonePattern = /0\d{1,4}[-(]?\d{1,4}[-)]?\d{3,4}/;
  if (emailPattern.test(text) || phonePattern.test(text)) {
    return "個人の連絡先情報は含めないでください。";
  }
  return "";
}

async function handleSubmit(event) {
  event.preventDefault();
  setMessage("");
  $submitButton.disabled = true;
  $submitButton.textContent = "送信中...";

  const payload = {
    situation: $situation.value,
    tried_text: $triedText.value.trim(),
    effect: $effect.value,
    stutter_type: $stutterType.value,
  };
  const validationError = validatePayload(payload);
  if (validationError) {
    setMessage(validationError);
    $submitButton.disabled = false;
    $submitButton.textContent = "投稿する";
    return;
  }

  const { error } = await supabase.from("tips").insert(payload);

  if (error) {
    setMessage("投稿に失敗しました。Supabase設定とRLSポリシーを確認してください。");
    $submitButton.disabled = false;
    $submitButton.textContent = "投稿する";
    return;
  }

  setMessage("投稿しました。ご協力ありがとうございます。");
  $form.reset();
  $submitButton.disabled = false;
  $submitButton.textContent = "投稿する";
}

function init() {
  fillSelect($situation, SITUATIONS);
  fillSelect($effect, EFFECTS);
  fillSelect($stutterType, STUTTER_TYPES);
  $form.addEventListener("submit", handleSubmit);
}

init();
