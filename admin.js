const DB = {
  get(key, def = {}) {
    try { return JSON.parse(localStorage.getItem(key)) ?? def; }
    catch { return def; }
  },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
};

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
  });
});

function addVPN() {
  const name = document.getElementById("vpnName").value.trim();
  const key = document.getElementById("vpnKey").value.trim();
  if (!key) { alert("Введите ключ"); return; }
  const data = DB.get("vpn", {});
  const finalName = name || `VPN #${Object.keys(data).length + 1}`;
  data[finalName] = key;
  DB.set("vpn", data);
  document.getElementById("vpnName").value = "";
  document.getElementById("vpnKey").value = "";
  renderVPN();
}

function delVPN(name) {
  const data = DB.get("vpn", {});
  delete data[name];
  DB.set("vpn", data);
  renderVPN();
}

function renderVPN() {
  const data = DB.get("vpn", {});
  const list = document.getElementById("vpnList");
  list.innerHTML = Object.keys(data).map(name => `
    <li>
      <div class="info">
        <strong>📌 ${name}</strong>
        <small><code>${data[name]}</code></small>
      </div>
      <button class="del" onclick="delVPN('${name}')">Удалить</button>
    </li>`).join("") || "<li>Пусто</li>";
}

function addOlymp() {
  const name = document.getElementById("olympName").value.trim();
  const content = document.getElementById("olympContent").value.trim();
  if (!name || !content) { alert("Заполните поля"); return; }
  const data = DB.get("olympiads", {});
  data[name.toLowerCase()] = { name, content, date: new Date().toLocaleString("ru") };
  DB.set("olympiads", data);
  document.getElementById("olympName").value = "";
  document.getElementById("olympContent").value = "";
  renderOlymp();
}

function delOlymp(key) {
  const data = DB.get("olympiads", {});
  delete data[key];
  DB.set("olympiads", data);
  renderOlymp();
}

function renderOlymp() {
  const data = DB.get("olympiads", {});
  document.getElementById("olympList").innerHTML =
    Object.keys(data).map(k => `
      <li>
        <div class="info">
          <strong>📝 ${data[k].name}</strong>
          <small>${data[k].date}</small>
        </div>
        <button class="del" onclick="delOlymp('${k}')">Удалить</button>
      </li>`).join("") || "<li>Пусто</li>";
}

function addDZ() {
  const s = document.getElementById("dzSubject").value.trim();
  const t = document.getElementById("dzTitle").value.trim();
  const c = document.getElementById("dzContent").value.trim();
  if (!s || !t || !c) { alert("Заполните поля"); return; }
  const data = DB.get("dz", {});
  data[`${s.toLowerCase()}|${t.toLowerCase()}`] = { subject: s, title: t, content: c, date: new Date().toLocaleString("ru") };
  DB.set("dz", data);
  document.getElementById("dzSubject").value = "";
  document.getElementById("dzTitle").value = "";
  document.getElementById("dzContent").value = "";
  renderDZ();
}

function delDZ(key) {
  const data = DB.get("dz", {});
  delete data[key];
  DB.set("dz", data);
  renderDZ();
}

function renderDZ() {
  const data = DB.get("dz", {});
  document.getElementById("dzList").innerHTML =
    Object.entries(data).map(([k, v]) => `
      <li>
        <div class="info">
          <strong>📚 ${v.subject} — ${v.title}</strong>
          <small>${v.date}</small>
        </div>
        <button class="del" onclick="delDZ('${k}')">Удалить</button>
      </li>`).join("") || "<li>Пусто</li>";
}

function addKonsp() {
  const s = document.getElementById("konspSubject").value.trim();
  const t = document.getElementById("konspTitle").value.trim();
  const c = document.getElementById("konspContent").value.trim();
  if (!s || !t || !c) { alert("Заполните поля"); return; }
  const data = DB.get("konspekty", {});
  data[`${s.toLowerCase()}|${t.toLowerCase()}`] = { subject: s, title: t, content: c, date: new Date().toLocaleString("ru") };
  DB.set("konspekty", data);
  document.getElementById("konspSubject").value = "";
  document.getElementById("konspTitle").value = "";
  document.getElementById("konspContent").value = "";
  renderKonsp();
}

function delKonsp(key) {
  const data = DB.get("konspekty", {});
  delete data[key];
  DB.set("konspekty", data);
  renderKonsp();
}

function renderKonsp() {
  const data = DB.get("konspekty", {});
  document.getElementById("konspList").innerHTML =
    Object.entries(data).map(([k, v]) => `
      <li>
        <div class="info">
          <strong>📖 ${v.subject} — ${v.title}</strong>
          <small>${v.date}</small>
        </div>
        <button class="del" onclick="delKonsp('${k}')">Удалить</button>
      </li>`).join("") || "<li>Пусто</li>";
}

function addOTV() {
  const s = document.getElementById("otvSubject").value.trim();
  const t = document.getElementById("otvTopic").value.trim();
  const c = document.getElementById("otvContent").value.trim();
  if (!s || !t || !c) { alert("Заполните поля"); return; }
  const data = DB.get("otv", {});
  data[`${s.toLowerCase()}|${t.toLowerCase()}`] = { subject: s, topic: t, content: c, date: new Date().toLocaleString("ru") };
  DB.set("otv", data);
  document.getElementById("otvSubject").value = "";
  document.getElementById("otvTopic").value = "";
  document.getElementById("otvContent").value = "";
  renderOTV();
}

function delOTV(key) {
  const data = DB.get("otv", {});
  delete data[key];
  DB.set("otv", data);
  renderOTV();
}

function renderOTV() {
  const data = DB.get("otv", {});
  document.getElementById("otvList").innerHTML =
    Object.entries(data).map(([k, v]) => `
      <li>
        <div class="info">
          <strong>✏️ ${v.subject} — ${v.topic}</strong>
          <small>${v.date}</small>
        </div>
        <button class="del" onclick="delOTV('${k}')">Удалить</button>
      </li>`).join("") || "<li>Пусто</li>";
}

function addSubject() {
  const name = document.getElementById("subjectName").value.trim();
  if (!name) return;
  const subs = DB.get("subjects", []);
  if (subs.includes(name)) { alert("Уже есть"); return; }
  subs.push(name);
  DB.set("subjects", subs);
  document.getElementById("subjectName").value = "";
  renderSubjects();
}

function delSubject(name) {
  const subs = DB.get("subjects", []).filter(s => s !== name);
  DB.set("subjects", subs);
  renderSubjects();
}

function renderSubjects() {
  const subs = DB.get("subjects", []);
  document.getElementById("subjectList").innerHTML =
    subs.map(s => `
      <li>
        <div class="info"><strong>📋 ${s}</strong></div>
        <button class="del" onclick="delSubject('${s}')">Удалить</button>
      </li>`).join("") || "<li>Пусто</li>";
}

function renderStepik() {
  const data = DB.get("stepik", {});
  document.getElementById("stepikList").innerHTML =
    Object.entries(data).map(([k, v]) => `
      <li>
        <div class="info">
          <strong>💻 ${k}</strong>
          <small>🔑 ${v.password} | ${v.date}</small>
        </div>
      </li>`).join("") || "<li>Пусто</li>";
}

renderVPN();
renderOlymp();
renderDZ();
renderKonsp();
renderOTV();
renderSubjects();
renderStepik();
