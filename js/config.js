const API_KEY_STORE = "ecotec_api_key";

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
  [4, "¿Qué capacidades clave les faltan? (varias)", "m", ["Finanzas", "Ventas", "Operaciones", "Tecnología", "Medición de impacto", "Jurídico"], true]
];

const YC = [
  "Que expliquen el negocio en dos frases",
  "Una métrica semanal que muestre avance",
  "Hablar con clientes antes de construir más",
  "Preguntas difíciles, no órdenes",
  "Cada reto con hipótesis y un experimento de 2 semanas"
];

const STARTUPS = ["R&R Kelab", "Porliviano", "Fundación Aquí Sí Hay Futuro", "Ecosiembra", "Industrias GM", "Moderas Constructores", "Chocofruts", "Humusapiens Ecolab", "Más Centígrados", "Tunjo Smart Solutions", "Denken", "Coffee Kreis", "Somos Martina", "Innovation Machine", "Fibo Group Colombia", "Profesor Hass", "Circulatam", "Centro de Negocios Ganaderos", "Ecobit Company", "Innova Química", "Ecológica Recicla Uraba Zomac", "Qubilo", "Negocios Verdes Ambientes Sostenibles", "Forestales de Colombia", "Eco Hotel Nigüito"];

const FR = [
  ["Eficiencia Energética", "Eficiencia en equipos o procesos; recuperación de calor; refrigeración y calefacción; sustitución de combustibles; cogeneración; distritos térmicos"],
  ["Construcción Sostenible", "Vivienda o proyectos institucionales con certificación LEED, EDGE o CASA; renovación sostenible de edificios"],
  ["Uso sostenible del suelo", "Actividades agropecuarias certificadas; madera sostenible; servicios forestales certificados; ganadería sostenible; sistemas silvopastoriles"],
  ["Gestión Integral del Agua", "Reutilización de aguas grises o tratadas; uso eficiente; tratamiento de aguas residuales; potabilización"],
  ["Gestión Sostenible de la Biodiversidad", "Conservación y restauración de ecosistemas; vida silvestre; Soluciones Basadas en la Naturaleza"],
  ["Energía Renovable", "Solar, eólica, geotérmica, biomasa o biogás, oceánica, hidroeléctrica, hidrógeno"],
  ["Infraestructura Sostenible", "Iluminación eficiente; electrolineras y ciclorrutas; arborización; parqueaderos sostenibles; desarrollos urbanos certificados"],
  ["Economía Circular", "Reciclaje, reutilización y minimización de residuos; valorización; ecodiseño"],
  ["Transporte Sostenible", "Vehículos híbridos, eléctricos o GNV; micromovilidad"],
  ["Otras Inversiones Sostenibles", "Turismo sostenible certificado; ESCO; empresas B Corp; créditos de carbono; control de la contaminación"]
];

const SEG = [[200000, "Corporativo"], [70000, "Empresarial 3"], [35000, "Empresarial 2"], [20000, "Empresarial 1"], [13000, "Pyme 4"], [6000, "Pyme 3"], [3000, "Pyme 2"], [1000, "Pyme 1"], [300, "Semillero"]];
const TRANS = "Marco de Transición IFC: proyectos no verdes que reducen de forma sustancial y verificable emisiones o intensidad energética en energía, cemento, acero, químicos y transporte.";
const EVID = "Línea base y escenario posterior; consumos de energía, agua o combustible; emisiones; fichas técnicas, certificaciones, permisos, cotizaciones y memorias de cálculo, según aplique.";
const PASOS = [["Segmentar", "¿Las ventas anuales ubican al cliente en Corporativo, Empresarial o Pyme?"], ["Identificar destino", "¿El crédito financia un activo, proyecto o actividad concreta y trazable?"], ["Clasificar", "¿Cumple una categoría de la Taxonomía o es transición en energía, cemento, acero, químicos o transporte?"], ["Solicitar evidencia", EVID], ["Escalar", "Remitir a Finanzas Sostenibles para validación técnica; si es transición, activar FIRAS/SARAS, madurez, exclusiones y FOR-056."]];
const NOTA = "La clasificación no reemplaza el análisis de crédito, SARAS/FIRAS ni la validación técnica de Finanzas Sostenibles.";
const PORT_TXT = "Frentes elegibles: " + FR.map(f => f[0] + " (" + f[1] + ")").join("; ") + ". Segmentos por ventas anuales (COP millones): " + SEG.map(s => s[1] + " >= " + s[0]).join(", ") + ". " + TRANS + " Pasos de originación: " + PASOS.map(p => p[0] + ": " + p[1]).join(" ") + " " + NOTA;