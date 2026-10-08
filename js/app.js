const lsGet = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };

const dbShim = {
  doc(path) {
    const key = "ecotec_db_" + path;
    return {
      async set(data) { localStorage.setItem(key, JSON.stringify(data)); },
      onSnapshot(cb) {
        const fire = () => { const d = lsGet(key); cb({ exists: !!d, data: () => d }); };
        fire();
        window.addEventListener("storage", e => { if (e.key === key) fire(); });
      }
    };
  }
};

function aiShim() {
  const key = localStorage.getItem(API_KEY_STORE);
  if (!key) return null;
  const call = async input => {
    const msgs = typeof input === "string" ? [{ role: "user", content: input }] : input;
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 3000, messages: msgs })
    });
    const d = await r.json();
    if (!r.ok) throw new Error((d.error && d.error.message) || "Error de API");
    return { text: d.content.filter(b => b.type === "text").map(b => b.text).join("") };
  };
  const f = i => call(i);
  f.json = async i => {
    const t = (await call(i)).text;
    return JSON.parse(t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1));
  };
  return f;
}

const rt = {
  async use(n) {
    if (n === "db") return dbShim;
    if (n === "downloads") return {
      save({ filename, data }) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(data);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
        return Promise.resolve();
      }
    };
    if (n === "sample") return aiShim();
    return null;
  }
};

function setKey() {
  const k = prompt("Pega tu clave de API de Anthropic. Se guarda solo en este navegador.");
  if (k !== null) {
    localStorage.setItem(API_KEY_STORE, k.trim());
    alert(k.trim() ? "Clave guardada." : "Clave eliminada.");
  }
}

if (window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

let S;
try { S = JSON.parse(localStorage.getItem("ecotec_v2")); } catch (e) {}
S = S || { h: {}, docs: [], key: "", res: "", prof: "", prods: "", k: { a: {}, ot: {}, ev: {}, notes: "", date: "", sent: false, fin: false, an: null }, m: { 1: {}, 2: {}, 3: {} }, tasks: [], form: "", rem: 8, chat: [] };

const save = () => {
  try { sessionStorage.setItem("ecotec_role", S.role || ""); } catch (e) {}
  if (S.role === "m") {
    try { localStorage.setItem("ecotec_v2", JSON.stringify(S)); } catch (e) {}
  }
};

const $ = s => document.querySelector(s);
const esc = t => String(t ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmt = d => d ? new Date(d + "T12:00").toLocaleDateString("es-CO", { day: "numeric", month: "short" }) : "sin fecha";