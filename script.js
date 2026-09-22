const DB = {
  get(key, def = {}) {
    try { return JSON.parse(localStorage.getItem(key)) ?? def; }
    catch { return def; }
  },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
};

const DEFAULT_SUBJECTS = ["Алгебра","Геометрия","Русский язык","Литература",
  "История","Обществознание","Физика","Химия","Биология","География",
  "Английский язык","Информатика"];

if (!DB.get("subjects", null)) DB.set("subjects", DEFAULT_SUBJECTS);

function parseSide(side) {
  side = side.replace(/\s/g, "");
  if (side && !"+-".includes(side[0])) side = "+" + side;
  const terms = side.match(/[+-][^+-]+/g) || [];
  let a = 0, b = 0;
  for (const term of terms) {
    const sign = term[0] === "-" ? -1 : 1;
    const body = term.slice(1);
    if (!body) continue;
    if (/[a-zA-Zа-яА-Я]/.test(body)) {
      const nums = body.replace(/[a-zA-Zа-яА-Я]/g, "");
      if (nums === "" || nums === "+") a += sign * 1;
      else if (nums === "-") a += sign * -1;
      else a += sign * parseFloat(nums);
    } else {
      b += sign * parseFloat(body);
    }
  }
  return [a, b];
}

function fmt(n) {
  if (Number.isInteger(n)) return String(n);
  return String(n);
}

function solveEquation(eq) {
  eq = eq.replace(/\s/g, "");
  if (!eq.includes("=")) return "❌ Нет знака '='!";
  const [left, right] = eq.split("=", 2);
  const [a1, b1] = parseSide(left);
  const [a2, b2] = parseSide(right);
  const A = a1 - a2, B = b1 - b2;

  let out = `📝 Уравнение: ${left} = ${right}\n\n`;
  out += `Шаг 1. Переносим всё в левую часть:\n`;
  let lp = [];
  if (a1) lp.push(`${fmt(a1)}x`);
  if (b1) lp.push(fmt(b1));
  let rp = [];
  if (a2) rp.push(`${a2 > 0 ? "-" : "+"}${fmt(Math.abs(a2))}x`);
  if (b2) rp.push(`${b2 > 0 ? "-" : "+"}${fmt(Math.abs(b2))}`);
  out += `   ${lp.join(" ") || "0"} ${rp.join(" ")} = 0\n\n`;
  out += `Шаг 2. Приводим подобные:\n   ${fmt(A)}x + ${fmt(B)} = 0\n\n`;
  out += `Шаг 3. Переносим число:\n   ${fmt(A)}x = ${fmt(-B)}\n\n`;
  if (A === 0) {
    out += B === 0 ? "✅ x — любое число" : "❌ Решений нет";
    return out;
  }
  const x = -B / A;
  out += `Шаг 4. Делим на коэффициент:\n   x = ${fmt(-B)} / ${fmt(A)}\n\n`;
  out += `✅ Ответ: x = ${fmt(x)}`;
  return out;
}

function solveRussian(task) {
  const tl = task.toLowerCase();
  if (tl.includes("встав") || task.includes("_")) {
    return "🔤 Вставить пропущенные буквы:\n1. Прочитай слово\n2. Определи часть слова\n3. Вспомни правило\n4. Вставь букву";
  }
  if (tl.includes("морфолог")) {
    return "🔍 Морфологический разбор:\n1. Часть речи\n2. Начальная форма\n3. Постоянные признаки\n4. Непостоянные\n5. Синтаксическая роль";
  }
  if (tl.includes("синтакс")) {
    return "📖 Синтаксический разбор:\n1. Грамматическая основа\n2. Тип предложения\n3. Второстепенные члены\n4. Схема";
  }
  return "🤔 Уточни задание (например: «вставить буквы», «морфологический разбор»)";
}

const chatBody = document.getElementById("chatBody");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

let currentState = null;

function addMsg(text, who = "bot") {
  const div = document.createElement("div");
  div.className = `msg ${who}`;
  div.textContent = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function botSay(text) { addMsg(text, "bot"); }
function userSay(text) { addMsg(text, "user"); }

function showMainMenu() {
  botSay("👋 Привет! Выбери действие слева или напиши команду:\n\n" +
    "• 💻 Информатика\n" +
    "• 🧮 Решить уравнение\n" +
    "• 📚 Русский язык\n" +
    "• 📝 Олимпиады\n" +
    "• 📚 ЦДЗ\n" +
    "• 📖 Конспекты\n" +
    "• ✏️ Ответы\n" +
    "• 🔐 VPN\n" +
    "• 💬 Поддержка");
}

botSay("👋 Привет! Я бот-помощник. Напиши /start или выбери пункт меню.");

function handleMessage(text) {
  const t = text.trim();
  const low = t.toLowerCase();

  if (currentState === "eq") {
    currentState = null;
    botSay(solveEquation(t));
    return;
  }
  if (currentState === "rus") {
    currentState = null;
    botSay(solveRussian(t));
    return;
  }
  if (currentState === "support") {
    currentState = null;
    const msgs = DB.get("support", []);
    msgs.push({ text: t, date: new Date().toLocaleString("ru") });
    DB.set("support", msgs);
    botSay("✅ Сообщение отправлено владельцу!");
    return;
  }
  if (currentState === "stepik") {
    currentState = null;
    if (!t.includes(":")) { botSay("❌ Формат: почта:пароль"); return; }
    const [email, pass] = t.split(":", 2);
    const data = DB.get("stepik", {});
    data[email.trim()] = { email: email.trim(), password: pass.trim(), date: new Date().toLocaleString("ru") };
    DB.set("stepik", data);
    botSay(`✅ Данные Stepik сохранены!\n📧 ${email.trim()}`);
    return;
  }

  if (low === "/start" || low === "начать" || low === "меню") {
    showMainMenu(); return;
  }
  if (low === "/help" || low === "помощь") {
    botSay("Команды:\n/start — меню\n/vpn — VPN-ключи\n/stepik — ввести данные Stepik\n/equation — решить уравнение");
    return;
  }

  if (low.includes("информатика")) {
    botSay("💻 Категория: Информатика\n\nНапиши /stepik чтобы ввести данные.");
    return;
  }
  if (low.includes("уравнен") || low === "/equation") {
    currentState = "eq";
    botSay("🧮 Отправь уравнение. Пример: 2x + 3 = 7");
    return;
  }
  if (low.includes("русск")) {
    currentState = "rus";
    botSay("📚 Напиши задание по русскому языку.");
    return;
  }
  if (low.includes("олимпиад")) {
    const data = DB.get("olympiads", {});
    const keys = Object.keys(data);
    if (!keys.length) { botSay("📭 Пока нет олимпиад."); return; }
    botSay("📝 Доступные олимпиады:\n\n" + keys.map((k, i) => `${i + 1}. ${data[k].name}`).join("\n") +
      "\n\nНапиши название, чтобы увидеть содержание.");
    return;
  }
  if (low.includes("цдз") || low.includes("дз")) {
    const data = DB.get("dz", {});
    const groups = {};
    Object.values(data).forEach(v => (groups[v.subject] ||= []).push(v.title));
    const subs = Object.keys(groups);
    if (!subs.length) { botSay("📭 Пока нет ДЗ."); return; }
    botSay("📚 Доступные ДЗ:\n\n" + subs.map((s, i) => `${i + 1}. ${s} (${groups[s].length})`).join("\n"));
    return;
  }
  if (low.includes("конспект")) {
    const data = DB.get("konspekty", {});
    const groups = {};
    Object.values(data).forEach(v => (groups[v.subject] ||= []).push(v.title));
    const subs = Object.keys(groups);
    if (!subs.length) { botSay("📭 Пока нет конспектов."); return; }
    botSay("📖 Доступные конспекты:\n\n" + subs.map((s, i) => `${i + 1}. ${s} (${groups[s].length})`).join("\n"));
    return;
  }
  if (low.includes("ответ")) {
    const data = DB.get("otv", {});
    const groups = {};
    Object.values(data).forEach(v => (groups[v.subject] ||= []).push(v.topic));
    const subs = Object.keys(groups);
    if (!subs.length) { botSay("📭 Пока нет ответов."); return; }
    botSay("✏️ Ответы на темы:\n\n" + subs.map((s, i) => `${i + 1}. ${s} (${groups[s].length})`).join("\n"));
    return;
  }
  if (low.includes("vpn") || low === "/vpn") {
    const data = DB.get("vpn", {});
    const keys = Object.keys(data);
    if (!keys.length) { botSay("❌ Пока нет доступных VPN-ключей."); return; }
    botSay("🔐 Доступные VPN-ключи:\n\n" + keys.map(k => `📌 ${k}:\n${data[k]}`).join("\n\n"));
    return;
  }
  if (low.includes("поддержк") || low === "/support") {
    currentState = "support";
    botSay("💬 Напиши сообщение владельцу.");
    return;
  }
  if (low === "/stepik") {
    currentState = "stepik";
    botSay("📧 Введите почта:пароль от Stepik");
    return;
  }

  botSay("❓ Не понял команду. Напиши /start или выбери пункт слева.");
}

sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;
  userSay(text);
  input.value = "";
  setTimeout(() => handleMessage(text), 250);
});

input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendBtn.click();
});

document.querySelectorAll(".menu-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    const labels = {
      informatics: "💻 Информатика",
      equation: "🧮 Решить уравнение",
      russian: "📚 Русский язык",
      olympiads: "📝 Олимпиады",
      dz: "📚 ЦДЗ",
      konspekty: "📖 Конспекты",
      otv: "✏️ Ответы",
      vpn: "🔐 VPN",
      support: "💬 Поддержка"
    };
    userSay(labels[action]);
    setTimeout(() => handleMessage(labels[action]), 250);
  });
});
