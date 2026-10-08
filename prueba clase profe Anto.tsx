import React, { useState, useEffect, useRef } from 'react';

// --- Constantes del Programa Ecotec ---
const DIMS = [
  "Salud financiera",
  "Tracción y modelo de negocio",
  "Impacto verificable",
  "Gobierno y reportería",
  "Equipo y ejecución"
];

const Q = [
  [0, "¿Qué estados financieros tienen disponibles?", "o", [["Ninguno formal", 1], ["Solo registros propios o Excel", 2], ["Estados internos sin revisión", 3], ["Firmados por un contador", 4], ["Auditados o revisados por un tercero", 5]]],
  [0, "¿Cuántos meses de operación cubre su caja hoy?", "o", [["Menos de 1 mes", 1], ["1 a 3 meses", 2], ["3 a 6 meses", 3], ["6 a 12 meses", 4], ["Más de 12 meses", 5]]],
  [1, "¿Cómo son sus ingresos hoy?", "o", [["Aún sin ingresos", 1], ["Ventas puntuales, sin recurrencia", 2], ["Algunos clientes repiten", 3], ["Ingresos recurrentes de varios clientes", 4], ["Recurrentes, crecientes y diversificados", 5]]],
  [1, "¿Qué parte de sus ventas viene del cliente más grande?", "o", [["Más del 70%", 1], ["50% a 70%", 2], ["30% a 50%", 3], ["15% a 30%", 4], ["Menos del 15%", 5]]],
  [2, "¿Cómo miden su impacto?", "o", [["No lo miden", 1], ["Cifras sueltas sin fuente", 2], ["Indicadores propios con metodología básica", 3], ["Línea base e indicadores consistentes", 4], ["Verificado por tercero o estándar reconocido", 5]]],
  [2, "¿Con qué soporte cuentan para sus cifras de impacto? (varias)", "m", ["Datos crudos", "Metodología escrita", "Línea base", "Verificación externa", "Alineación con ODS o taxonomía"]],
  [3, "¿Qué obligaciones tienen al día? (varias)", "m", ["Registro mercantil", "RUT y DIAN", "Contabilidad formal", "Seguridad social de empleados", "Impuestos"]],
  [3, "¿Cada cuánto generan reportes de gestión?", "o", [["Nunca", 1], ["Solo cuando se los piden", 2], ["Anual", 3], ["Trimestral", 4], ["Mensual, con indicadores", 5]]],
  [4, "¿Qué dedicación tienen los fundadores?", "o", [["Ninguno dedica tiempo completo", 1], ["Un fundador a tiempo completo", 2], ["Fundadores a tiempo completo, sin equipo", 3], ["Fundadores y equipo básico", 4], ["Equipo completo con roles clave cubiertos", 5]]],
  [4, "¿Qué capacidades clave les faltan? (varias)", "m", ["Finanzas", "Ventas", "Operaciones", "Tecnología", "Medición de impacto", "Jurídico"]]
];

const YC = [
  "Que expliquen el negocio en dos frases",
  "Una métrica semanal que muestre avance",
  "Hablar con clientes antes de construir más",
  "Preguntas difíciles, no órdenes",
  "Cada reto con hipótesis y un experimento de 2 semanas"
];

const Icons = {
  Home: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Docs: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Calendar: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Target: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Lock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Bot: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
  Send: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Mic: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>,
  Upload: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  Database: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>,
  Briefcase: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  ChevronDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
  Activity: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  GraduationCap: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  MessageSquare: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  FileText: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
};

const API_KEY = ""; // Gemini API Key goes here automatically via Canvas

async function callGemini(prompt, systemInstruction, schema = null) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };
  if (schema) {
    payload.generationConfig = { responseMimeType: "application/json", responseSchema: schema };
  }
  try {
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await response.json();
    if(data.candidates && data.candidates.length > 0) return data.candidates[0].content.parts[0].text;
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
}

async function callGeminiChat(history, systemInstruction) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;
  const payload = { contents: history, systemInstruction: { parts: [{ text: systemInstruction }] } };
  try {
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await response.json();
    if(data.candidates && data.candidates.length > 0) return data.candidates[0].content.parts[0].text;
    return null;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return null;
  }
}

export default function App() {
  const [appRole, setAppRole] = useState(null); // 'mentor' | 'entrepreneur' | null
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const LOCAL_STORAGE_KEY = 'ecotec_mvp_session_data';

  // Unified State for MVP (Shared via localStorage)
  const defaultState = {
    mentorName: "Sergio Sandoval",
    profile: "",
    startup: { name: "Deinken", phone: "", mail: "", ventas: "" },
    docs: [], // Mentor docs
    notes: { keyData: "", research: "" },
    kickoff: { answers: {}, other: {}, evidence: {}, notes: "", date: "", sent: false, completed: false, analysis: null },
    sessions: {
      1: { date: "", goal: "", notes: "", qs: [], completed: false },
      2: { date: "", goal: "", notes: "", qs: [], completed: false },
      3: { date: "", goal: "", notes: "", qs: [], completed: false }
    },
    tasks: [],
    mentorChat: [],
    
    // Entrepreneur specific data
    entrepreneurDocs: [], // RAG docs uploaded by Deinken
    entrepreneurChats: [] // Main chat history for Deinken
  };

  const [state, setState] = useState(defaultState);

  // Role-specific UI states
  const [mentorTab, setMentorTab] = useState('inicio');
  const [isMentorChatOpen, setIsMentorChatOpen] = useState(false);
  
  const [entTab, setEntTab] = useState('chat'); // 'chat', 'crono', 'resumenes'
  const [entChatMode, setEntChatMode] = useState('CEO'); // 'CEO', 'Socratico', 'Preparador', 'Simple'
  const [isRagModalOpen, setIsRagModalOpen] = useState(false);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const loadScript = (src) => new Promise(r => {
      const s = document.createElement('script');
      s.src = src; s.onload = r;
      document.body.appendChild(s);
    });
    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js')
    ]).then(() => {
      if(window.pdfjsLib) window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      setScriptsLoaded(true);
    });

    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        setState({ ...defaultState, ...JSON.parse(savedData) });
      } catch (e) {
        console.error("Error parsing local data", e);
      }
    }
  }, []);

  useEffect(() => {
    if (appRole) {
      setIsSaving(true);
      const timer = setTimeout(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
        setIsSaving(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state, appRole]);

  useEffect(() => {
    if (entTab === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.entrepreneurChats, entTab]);

  const handleLogin = (role) => {
    setAppRole(role);
  };

  const handleLogout = () => {
    setAppRole(null);
  };

  const updateState = (key, value) => {
    setState(prev => ({ ...prev, [key]: typeof value === 'function' ? value(prev[key]) : value }));
  };

  const getScore = () => {
    const k = state.kickoff;
    const per = DIMS.map((_, d) => {
      const v = Q.map((q, i) => {
        if (q[0] !== d) return null;
        let s = null;
        if (q[2] === "o" && typeof k.answers[i] === "number") s = q[3][k.answers[i]][1];
        else if (q[2] === "m" && Array.isArray(k.answers[i])) {
          const c = k.answers[i].filter(x => x !== "o").length;
          s = q[4] ? Math.max(1, 5 - c) : Math.max(1, Math.round(1 + 4 * c / q[3].length));
        }
        if (s !== null && !k.evidence[i]) s = Math.min(s, 2);
        return s;
      }).filter(x => x !== null);
      return v.length ? v.reduce((a, b) => a + b) / v.length : null;
    });
    const valid = per.filter(x => x !== null);
    const avg = valid.length ? valid.reduce((a, b) => a + b) / valid.length : 0;
    return { per, avg };
  };

  const isBankable = () => {
    const { avg, per } = getScore();
    return avg >= 3 && per[0] >= 3 && per[3] >= 3;
  };

  const parseFile = async (f) => {
    let text = "";
    if (f.name.toLowerCase().endsWith('.pdf') && window.pdfjsLib) {
      const arrayBuffer = await f.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      for (let i = 1; i <= Math.min(pdf.numPages, 15); i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(x => x.str).join(" ") + "\n";
      }
    } else if (f.name.toLowerCase().endsWith('.docx') && window.mammoth) {
      const arrayBuffer = await f.arrayBuffer();
      const result = await window.mammoth.extractRawText({ arrayBuffer });
      text = result.value;
    } else if (f.name.toLowerCase().match(/\.(txt|csv)$/)) {
      text = await f.text();
    } else {
      text = "Formato no soportado para lectura automática.";
    }
    return text.substring(0, 15000); 
  };

  const handleFileUpload = async (e, targetArrayName) => {
    if (!scriptsLoaded) return alert("Cargando librerías de lectura, por favor intenta en unos segundos.");
    const files = Array.from(e.target.files);
    
    for (const f of files) {
      const newDoc = { id: Date.now()+Math.random(), name: f.name, status: "Leyendo...", content: "" };
      updateState(targetArrayName, prev => [...prev, newDoc]);
      
      try {
        const text = await parseFile(f);
        updateState(targetArrayName, prev => prev.map(d => d.id === newDoc.id ? { ...d, content: text, status: "Procesado" } : d));
      } catch (err) {
        updateState(targetArrayName, prev => prev.map(d => d.id === newDoc.id ? { ...d, status: "Error al leer" } : d));
      }
    }
    e.target.value = '';
  };

  const generateMentorContext = () => {
    const sc = getScore();
    let ctx = `MENTOR: ${state.mentorName} | ESPECIALIDAD/PERFIL: ${state.profile}\nSTARTUP: ${state.startup.name || "Sin nombre"}\n\n`;
    if (state.docs.length > 0) {
      ctx += `--- DOCUMENTOS STARTUP ---\n`;
      state.docs.forEach(d => { ctx += `Archivo [${d.name}]: ${d.content.substring(0, 3000)}...\n`; });
      ctx += `---------------------------\n\n`;
    }
    ctx += `PUNTAJE DIAGNÓSTICO: ${sc.avg.toFixed(1)}/5\n`;
    Q.forEach((q, i) => {
      let ansStr = "Sin respuesta";
      let a = state.kickoff.answers[i];
      if (q[2] === "o" && typeof a === "number") ansStr = q[3][a][0];
      if (q[2] === "m" && Array.isArray(a)) ansStr = a.map(x => q[3][x]).join(", ");
      ctx += `- ${DIMS[q[0]]} | ${q[1]}: ${ansStr} (Evidencia: ${state.kickoff.evidence[i] ? 'Sí' : 'No'})\n`;
    });
    ctx += `\nNOTAS MENTOR KICKOFF: ${state.kickoff.notes}\n`;
    return ctx;
  };

  const handleAnalyzeKickoff = async () => {
    updateState('kickoff', prev => ({ ...prev, sent: true, analysis: { loading: true } }));
    const context = generateMentorContext();
    const isProjectBankable = isBankable();
    const systemPrompt = `Eres un Top-Tier Partner de Y Combinator y analista senior. Evalúa la startup. El proyecto actual ${isProjectBankable ? 'ES BANQUEABLE' : 'NO ES BANQUEABLE'}.
    Si ES banqueable: Genera ruta enfocada en estructuración financiera. Si NO ES banqueable: Enfócate en pivot, PMF, tracción. Alinea las recomendaciones al perfil del mentor (${state.mentorName}).`;
    
    const schema = {
      type: "OBJECT",
      properties: {
        resumen: { type: "STRING" },
        fortalezas: { type: "ARRAY", items: { type: "STRING" } },
        brechas_criticas: { type: "ARRAY", items: { type: "STRING" } },
        ruta_trabajo_yc: { type: "ARRAY", items: { type: "OBJECT", properties: { sesion: { type: "STRING" }, objetivo_estrategico: { type: "STRING" }, hipotesis_a_validar: { type: "STRING" } } } },
        preguntas_incodas_mentor: { type: "ARRAY", items: { type: "STRING" } }
      }
    };
    const result = await callGemini(context, systemPrompt, schema);
    if (result) {
      try { updateState('kickoff', prev => ({ ...prev, analysis: JSON.parse(result) })); } 
      catch (e) { updateState('kickoff', prev => ({ ...prev, analysis: { error: true } })); }
    } else { updateState('kickoff', prev => ({ ...prev, analysis: { error: true } })); }
  };

  const handleGenerateQuestions = async (sessionId) => {
    updateState('sessions', prev => ({ ...prev, [sessionId]: { ...prev[sessionId], qsLoading: true } }));
    const context = generateMentorContext() + `\nObjetivo de sesión ${sessionId}: ${state.sessions[sessionId].goal}`;
    const systemPrompt = "Actúa como Y Combinator Partner. Sugiere 4 preguntas incómodas, de validación extrema para esta sesión. No más de 12 palabras por pregunta.";
    const schema = { type: "OBJECT", properties: { qs: { type: "ARRAY", items: { type: "STRING" } } } };
    const result = await callGemini(context, systemPrompt, schema);
    if (result) {
      try { updateState('sessions', prev => ({ ...prev, [sessionId]: { ...prev[sessionId], qs: JSON.parse(result).qs, qsLoading: false } })); } 
      catch (e) { updateState('sessions', prev => ({ ...prev, [sessionId]: { ...prev[sessionId], qsLoading: false } })); }
    }
  };

  const handleEntSendMessage = async (msgText) => {
    if (!msgText.trim()) return;
    const newHistory = [...state.entrepreneurChats, { role: "user", parts: [{ text: msgText }] }];
    updateState('entrepreneurChats', newHistory);

    let context = `INFORMACIÓN DEL MENTOR (${state.mentorName}):\nEspecialidad/Perfil: ${state.profile}\n\n`;
    
    if (state.kickoff.analysis && !state.kickoff.analysis.error) {
      context += `DIAGNÓSTICO DEL MENTOR SOBRE TU STARTUP (${state.startup.name}):\n`;
      context += `Resumen: ${state.kickoff.analysis.resumen}\n`;
      context += `Brechas críticas: ${state.kickoff.analysis.brechas_criticas?.join(', ')}\n\n`;
    }

    if (state.entrepreneurDocs.length > 0) {
      context += `BASE DE CONOCIMIENTOS (Documentos subidos por la startup):\n`;
      state.entrepreneurDocs.forEach(d => { context += `Doc [${d.name}]: ${d.content.substring(0, 3000)}...\n`; });
      context += `\n`;
    }

    const modeInstructions = {
      'CEO': 'Enfoque en trade-offs, decisiones gerenciales y ventajas competitivas. Responde como un estratega de alto nivel.',
      'Socratico': 'Deducción lógica. No des la respuesta directa, haz preguntas para que el emprendedor llegue a la conclusión.',
      'Preparador': 'Foco en trampas conceptuales y casos de estudio. Sé muy analítico y teórico.',
      'Simple': 'Explicaciones con analogías claras, directas y sin jerga excesiva (estilo ELI5).'
    };

    const systemInstruction = `Eres un Monitor Virtual y Asistente de IA diseñado para apoyar a la startup ${state.startup.name}.
    Tu rol es orientarlos basándote EXCLUSIVAMENTE en:
    1. La experiencia y perfil de su mentor oficial (${state.mentorName}).
    2. El diagnóstico que el mentor ha hecho sobre ellos.
    3. La Base de Conocimientos que la startup ha subido.
    4. Metodología de Y Combinator y estrategia competitiva de Silicon Valley.

    MODO PEDAGÓGICO ACTUAL: ${entChatMode} -> ${modeInstructions[entChatMode]}

    CONTEXTO RECOPILADO:
    ${context}

    Instrucciones de formato: Sé conversacional, estructurado (usa viñetas si es necesario), y siempre mantén el tono de un asesor experto de Ecotec. Si te preguntan algo fuera del contexto de su negocio o estrategia, redirígelos amablemente.`;

    const reply = await callGeminiChat(newHistory, systemInstruction);
    if (reply) {
      updateState('entrepreneurChats', [...newHistory, { role: "model", parts: [{ text: reply }] }]);
    } else {
      updateState('entrepreneurChats', [...newHistory, { role: "model", parts: [{ text: "Ocurrió un error al procesar tu solicitud. Por favor intenta de nuevo." }] }]);
    }
  };

  if (!appRole) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#f8fafc] p-4">
        <div className="flex items-center gap-2 text-[#00317E] text-4xl tracking-wide mb-12">
            <div className="w-12 h-12 rounded-lg bg-[#00A651] text-white flex items-center justify-center font-bold">E</div>
            <span><i>ECO</i><b className="font-bold text-[#00A651]">TECH</b></span>
        </div>
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#dfe7f3] flex flex-col items-center text-center hover:shadow-2xl transition-all cursor-pointer group" onClick={() => handleLogin('mentor')}>
            <div className="w-20 h-20 bg-[#eef4fc] rounded-full flex items-center justify-center text-[#0043A9] mb-6 group-hover:scale-110 transition-transform">
              <Icons.Briefcase />
            </div>
            <h2 className="text-2xl font-black text-[#00317E] mb-2">Ingreso Mentor</h2>
            <p className="text-gray-500 mb-8">Accede al panel de control para diagnosticar, evaluar y hacer seguimiento a tu startup asignada.</p>
            <button className="w-full bg-[#0043A9] text-white py-4 rounded-xl font-bold hover:bg-[#00317E] transition-colors shadow-md">Entrar como {state.mentorName}</button>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#dfe7f3] flex flex-col items-center text-center hover:shadow-2xl transition-all cursor-pointer group" onClick={() => handleLogin('entrepreneur')}>
            <div className="w-20 h-20 bg-[#eef4fc] rounded-full flex items-center justify-center text-[#00A651] mb-6 group-hover:scale-110 transition-transform">
              <Icons.GraduationCap />
            </div>
            <h2 className="text-2xl font-black text-[#00317E] mb-2">Ingreso Startup</h2>
            <p className="text-gray-500 mb-8">Accede a tu monitor virtual, prepara métricas y chatea con el asistente entrenado por tu mentor.</p>
            <button className="w-full bg-[#00A651] text-white py-4 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-md">Entrar como {state.startup.name}</button>
          </div>
        </div>
      </div>
    );
  }

  const renderMentorSidebar = () => {
    const navItems = [
      { id: 'inicio', label: 'Inicio', icon: Icons.Home },
      { id: 'perfil', label: 'Mi perfil', icon: Icons.User },
      { id: 'docs', label: 'Documentos', icon: Icons.Docs },
      { id: 'kickoff', label: 'Diagnóstico IA', icon: Icons.Edit },
      { id: 'm1', label: 'Mentoría 1', icon: () => <span className="font-bold font-mono">1</span> },
      { id: 'm2', label: 'Mentoría 2', icon: () => <span className="font-bold font-mono">2</span> },
      { id: 'm3', label: 'Mentoría 3', icon: () => <span className="font-bold font-mono">3</span> },
    ];
    const isTabLocked = (tab) => {
      if (tab === 'kickoff') return !state.profile || state.profile.length < 20;
      if (tab === 'm1') return !state.kickoff.completed;
      if (tab === 'm2') return !state.sessions[1].completed;
      if (tab === 'm3') return !state.sessions[2].completed;
      return false;
    };
    return (
      <aside className="w-64 bg-[#eef4fc] h-screen sticky top-0 overflow-y-auto flex-col hidden md:flex border-r border-[#dfe7f3]">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2 text-[#00317E] text-2xl tracking-wide mb-2">
            <div className="w-8 h-8 rounded bg-[#00A651] text-white flex items-center justify-center font-bold">E</div><span><i>ECO</i><b className="font-bold text-[#00A651]">TECH</b></span>
          </div>
          <small className="text-[#5b6b8c] text-xs font-medium">Mentor: {state.mentorName}</small>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(item => {
            const locked = isTabLocked(item.id);
            return (
              <button key={item.id} onClick={() => !locked && setMentorTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${mentorTab === item.id ? 'bg-[#0043A9] text-white shadow-md' : 'text-[#10244d] hover:bg-white'} ${locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${mentorTab === item.id ? 'bg-white/20' : 'bg-white text-[#0043A9] shadow-sm'}`}><item.icon /></div>
                {item.label}
                {locked && <span className="ml-auto opacity-70"><Icons.Lock /></span>}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#dfe7f3]">
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 font-medium w-full text-left flex items-center gap-2">Cambiar Rol / Salir</button>
        </div>
      </aside>
    );
  };

  const renderMentorProfile = () => (
    <div className="space-y-6 animate-in fade-in pb-10">
      <div><h2 className="text-2xl font-bold text-[#00317E]">Mi Perfil como Mentor</h2><p className="text-[#5b6b8c] mt-1">Describe tu expertise. La IA usa esto para cruzar tus habilidades con las necesidades de la startup.</p></div>
      <div className="bg-white rounded-2xl p-6 border border-[#dfe7f3] shadow-sm relative">
         <textarea className="w-full min-h-[200px] p-4 border border-[#dfe7f3] rounded-xl focus:ring-2 focus:ring-[#0043A9] outline-none text-gray-700 bg-gray-50 resize-y" placeholder="Ej: Soy experto en estructuración financiera..." value={state.profile} onChange={e => updateState('profile', e.target.value)} />
         {state.profile.length < 20 ? <div className="mt-3 flex items-center gap-2 text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100"><Icons.Lock /> Describe tu perfil detalladamente para habilitar el Diagnóstico IA.</div> : <div className="mt-3 flex items-center gap-2 text-[#00A651] text-sm font-medium bg-green-50 p-3 rounded-lg border border-green-100"><Icons.Check /> Perfil completado. Diagnóstico habilitado.</div>}
      </div>
    </div>
  );

  const renderMentorKickoff = () => {
    if (!state.profile || state.profile.length < 20) return <div className="text-center py-20 animate-in zoom-in-95"><h2 className="text-2xl font-bold text-gray-800 mb-2">Diagnóstico Bloqueado</h2><p className="text-gray-500 mb-6 max-w-md mx-auto">Para que la IA analice correctamente a la startup, primero debes completar tu perfil.</p><button onClick={() => setMentorTab('perfil')} className="bg-[#0043A9] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[#00317E]">Ir a Mi Perfil</button></div>;
    const k = state.kickoff; const sc = getScore(); const bankable = isBankable();
    return (
      <div className="space-y-8 animate-in fade-in pb-10">
        <div><h2 className="text-2xl font-bold text-[#00317E]">Diagnóstico y Kickoff</h2><p className="text-[#5b6b8c] mt-1">Evalúa la situación (30 mins).</p></div>
        <div className="bg-white rounded-2xl border border-[#dfe7f3] shadow-sm divide-y divide-[#dfe7f3]">
          {DIMS.map((dim, dIdx) => (
            <div key={dim} className="p-6">
              <h3 className="font-bold text-[#0043A9] text-lg mb-4 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-[#eef4fc] text-[#0043A9] flex items-center justify-center text-sm">{dIdx + 1}</span>{dim}</h3>
              <div className="space-y-6">
                {Q.filter(q => q[0] === dIdx).map((q) => {
                  const globalIdx = Q.indexOf(q);
                  return (
                    <div key={globalIdx} className="pl-8">
                      <p className="font-medium text-[#10244d] mb-3">{q[1]}</p>
                      <div className="space-y-2">
                        {q[3].map((opt, oIdx) => (
                          <label key={oIdx} className="flex items-start gap-3 cursor-pointer group">
                            <input type={q[2] === 'o' ? 'radio' : 'checkbox'} name={`q_${globalIdx}`} className="mt-1 text-[#0043A9] focus:ring-[#0043A9]" checked={q[2] === 'o' ? k.answers[globalIdx] === oIdx : (k.answers[globalIdx] || []).includes(oIdx)} onChange={(e) => { if (q[2] === 'o') updateState('kickoff', prev => ({...prev, answers: {...prev.answers, [globalIdx]: oIdx}})); else updateState('kickoff', prev => { const curr = prev.answers[globalIdx] || []; return {...prev, answers: {...prev.answers, [globalIdx]: e.target.checked ? [...curr, oIdx] : curr.filter(x => x !== oIdx)}}; }); }} />
                            <span className="text-gray-700">{opt[0] || opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#dfe7f3] shadow-sm"><h3 className="font-bold text-[#00317E] text-lg mb-4 flex items-center gap-2"><Icons.Mic /> Notas del Mentor</h3><textarea className="w-full min-h-[120px] p-4 border border-[#dfe7f3] rounded-xl focus:ring-2 focus:ring-[#0043A9] outline-none text-gray-700 bg-gray-50" placeholder="Impresiones de la charla..." value={k.notes} onChange={e => updateState('kickoff', prev => ({...prev, notes: e.target.value}))} /></div>
        <div className="flex flex-col items-center gap-4 pt-6">
          <button onClick={handleAnalyzeKickoff} className="bg-[#0043A9] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-[#00317E] transition-all flex items-center gap-3 text-lg w-full justify-center"><Icons.Bot /> Consolidar Diagnóstico IA</button>
          {k.analysis?.loading && <div className="text-[#0043A9] animate-pulse mt-4 font-bold">Generando reporte avanzado...</div>}
          {k.analysis && !k.analysis.loading && !k.analysis.error && (
            <div className="w-full bg-[#f8fafc] rounded-2xl p-8 border border-[#cbd5e1] mt-6 shadow-inner">
               <h3 className="text-2xl font-black text-[#00317E] mb-4">Diagnóstico IA Consolidado</h3>
               <div className="space-y-6">
                 <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#0043A9]"><p className="text-gray-800">{k.analysis.resumen}</p></div>
                 <div className="grid md:grid-cols-2 gap-6">
                   <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                     <h4 className="font-bold text-[#00A651] mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00A651]"></div>Fortalezas</h4>
                     <ul className="space-y-2">{(k.analysis.fortalezas || []).map((f,i) => <li key={i} className="text-sm text-gray-700 pl-4 relative before:content-['-'] before:absolute before:left-0 before:text-gray-400">{f}</li>)}</ul>
                   </div>
                   <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                     <h4 className="font-bold text-red-600 mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-600"></div>Brechas Críticas</h4>
                     <ul className="space-y-2">{(k.analysis.brechas_criticas || []).map((b,i) => <li key={i} className="text-sm text-gray-700 pl-4 relative before:content-['-'] before:absolute before:left-0 before:text-gray-400">{b}</li>)}</ul>
                   </div>
                 </div>
                 <div className="mt-8 flex justify-end">
                  <button onClick={() => { updateState('kickoff', prev => ({...prev, completed: true})); setMentorTab('m1'); }} className="bg-[#00A651] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-green-600 transition-all">Aprobar Ruta e Iniciar Mentoría 1</button>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMentorSession = (id) => {
    const s = state.sessions[id];
    return (
      <div className="space-y-6 animate-in fade-in pb-10">
        <h2 className="text-3xl font-black text-[#00317E]">Sesión {id}</h2>
        <div className="grid lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-[#dfe7f3] shadow-sm p-6 relative overflow-hidden">
              <h3 className="font-bold text-[#00317E] mb-4 flex items-center gap-2"><Icons.Bot /> Motor YC</h3>
              <ul className="space-y-4 text-sm text-gray-700 mb-6">
                {s.qs?.length > 0 ? s.qs.map((q, i) => <li key={i} className="flex items-start gap-2 bg-[#eef4fc] p-3 rounded-lg border border-[#dfe7f3]"><span className="text-[#0043A9] font-black shrink-0">Q.</span><span className="font-medium text-[#10244d]">{q}</span></li>) : <p className="text-gray-400 italic text-center py-4">Genera preguntas de validación extrema.</p>}
              </ul>
              <button onClick={() => handleGenerateQuestions(id)} disabled={s.qsLoading} className="w-full bg-[#00317E] text-white py-3 rounded-xl text-sm font-bold shadow-md hover:bg-[#0043A9] transition-colors">Generar Preguntas</button>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-[#dfe7f3] shadow-sm p-6">
              <label className="block font-bold text-[#00317E] mb-3 text-lg">Objetivo Táctico</label>
              <input type="text" className="w-full border-2 border-[#dfe7f3] rounded-xl py-3 px-4 outline-none bg-gray-50 focus:border-[#0043A9]" value={s.goal} onChange={e => updateState('sessions', prev => ({...prev, [id]: {...prev[id], goal: e.target.value}}))} />
            </div>
            <div className="bg-white rounded-2xl border border-[#dfe7f3] shadow-sm p-6">
              <label className="block font-bold text-[#00317E] mb-3 text-lg">Acta y Tareas</label>
              <textarea className="w-full min-h-[150px] border-2 border-[#dfe7f3] bg-gray-50 rounded-xl p-4 outline-none resize-y focus:border-[#0043A9]" placeholder="Agrega notas de la sesión..." value={s.notes} onChange={e => updateState('sessions', prev => ({...prev, [id]: {...prev[id], notes: e.target.value}}))} />
              
              <div className="mt-4 pt-4 border-t border-[#dfe7f3]">
                <h4 className="font-bold text-[#00317E] text-sm mb-2">Asignar nueva tarea</h4>
                <div className="flex gap-2">
                   <input id={`taskInput_${id}`} type="text" placeholder="Ej: Enviar proyecciones" className="flex-1 border border-[#dfe7f3] rounded-lg px-3 py-2 text-sm focus:border-[#0043A9] outline-none" />
                   <button onClick={() => {
                     const val = document.getElementById(`taskInput_${id}`).value;
                     if(val) {
                       updateState('tasks', prev => [...prev, { id: Date.now(), title: val, session: id, completed: false }]);
                       document.getElementById(`taskInput_${id}`).value = '';
                     }
                   }} className="bg-[#0043A9] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#00317E]">Agregar</button>
                </div>
                <div className="mt-4 space-y-2">
                  {state.tasks.filter(t => t.session === id).map(t => (
                    <div key={t.id} className="flex justify-between items-center bg-[#f8fafc] p-2 rounded-lg border border-[#dfe7f3]">
                      <span className={`text-sm ${t.completed ? 'line-through text-gray-400' : 'text-[#10244d] font-medium'}`}>{t.title}</span>
                      <input type="checkbox" className="accent-[#00A651] w-4 h-4 cursor-pointer" checked={t.completed} onChange={() => {
                         updateState('tasks', prev => prev.map(x => x.id === t.id ? {...x, completed: !x.completed} : x));
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={() => updateState('sessions', prev => ({...prev, [id]: {...prev[id], completed: true}}))} className={`px-8 py-4 rounded-xl font-bold shadow-md transition-all text-lg ${s.completed ? 'bg-gray-200 text-gray-600' : 'bg-[#0043A9] text-white hover:bg-[#00317E]'}`}>
                {s.completed ? 'Sesión Cerrada (Actualizar)' : 'Finalizar y Compartir Resumen con Startup'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEntSidebar = () => (
    <aside className="w-72 bg-[#eef4fc] h-screen sticky top-0 overflow-y-auto flex flex-col border-r border-[#dfe7f3] z-20">
      <div className="p-6 pb-4 border-b border-[#dfe7f3] flex items-center justify-between">
         <div className="flex items-center gap-2 text-[#00317E] text-2xl tracking-wide">
            <div className="w-8 h-8 rounded bg-[#00A651] text-white flex items-center justify-center font-bold">E</div>
            <span><i>ECO</i><b className="font-bold text-[#00A651]">TECH</b></span>
         </div>
      </div>
      <div className="px-6 py-4">
        <h3 className="text-xs font-bold text-[#5b6b8c] uppercase tracking-wider mb-1">Startup:</h3>
        <p className="font-bold text-[#00317E] truncate">{state.startup.name}</p>
      </div>
      <div className="px-4 space-y-2 flex-1 mt-2">
        <div>
          <button onClick={() => setEntTab('chat')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${entTab === 'chat' ? 'bg-[#0043A9] text-white shadow-md' : 'text-[#10244d] hover:bg-white'}`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${entTab === 'chat' ? 'bg-white/20' : 'bg-white text-[#0043A9] shadow-sm'}`}><Icons.MessageSquare /></div> Monitor Virtual
          </button>
        </div>
        <div className="pt-4">
           <p className="text-xs font-bold text-[#5b6b8c] uppercase tracking-wider mb-3 px-2">Gestión del Programa</p>
           <button onClick={() => setIsRagModalOpen(true)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#10244d] hover:bg-white transition-colors">
             <Icons.Database /> Base de Conocimientos
           </button>
           <button onClick={() => setEntTab('crono')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${entTab === 'crono' ? 'bg-[#0043A9] text-white font-medium shadow-md' : 'text-[#10244d] hover:bg-white'}`}>
             <Icons.Calendar /> Cronograma y Tareas
           </button>
           <button onClick={() => setEntTab('resumenes')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${entTab === 'resumenes' ? 'bg-[#0043A9] text-white font-medium shadow-md' : 'text-[#10244d] hover:bg-white'}`}>
             <Icons.FileText /> Resúmenes de Mentoría
           </button>
        </div>
      </div>
      <div className="p-4 border-t border-[#dfe7f3]">
        <button onClick={handleLogout} className="text-sm font-medium text-[#5b6b8c] w-full text-left flex items-center gap-2 hover:text-red-500"><Icons.Activity/> Cambiar Rol / Salir</button>
      </div>
    </aside>
  );

  const renderEntHeader = () => (
    <header className="h-16 bg-white border-b border-[#dfe7f3] flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
         <span className="font-bold text-[#00317E]">Monitor de Estrategia • Mentor: {state.mentorName}</span>
         {isSaving && <span className="text-xs text-[#00A651] bg-[#d9f2e4] px-2 py-1 rounded-md font-bold">Guardando...</span>}
      </div>
      <div className="flex items-center gap-3">
         <div className="relative">
           <button onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)} className="flex items-center gap-2 border border-[#dfe7f3] bg-[#eef4fc] px-4 py-2 rounded-xl text-sm font-bold text-[#0043A9] hover:bg-[#D4E5F8] shadow-sm transition-colors">
             <Icons.Briefcase /> Modo: {entChatMode} <Icons.ChevronDown />
           </button>
           {isModeDropdownOpen && (
             <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#dfe7f3] py-2 z-50">
               <div className="px-3 py-2 text-xs font-bold text-[#5b6b8c] uppercase tracking-wider">Modo Pedagógico</div>
               {[
                 { id: 'CEO', label: 'Estratega CEO', desc: 'Enfoque en trade-offs y decisiones.' },
                 { id: 'Socratico', label: 'Método Socrático', desc: 'Deducción paso a paso.' },
                 { id: 'Preparador', label: 'Preparador Teórico', desc: 'Foco en modelos exactos.' },
                 { id: 'Simple', label: 'Intuición Simple (ELI5)', desc: 'Analogías claras.' }
               ].map(m => (
                 <button key={m.id} onClick={() => { setEntChatMode(m.id); setIsModeDropdownOpen(false); }} className={`w-full text-left px-4 py-3 hover:bg-[#eef4fc] flex flex-col gap-1 transition-colors ${entChatMode === m.id ? 'bg-[#f8fafc]' : ''}`}>
                   <div className="flex justify-between items-center"><span className="text-sm font-bold text-[#00317E]">{m.label}</span>{entChatMode === m.id && <span className="text-[#00A651]"><Icons.Check/></span>}</div>
                   <span className="text-xs text-[#5b6b8c]">{m.desc}</span>
                 </button>
               ))}
             </div>
           )}
         </div>
         <div className="w-10 h-10 rounded-full bg-[#00A651] text-white flex items-center justify-center font-bold text-lg shadow-sm">
           {state.startup.name.charAt(0)}
         </div>
      </div>
    </header>
  );

  const renderEntChat = () => (
    <div className="flex-1 flex flex-col bg-[#f8fafc] h-[calc(100vh-64px)] relative">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {state.entrepreneurChats.length === 0 && (
          <div className="max-w-3xl mx-auto mt-10">
            <div className="flex justify-center mb-6">
              <span className="bg-[#00A651] text-white px-6 py-2 rounded-full text-sm font-bold shadow-md flex items-center gap-2">
                <Icons.Bot /> Domina tu Estrategia y Levanta Capital
              </span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
               <button onClick={() => handleEntSendMessage("¿Cuáles son los principales trade-offs de mi modelo de negocio?")} className="bg-white border border-[#dfe7f3] rounded-xl px-5 py-3 text-sm font-bold text-[#0043A9] hover:bg-[#eef4fc] hover:shadow-sm transition-all text-center">
                 "¿Cuáles son los principales trade-offs de mi modelo de negocio?"
               </button>
               <button onClick={() => handleEntSendMessage("Ayúdame a preparar las métricas para la mentoría con Sergio.")} className="bg-white border border-[#dfe7f3] rounded-xl px-5 py-3 text-sm font-bold text-[#0043A9] hover:bg-[#eef4fc] hover:shadow-sm transition-all text-center">
                 "Ayúdame a preparar las métricas para la mentoría."
               </button>
               <button onClick={() => handleEntSendMessage("Resume el diagnóstico que hizo el mentor sobre la startup.")} className="bg-white border border-[#dfe7f3] rounded-xl px-5 py-3 text-sm font-bold text-[#0043A9] hover:bg-[#eef4fc] hover:shadow-sm transition-all text-center">
                 "Resume el diagnóstico del mentor."
               </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#dfe7f3] shadow-sm flex gap-4">
              <div className="w-12 h-12 bg-[#eef4fc] rounded-full flex items-center justify-center text-[#0043A9] shrink-0"><Icons.GraduationCap /></div>
              <div>
                <p className="text-[#10244d] leading-relaxed">
                  Hola, soy el <b>Monitor de Estrategia Ecotec</b>. Estoy aquí para orientarte basándome en los modelos teóricos de aceleración, la experiencia de tu mentor <b>{state.mentorName}</b>, y los documentos que hayas cargado en la Base de Conocimientos.
                </p>
                <div className="mt-4 flex gap-3">
                  <span className="inline-flex items-center gap-1 bg-[#eef4fc] text-[#0043A9] px-3 py-1 rounded-lg text-xs font-bold"><Icons.Briefcase /> Modo: {entChatMode}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-6 pb-20">
          {state.entrepreneurChats.map((msg, idx) => (
             <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-[#00A651] text-white flex items-center justify-center shrink-0 mt-1 shadow-sm"><Icons.Bot /></div>}
                <div className={`p-5 rounded-2xl text-[15px] leading-relaxed max-w-[85%] whitespace-pre-wrap shadow-sm ${msg.role === 'user' ? 'bg-[#0043A9] text-white rounded-br-sm' : 'bg-white border border-[#dfe7f3] text-[#10244d] rounded-bl-sm'}`}>
                  {msg.parts[0].text}
                </div>
                {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-[#00A651] text-white flex items-center justify-center shrink-0 mt-1 font-bold text-xs shadow-sm">{state.startup.name.charAt(0)}</div>}
             </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#f8fafc] via-[#f8fafc] to-transparent pt-10 pb-6 px-6">
        <div className="max-w-4xl mx-auto">
          <form className="relative bg-white rounded-2xl shadow-lg border border-[#dfe7f3] flex items-center p-2" onSubmit={e => { e.preventDefault(); const i = e.target.elements.q; handleEntSendMessage(i.value); i.value = ''; }}>
             <button type="button" className="p-3 text-[#5b6b8c] hover:text-[#0043A9] transition-colors"><Icons.Mic /></button>
             <input name="q" type="text" placeholder="Haz una consulta de estrategia, prepara tu pitch o revisa tareas..." className="flex-1 bg-transparent border-none focus:outline-none px-2 text-[#10244d]" autoComplete="off" />
             <button type="submit" className="p-3 bg-[#0043A9] text-white rounded-xl hover:bg-[#00317E] transition-colors shadow-sm"><Icons.Send /></button>
          </form>
          <p className="text-center text-xs text-[#5b6b8c] mt-3 uppercase tracking-wider font-bold">Monitor de Estrategia • Ecotec AI</p>
        </div>
      </div>
    </div>
  );

  const renderEntRagModal = () => {
    if (!isRagModalOpen) return null;
    return (
      <div className="fixed inset-0 bg-[#00317E]/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
        <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col h-[80vh] overflow-hidden animate-in zoom-in-95">
          <div className="bg-[#00317E] p-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#00A651] text-white flex items-center justify-center shadow-inner"><Icons.Database /></div>
              <div>
                <h2 className="font-bold text-xl leading-none">Gestión y Base de Conocimientos (RAG)</h2>
                <p className="text-[#dbe8fb] text-sm mt-1">{state.entrepreneurDocs.length} Documentos Activos en IA</p>
              </div>
            </div>
            <button onClick={() => setIsRagModalOpen(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">&times;</button>
          </div>
          
          <div className="p-6 bg-[#f8fafc] border-b border-[#dfe7f3] flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[#00317E] text-lg">Cargar Documentos de la Startup</h3>
              <p className="text-sm text-[#5b6b8c]">Sube finanzas, pitch decks o research. La IA los usará para responder tus dudas.</p>
            </div>
            <label className="cursor-pointer bg-[#0043A9] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#00317E] transition-colors shadow-md">
               <Icons.Upload /> Cargar Archivo (PDF/DOCX)
               <input type="file" multiple accept=".pdf,.docx,.txt" className="hidden" onChange={(e) => handleFileUpload(e, 'entrepreneurDocs')} />
            </label>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">
             {state.entrepreneurDocs.length === 0 ? (
               <div className="text-center py-20 text-[#5b6b8c] border-2 border-dashed border-[#dfe7f3] rounded-2xl bg-white">
                 <div className="w-16 h-16 bg-[#eef4fc] text-[#0043A9] rounded-full flex items-center justify-center mx-auto mb-4"><Icons.FileText /></div>
                 <p className="font-bold text-lg text-[#00317E]">Base de datos vacía</p>
                 <p className="mt-1 text-sm">No has subido documentos a la base de conocimientos.</p>
               </div>
             ) : (
               <div className="grid md:grid-cols-2 gap-6">
                 {state.entrepreneurDocs.map(doc => (
                   <div key={doc.id} className="bg-white p-6 rounded-2xl border border-[#dfe7f3] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                     <div>
                       <div className="flex justify-between items-start mb-3">
                         <span className="text-xs font-bold bg-[#d9f2e4] text-[#00A651] px-3 py-1.5 rounded-lg flex items-center gap-1"><Icons.Activity /> Activo en IA</span>
                       </div>
                       <h4 className="font-bold text-[#00317E] truncate mb-2 text-lg">{doc.name}</h4>
                       <p className="text-sm text-[#5b6b8c] line-clamp-3">{doc.content ? doc.content : 'Procesando contenido...'}</p>
                     </div>
                     <div className="mt-5 pt-4 border-t border-[#dfe7f3] flex justify-between items-center text-xs font-bold">
                        <span className="text-[#0043A9] bg-[#eef4fc] px-2 py-1 rounded">{doc.status}</span>
                        <button onClick={() => updateState('entrepreneurDocs', prev => prev.filter(d => d.id !== doc.id))} className="text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg transition-colors">Eliminar</button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    );
  };

  const renderEntCrono = () => (
    <div className="p-8 max-w-4xl mx-auto h-[calc(100vh-64px)] overflow-y-auto">
      <h2 className="text-3xl font-black text-[#00317E] mb-8 flex items-center gap-3"><div className="w-10 h-10 bg-[#eef4fc] text-[#0043A9] rounded-xl flex items-center justify-center"><Icons.Calendar /></div> Cronograma y Tareas</h2>
      <div className="bg-white rounded-3xl border border-[#dfe7f3] shadow-sm p-8">
        {state.tasks.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-[#eef4fc] text-[#0043A9] rounded-full flex items-center justify-center mx-auto mb-4"><Icons.Check /></div>
            <p className="text-[#5b6b8c] text-lg font-medium">No tienes tareas asignadas por el mentor aún.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {state.tasks.map(t => (
              <li key={t.id} className={`flex items-center justify-between p-5 rounded-2xl border ${t.completed ? 'bg-[#f8fafc] border-[#dfe7f3]' : 'bg-white border-[#0043A9] shadow-sm'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded flex items-center justify-center border-2 ${t.completed ? 'bg-[#00A651] border-[#00A651] text-white' : 'border-[#0043A9] bg-white'}`}>
                    {t.completed && <Icons.Check />}
                  </div>
                  <span className={`font-bold text-lg ${t.completed ? 'text-[#5b6b8c] line-through' : 'text-[#00317E]'}`}>{t.title}</span>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${t.completed ? 'text-[#5b6b8c] bg-[#eef4fc]' : 'text-[#0043A9] bg-[#eef4fc]'}`}>Sesión {t.session}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const renderEntResumenes = () => (
    <div className="p-8 max-w-4xl mx-auto h-[calc(100vh-64px)] overflow-y-auto">
      <h2 className="text-3xl font-black text-[#00317E] mb-8 flex items-center gap-3"><div className="w-10 h-10 bg-[#eef4fc] text-[#0043A9] rounded-xl flex items-center justify-center"><Icons.FileText /></div> Resúmenes de Mentoría</h2>
      <div className="space-y-6">
        <div className={`bg-white rounded-3xl border ${state.kickoff.completed ? 'border-[#0043A9] shadow-md' : 'border-[#dfe7f3] border-dashed opacity-70'} p-8 transition-all`}>
           <div className="flex justify-between items-center mb-6 border-b border-[#dfe7f3] pb-4">
             <h3 className="text-xl font-bold text-[#00317E]">Diagnóstico Kickoff</h3>
             {state.kickoff.completed ? <span className="bg-[#d9f2e4] text-[#00A651] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">Desbloqueado</span> : <span className="bg-[#eef4fc] text-[#5b6b8c] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-2"><Icons.Lock /> Bloqueado</span>}
           </div>
           {state.kickoff.completed ? (
             <div className="prose prose-sm max-w-none text-[#10244d] space-y-4">
               <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#dfe7f3]"><p className="font-bold text-[#00317E] mb-1">Análisis Estructural:</p> {state.kickoff.analysis?.resumen}</div>
               <div className="bg-red-50 p-4 rounded-xl border border-red-100"><p className="font-bold text-red-700 mb-1">Brechas Críticas a trabajar:</p> {state.kickoff.analysis?.brechas_criticas?.join(', ')}</div>
             </div>
           ) : <p className="text-[#5b6b8c] font-medium">Este resumen estará disponible cuando el mentor finalice la sesión.</p>}
        </div>

        {[1, 2, 3].map(i => {
           const s = state.sessions[i];
           return (
             <div key={i} className={`bg-white rounded-3xl border ${s.completed ? 'border-[#0043A9] shadow-md' : 'border-[#dfe7f3] border-dashed opacity-70'} p-8 transition-all`}>
               <div className="flex justify-between items-center mb-6 border-b border-[#dfe7f3] pb-4">
                 <h3 className="text-xl font-bold text-[#00317E]">Sesión de Mentoría {i}</h3>
                 {s.completed ? <span className="bg-[#d9f2e4] text-[#00A651] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">Desbloqueado</span> : <span className="bg-[#eef4fc] text-[#5b6b8c] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-2"><Icons.Lock /> Bloqueado</span>}
               </div>
               {s.completed ? (
                 <div className="prose prose-sm max-w-none text-[#10244d] space-y-4">
                   <div className="bg-[#eef4fc] p-4 rounded-xl border border-[#dfe7f3]"><p className="font-bold text-[#0043A9] mb-1">Objetivo Alcanzado:</p> {s.goal}</div>
                   <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#dfe7f3]"><p className="font-bold text-[#10244d] mb-1">Notas / Acta de sesión:</p> <span className="whitespace-pre-wrap">{s.notes}</span></div>
                 </div>
               ) : <p className="text-[#5b6b8c] font-medium">Se desbloqueará al finalizar la sesión con tu mentor.</p>}
             </div>
           )
        })}
      </div>
    </div>
  );

  if (appRole === 'mentor') {
    return (
      <div className="flex h-screen bg-white font-sans text-[#10244d]">
        {renderMentorSidebar()}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <header className="hidden md:flex justify-between items-center px-10 py-5 bg-white border-b border-[#dfe7f3] sticky top-0 z-10 shadow-sm">
            <div>
              <h2 className="font-black text-2xl text-[#00317E]">{state.startup.name || "Ecotec Mentor Panel"}</h2>
              {isSaving && <p className="text-xs text-[#00A651] font-bold mt-1">Guardando localmente...</p>}
            </div>
            <button onClick={() => setIsMentorChatOpen(!isMentorChatOpen)} className="flex items-center gap-3 px-6 py-3 bg-[#eef4fc] text-[#0043A9] rounded-xl font-bold hover:bg-[#D4E5F8] transition-colors border border-[#D4E5F8]">
              <Icons.Bot /> Analista IA
            </button>
          </header>
          <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#f8fafc]">
            <div className="max-w-5xl mx-auto">
              {mentorTab === 'inicio' && <div className="text-center mt-20"><h2 className="text-2xl font-bold text-[#00317E]">Bienvenido al entorno de evaluación</h2><p className="text-[#5b6b8c] mt-4">Usa el menú lateral para gestionar el kickoff y las mentorías.</p></div>}
              {mentorTab === 'perfil' && renderMentorProfile()}
              {mentorTab === 'kickoff' && renderMentorKickoff()}
              {mentorTab === 'm1' && renderMentorSession(1)}
              {mentorTab === 'm2' && renderMentorSession(2)}
              {mentorTab === 'm3' && renderMentorSession(3)}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (appRole === 'entrepreneur') {
    return (
      <div className="flex h-screen bg-[#f8fafc] font-sans">
        {renderEntSidebar()}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {renderEntHeader()}
          {entTab === 'chat' && renderEntChat()}
          {entTab === 'crono' && renderEntCrono()}
          {entTab === 'resumenes' && renderEntResumenes()}
          {renderEntRagModal()}
        </main>
      </div>
    );
  }

  return null;
}