/* ══ LOGIQUE DU TEST ══ */
const TOTAL = QUESTIONS.length; // 30
let qIdx = 0;
let repDetail = [];
let dragSrc = null;
let zoneOrdre = [];
let _lastEmailParams = null;

/* ── INSCRIPTION ── */
function validerInscription() {
  let ok = true;
  const champs = [
    { id: "reg-prenom", err: "err-reg-prenom" },
    { id: "reg-nom",    err: "err-reg-nom"    },
    { id: "reg-email",  err: "err-reg-email"  },
    { id: "reg-adresse",err: "err-reg-adresse"},
    { id: "reg-npa",    err: "err-reg-npa"    },
    { id: "reg-ville",  err: "err-reg-ville"  },
  ];
  champs.forEach(({ id, err }) => {
    const el = document.getElementById(id);
    const errEl = document.getElementById(err);
    const vide = !el.value.trim();
    const emailInvalide = id === "reg-email" && !vide && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
    if (vide || emailInvalide) { errEl.style.display = "block"; ok = false; }
    else errEl.style.display = "none";
  });
  const rgpd = document.getElementById("reg-rgpd");
  const rgpdErr = document.getElementById("err-reg-rgpd");
  if (rgpd && !rgpd.checked) { rgpdErr.style.display = "block"; ok = false; }
  else if (rgpdErr) rgpdErr.style.display = "none";
  if (!ok) return;
  demarrer();
}

/* ── DÉMARRER ── */
let tempsDebut = null;
function demarrer() {
  tempsDebut = Date.now();
  affEcran("e-test");
  affQuestion();
}

/* ── AFFICHER UNE QUESTION ── */
function fmtQ(t) {
  return (t || "").replace(/_{2,}/g, '<span class="q-blank"></span>');
}

function affQuestion() {
  const q = QUESTIONS[qIdx];
  const num = qIdx + 1;
  const pct = Math.round((qIdx / TOTAL) * 100);

  document.getElementById("prog-bar").style.width = pct + "%";
  document.getElementById("hdr-info").innerHTML =
    `Question <strong>${num}</strong> / ${TOTAL}&nbsp;&nbsp;<span style="color:rgba(255,255,255,.4)">${pct}%</span>`;

  const zone = document.getElementById("zone-q");
  zone.innerHTML = "";
  zoneOrdre = [];

  let html = `<h3>Question ${num} sur ${TOTAL}</h3>`;
  html += `<div class="instr">${q.instr}</div>`;

  if (q.audio) {
    const url = AU[q.audio] || "#";
    html += `<div class="audio-bloc">
      <span class="audio-ico">🎧</span>
      <div style="flex:1">
        <audio controls src="${url}" style="width:100%"></audio>
        <div class="audio-note">Vous pouvez écouter plusieurs fois avant de répondre.</div>
      </div>
    </div>`;
  }

  if (q.texte) {
    html += `<div class="texte-lu">${q.texte.replace(/\n/g,"<br>")}</div>`;
  }

  switch(q.type) {
    case "qcm_u":
      html += `<span class="q-label">${fmtQ(q.q)}</span><div class="opts-radio">`;
      q.opts.forEach((o, i) => {
        const cls = (o === "Je ne sais pas") ? "opt-radio opt-jnsp" : "opt-radio";
        if (o === "Je ne sais pas") html += '<div class="opts-sep"></div>';
        html += `<label class="${cls}" id="opt${i}" style="--opt-i:${i}">
          <input type="radio" name="qcm" value="${o}" onchange="selRadio(${i})"> ${o}
        </label>`;
      });
      html += `</div>`;
      break;

    case "qcm_m":
      html += `<span class="q-label">${fmtQ(q.q)}</span>
        <p class="note-saisie">Plusieurs réponses possibles.</p>
        <div class="opts-check">`;
      q.opts.forEach((o, i) => {
        if (o === "Je ne sais pas") html += '<div class="opts-sep"></div>';
        html += `<label class="opt-check" id="opt${i}" style="--opt-i:${i}">
          <input type="checkbox" value="${o}" onchange="selCheck(${i},this)"> ${o}
        </label>`;
      });
      html += `</div>`;
      break;

    case "vf":
      html += `<span class="q-label">${fmtQ(q.q)}</span>
        <div class="vf-grp">
          <button class="vf-btn" id="vf_Vrai" onclick="selVF('Vrai')" style="--opt-i:0">Vrai</button>
          <button class="vf-btn" id="vf_Faux" onclick="selVF('Faux')" style="--opt-i:1">Faux</button>
        </div>`;
      break;

    case "trous": {
      html += `<p class="para-trous" id="para-trous">`;
      let trouIdx = 0;
      q.segments.forEach(seg => {
        if (seg.t !== undefined) {
          html += seg.t.replace(/\n/g,"<br>");
        } else {
          html += `<span class="isel" style="--opt-i:${trouIdx}"><select id="${seg.id}" onchange="marquerTrou(this)">
            <option value="">···</option>
            ${seg.opts.map(o => `<option value="${o}">${o}</option>`).join("")}
          </select></span>`;
          trouIdx++;
        }
      });
      html += `</p>`;
      break;
    }

    case "demele":
      const melange = [...q.mots].sort(() => Math.random() - .5);
      html += `
        <p class="demele-label">↓ Faites glisser les mots ici pour construire la phrase :</p>
        <div class="demele-zone" id="dm-zone"
          ondragover="event.preventDefault();this.classList.add('drag-over')"
          ondragleave="this.classList.remove('drag-over')"
          ondrop="dropInZone(event)">
        </div>
        <p class="demele-label" style="margin-top:8px">Mots disponibles :</p>
        <div class="demele-mots-dispo" id="dm-dispo"
          ondragover="event.preventDefault()"
          ondrop="dropInDispo(event)">
        ${melange.map((m, idx) =>
          `<span class="mot-chip" draggable="true" style="--opt-i:${idx}"
            ondragstart="dragStart(event,'${m}')"
            ondragend="dragEnd(event)">${m}</span>`
        ).join("")}
        </div>`;
      break;

    case "libre":
      html += `<p style="font-size:.96rem;margin-bottom:10px">${fmtQ(q.q)}</p>
        <input class="inp-libre" type="text" id="libre-inp" placeholder="Votre réponse…">
        <p class="note-saisie">Respectez les accents et la casse.</p>`;
      break;
  }

  zone.innerHTML = html;

  zone.classList.remove("q-in");
  void zone.offsetWidth;
  zone.classList.add("q-in");
}

/* ── DRAG & DROP ── */
function dragStart(e, mot) {
  dragSrc = e.target;
  e.dataTransfer.setData("text", mot);
  e.target.style.opacity = ".4";
}
function dragEnd(e) { e.target.style.opacity = "1"; }

function dropInZone(e) {
  e.preventDefault();
  const zone = document.getElementById("dm-zone");
  zone.classList.remove("drag-over");
  if (!dragSrc) return;
  const mot = e.dataTransfer.getData("text");
  if (dragSrc.parentElement.id === "dm-dispo") {
    dragSrc.classList.add("dans-zone");
    dragSrc.setAttribute("ondragstart", `dragStart(event,'${mot}')`);
    dragSrc.setAttribute("ondrop", "");
    zone.appendChild(dragSrc);
    zoneOrdre = getMotsZone();
  }
}

function dropInDispo(e) {
  e.preventDefault();
  if (!dragSrc) return;
  const dispo = document.getElementById("dm-dispo");
  if (dragSrc.parentElement.id === "dm-zone") {
    dragSrc.classList.remove("dans-zone");
    dispo.appendChild(dragSrc);
    zoneOrdre = getMotsZone();
  }
}

function getMotsZone() {
  const zone = document.getElementById("dm-zone");
  if (!zone) return [];
  return Array.from(zone.querySelectorAll(".mot-chip")).map(c => c.textContent.trim());
}

/* ── SÉLECTIONS ── */
function selRadio(i) {
  document.querySelectorAll(".opt-radio").forEach(l => l.classList.remove("sel"));
  document.getElementById("opt" + i).classList.add("sel");
}
function selCheck(i, el) {
  document.getElementById("opt" + i).classList.toggle("sel", el.checked);
}
function selVF(val) {
  document.querySelectorAll(".vf-btn").forEach(b => b.classList.remove("sel"));
  document.getElementById("vf_" + val).classList.add("sel");
}
function marquerTrou(sel) {
  sel.closest(".isel").classList.toggle("isel--rempli", sel.value !== "");
}

/* ── LIRE LA RÉPONSE ── */
function lireRep(q) {
  switch(q.type) {
    case "qcm_u": {
      const s = document.querySelector('input[name="qcm"]:checked');
      return s ? s.value : "";
    }
    case "qcm_m":
      return Array.from(document.querySelectorAll('.opts-check input:checked')).map(c => c.value);
    case "vf": {
      const s = document.querySelector(".vf-btn.sel");
      return s ? s.textContent.trim() : "";
    }
    case "trous": {
      const vals = {};
      q.segments.filter(s => s.id).forEach(s => {
        const el = document.getElementById(s.id);
        vals[s.id] = el ? el.value : "";
      });
      return vals;
    }
    case "demele":
      return getMotsZone().join(" ");
    case "libre": {
      const el = document.getElementById("libre-inp");
      return el ? el.value.trim() : "";
    }
  }
  return "";
}

/* ── ÉVALUER ── */
function evaluer(q, rep) {
  switch(q.type) {
    case "qcm_u": return rep === q.ok;
    case "qcm_m": {
      if (!Array.isArray(rep)) return false;
      const ok = new Set(q.ok);
      return rep.length === ok.size && rep.every(r => ok.has(r));
    }
    case "vf": return rep === q.ok;
    case "trous":
      return q.segments.filter(s => s.id).every(s => rep[s.id] === s.ok);
    case "demele":
      return rep.trim().toLowerCase() === q.correct.trim().toLowerCase();
    case "libre":
      return rep.trim().toLowerCase() === (q.okLibre || "").toLowerCase();
  }
  return false;
}

/* ── SUIVANT ── */
function suivant() {
  const q = QUESTIONS[qIdx];
  const rep = lireRep(q);
  const ok  = evaluer(q, rep);

  const repTxt = typeof rep === "object" ? JSON.stringify(rep) : rep;
  repDetail.push({
    question_id:         q.id,
    niveau:              q.niveau,
    type:                q.type,
    reponse_utilisateur: repTxt,
    reponse_correcte:    typeof q.ok === "object" ? JSON.stringify(q.ok) : (q.ok || q.correct || ""),
    je_ne_sais_pas:      repTxt === "Je ne sais pas",
    correct: ok
  });

  const btn  = document.getElementById("btn-suiv");
  const card = document.getElementById("zone-q");
  if (btn) btn.disabled = true;
  card.classList.remove("q-in");
  card.classList.add("q-out");
  setTimeout(() => {
    card.classList.remove("q-out");
    qIdx++;
    if (qIdx < TOTAL) {
      if (btn) btn.disabled = false;
      affQuestion();
      window.scrollTo(0, 0);
    } else {
      affResultat();
    }
  }, 230);
}

/* ── ÉCHELLE DE NOTATION ──
   0-6   bonnes → Pré-A1
   7-12  bonnes → A1
   13-18 bonnes → A2
   19-22 bonnes → B1
   23-27 bonnes → B2
   28-30 bonnes → C1
*/
function niveauDepuisScore(bonnes) {
  if (bonnes <= 6)  return "Pre-A1";
  if (bonnes <= 12) return "A1";
  if (bonnes <= 18) return "A2";
  if (bonnes <= 22) return "B1";
  if (bonnes <= 27) return "B2";
  return "C1";
}

/* ── RADAR SVG ── */
function buildRadar(scores) {
  const cx = 160, cy = 155, R = 108, n = COMP.length;
  const step = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  function pt(r, i) {
    const a = startAngle + i * step;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }
  function poly(r) {
    return Array.from({length:n}, (_,i) => pt(r,i).map(v=>v.toFixed(1)).join(",")).join(" ");
  }

  const grids = [0.25, 0.5, 0.75, 1].map(f =>
    `<polygon points="${poly(R*f)}" fill="none" stroke="#ddd6fe" stroke-width="${f===1?1.5:.8}"/>`
  ).join("");

  const axes = Array.from({length:n}, (_,i) => {
    const [x,y] = pt(R,i);
    return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#e0d8f8" stroke-width="1"/>`;
  }).join("");

  const userPts = COMP.map((c,i) => {
    const s = scores[c.key] ?? 0;
    return pt(R * s, i);
  });
  const userPoly = userPts.map(p => p.map(v=>v.toFixed(1)).join(",")).join(" ");
  const userLine = `<polygon points="${userPoly}" fill="rgba(124,58,237,.18)" stroke="#7C3AED" stroke-width="2" stroke-linejoin="round"/>`;
  const dots = userPts.map(([x,y]) =>
    `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#7C3AED" stroke="#fff" stroke-width="1.5"/>`
  ).join("");

  const labels = COMP.map((c,i) => {
    const LR = R + 32;
    const [lx,ly] = pt(LR,i);
    const a = startAngle + i * step;
    const anchor = Math.abs(Math.cos(a)) < 0.1 ? "middle" : (Math.cos(a) > 0 ? "start" : "end");
    const dy = Math.sin(a) < -0.5 ? "-.2em" : (Math.sin(a) > 0.5 ? "1em" : ".35em");
    return `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}" dy="${dy}" `
      + `font-size="12" font-weight="800" fill="#4a4a6a" font-family="Nunito,sans-serif">${c.label}</text>`;
  }).join("");

  const pctLabels = [25,50,75,100].map(p =>
    `<text x="${(cx+2).toFixed(1)}" y="${(cy - R*p/100 - 3).toFixed(1)}" font-size="8" fill="#b0a8cc" text-anchor="middle" font-family="Nunito,sans-serif">${p}%</text>`
  ).join("");

  return `<svg viewBox="-60 -10 440 340" xmlns="http://www.w3.org/2000/svg" aria-label="Graphique radar des compétences">
    ${grids}${axes}${userLine}${dots}${labels}${pctLabels}
  </svg>`;
}

/* ── ANALYSE COMPLÈTE ── */
function affAnalyse() {
  const compScores = {};
  COMP.forEach(c => {
    const qs = repDetail.filter(r => c.ids.includes(r.question_id));
    compScores[c.key] = qs.length ? qs.filter(r => r.correct).length / qs.length : 0;
  });

  document.getElementById("radar-svg").innerHTML = buildRadar(compScores);

  const nivHtml = Object.entries(PAR_NIVEAU).map(([niv, ids]) => {
    const qs = repDetail.filter(r => ids.includes(r.question_id));
    const pct = qs.length ? Math.round(qs.filter(r => r.correct).length / qs.length * 100) : 0;
    const color = NIV_COLORS[niv] || "#9090b0";
    return `<div class="res-niv-row">
      <div class="res-niv-label">${niv} <span>${pct}%</span></div>
      <div class="res-niv-track">
        <div class="res-niv-fill" style="width:${pct}%;background:${color}"></div>
      </div>
    </div>`;
  }).join("");
  document.getElementById("res-niveaux").innerHTML = nivHtml;

  const sorted = COMP.map(c => ({...c, pct: Math.round(compScores[c.key] * 100)}))
    .sort((a,b) => b.pct - a.pct);
  const forts   = sorted.filter(c => c.pct >= 70);
  const faibles = sorted.filter(c => c.pct < 50);

  function pfCard(title, icon, items, cls, emptyMsg) {
    const itemsHtml = items.length
      ? items.map(c => `<div class="res-pf-item">${c.icon} ${c.label}<span class="res-pf-item-pct">${c.pct}%</span></div>`).join("")
      : `<p class="res-pf-empty">${emptyMsg}</p>`;
    return `<div class="res-pf-card ${cls}">
      <div class="res-pf-card-title">${icon} ${title}</div>
      ${itemsHtml}
    </div>`;
  }

  document.getElementById("res-forts").innerHTML = pfCard(
    "Points forts", "✅", forts, "res-pf-card--fort",
    "Continuez à pratiquer toutes les compétences !"
  );
  document.getElementById("res-faibles").innerHTML = pfCard(
    "À renforcer", "📌", faibles, "res-pf-card--faible",
    "Excellent — aucune compétence faible !"
  );
}

/* ── RÉSULTAT ── */
function affResultat() {
  const bonnes = repDetail.filter(r => r.correct).length;
  const pct = Math.round(bonnes / TOTAL * 100);
  const niv = niveauDepuisScore(bonnes);

  const dureeSec = tempsDebut ? Math.round((Date.now() - tempsDebut) / 1000) : 0;
  const min = Math.floor(dureeSec / 60);
  const sec = dureeSec % 60;
  const dureeTxt = `${min} min ${sec.toString().padStart(2,"0")} s`;

  document.getElementById("prog-bar").style.width = "100%";
  document.getElementById("hdr-info").innerHTML = "Test terminé";
  document.getElementById("res-badge").textContent = niv === "Pre-A1" ? "—" : niv;
  document.getElementById("res-niv").textContent   = niv === "Pre-A1" ? "Pré-A1" : niv;
  document.getElementById("res-score").textContent = `${bonnes} bonne${bonnes > 1?"s":""} réponse${bonnes > 1?"s":""} sur ${TOTAL} (${pct}%) — durée : ${dureeTxt}`;
  document.getElementById("res-desc").textContent  = DESC[niv] || "";

  affEcran("e-res");
  affAnalyse();
  window.scrollTo(0, 0);

  const reg = _getRegData();
  const msg = document.getElementById("save-msg");

  const compScores = {};
  COMP.forEach(c => {
    const qs = repDetail.filter(r => c.ids.includes(r.question_id));
    compScores[c.key] = qs.length ? Math.round(qs.filter(r => r.correct).length / qs.length * 100) : 0;
  });

  const nivScores = {};
  Object.entries(PAR_NIVEAU).forEach(([n, ids]) => {
    const qs = repDetail.filter(r => ids.includes(r.question_id));
    nivScores[n] = qs.length ? Math.round(qs.filter(r => r.correct).length / qs.length * 100) : 0;
  });

  const sorted = COMP.map(c => ({ label: c.label, icon: c.icon, p: compScores[c.key] })).sort((a,b) => b.p - a.p);
  const fortsStr   = sorted.filter(c => c.p >= 70).map(c => `${c.icon} ${c.label} (${c.p}%)`).join(", ") || "—";
  const faiblesStr = sorted.filter(c => c.p < 50).map(c => `${c.icon} ${c.label} (${c.p}%)`).join(", ") || "Aucune faiblesse";

  const now = new Date();
  const dateTest  = now.toLocaleDateString("fr-CH", { day:"2-digit", month:"2-digit", year:"numeric" });
  const heureTest = now.toLocaleTimeString("fr-CH", { hour:"2-digit", minute:"2-digit" });

  const emailParams = {
    prenom:    reg.prenom  || "—",
    nom:       reg.nom     || "—",
    email:     reg.email   || "—",
    adresse:   reg.adresse || "—",
    npa:       reg.npa     || "—",
    ville:     reg.ville   || "—",
    telephone: reg.tel     || "—",
    niveau:    niv === "Pre-A1" ? "Pré-A1" : niv,
    score:     pct,
    bonnes:    bonnes,
    total:     TOTAL,
    duree:     `${min}m ${sec.toString().padStart(2,"0")}s`,
    desc_niveau:      DESC[niv] || "",
    date_test:        dateTest,
    heure_test:       heureTest,
    comp_grammaire:   compScores.grammaire   + "%",
    comp_conjugaison: compScores.conjugaison + "%",
    comp_oral:        compScores.oral        + "%",
    comp_ecrit:       compScores.ecrit       + "%",
    comp_vocabulaire: compScores.vocabulaire + "%",
    niv_prea1: (nivScores["Pré-A1"] ?? 0) + "%",
    niv_a1:    (nivScores["A1"]     ?? 0) + "%",
    niv_a2:    (nivScores["A2"]     ?? 0) + "%",
    niv_b1:    (nivScores["B1"]     ?? 0) + "%",
    niv_b2:    (nivScores["B2"]     ?? 0) + "%",
    niv_c1:    (nivScores["C1"]     ?? 0) + "%",
    points_forts:   fortsStr,
    points_faibles: faiblesStr,
  };

  _lastEmailParams = emailParams;
  _sauverFirebase(niv, pct, reg.prenom, reg.nom, reg.email, dureeSec, reg);
  const wrap = document.getElementById("btn-results-wrap");
  if (wrap) wrap.style.display = "flex";
}

/* ── DONNÉES D'INSCRIPTION ── */
function _getRegData() {
  return {
    prenom:   (document.getElementById("reg-prenom")?.value   || "").trim(),
    nom:      (document.getElementById("reg-nom")?.value      || "").trim(),
    email:    (document.getElementById("reg-email")?.value    || "").trim(),
    adresse:  (document.getElementById("reg-adresse")?.value  || "").trim(),
    npa:      (document.getElementById("reg-npa")?.value      || "").trim(),
    ville:    (document.getElementById("reg-ville")?.value    || "").trim(),
    tel:      ((document.getElementById("reg-indicatif")?.value || "") + " " + (document.getElementById("reg-tel")?.value || "")).trim(),
  };
}

/* ── EMAIL ── */
function _envoyerEmail(params, msgEl) {
  console.log("📧 EmailJS → service:", window._emailjs?.serviceId, "template:", window._emailjs?.templateId);
  console.log("📧 Params:", JSON.stringify(params, null, 2));
  if (msgEl) { msgEl.textContent = "Envoi de l'e-mail…"; msgEl.style.color = ""; }

  const ej = window._emailjs;
  if (!ej || typeof emailjs === "undefined") {
    if (msgEl) { msgEl.textContent = "⚠ EmailJS non chargé."; msgEl.style.color = "var(--warning)"; }
    return Promise.reject("EmailJS non chargé");
  }

  return emailjs.send(ej.serviceId, ej.templateId, { ...params, to_email: "ecole.francophone@icloud.com" })
    .then(() => {
      if (msgEl) { msgEl.textContent = "✓ Résultats envoyés !"; msgEl.style.color = "var(--success)"; }
    })
    .catch(err => {
      const detail = err?.text || err?.message || JSON.stringify(err);
      console.error("❌ EmailJS erreur:", err);
      if (msgEl) {
        msgEl.textContent = "✗ Erreur : " + detail;
        msgEl.style.color = "var(--danger)";
      }
      throw err;
    });
}

function envoyerEmailConfirm() {
  if (!_lastEmailParams) return;
  const btn = document.getElementById("btn-confirm-email");
  const msg = document.getElementById("save-msg");
  if (btn) { btn.disabled = true; btn.textContent = "Envoi en cours…"; }
  _envoyerEmail(_lastEmailParams, msg)
    .then(() => {
      if (btn) { btn.textContent = "✓ Envoyé !"; }
    })
    .catch(() => {
      if (btn) { btn.disabled = false; btn.textContent = "Réessayer →"; }
    });
}

function telechargerImage() {
  if (!_lastEmailParams) return;
  const p = _lastEmailParams;

  const outer = document.createElement("div");
  outer.style.cssText = "position:fixed;left:-9999px;top:0;z-index:0;pointer-events:none;";
  outer.innerHTML = _buildImageCard(p);
  document.body.appendChild(outer);
  const card = outer.firstElementChild;

  const btn = [...document.querySelectorAll("button")].find(b => b.textContent.includes("Télécharger"));
  if (btn) { btn.disabled = true; btn.textContent = "Génération…"; }

  setTimeout(() => {
    html2canvas(card, { scale: 3, useCORS: true, allowTaint: false, backgroundColor: "#f5f3ff", logging: false })
      .then(canvas => {
        const nom = (p.prenom + "_" + p.nom).replace(/\s+/g, "_");
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = `résultats_${nom}_${p.niveau}.png`;
        a.click();
      })
      .catch(() => alert("Erreur lors de la génération de l'image."))
      .finally(() => {
        document.body.removeChild(outer);
        if (btn) { btn.disabled = false; btn.textContent = "⬇ Télécharger l'image"; }
      });
  }, 400);
}

function _buildImageCard(p) {
  const F = "font-family:'Nunito','Helvetica Neue',Arial,sans-serif;";
  const GRAD = "linear-gradient(135deg,#1e3a8a 0%,#1D4ED8 45%,#7C3AED 100%)";

  const cp = parseInt(p.comp_grammaire)   || 0;
  const cc = parseInt(p.comp_conjugaison) || 0;
  const co = parseInt(p.comp_oral)        || 0;
  const ce = parseInt(p.comp_ecrit)       || 0;
  const cv = parseInt(p.comp_vocabulaire) || 0;
  const na = parseInt(p.niv_prea1) || 0;
  const n1 = parseInt(p.niv_a1)   || 0;
  const n2 = parseInt(p.niv_a2)   || 0;
  const nb = parseInt(p.niv_b1)   || 0;
  const nc = parseInt(p.niv_b2)   || 0;
  const nd = parseInt(p.niv_c1)   || 0;

  function compBar(label, icon, val, color) {
    return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:9px;">
      <div style="${F}width:140px;font-size:12px;font-weight:700;color:#4a4a6a;">${icon} ${label}</div>
      <div style="flex:1;min-width:0;height:9px;background:#ede9fe;border-radius:99px;overflow:hidden;">
        <div style="height:100%;width:${val}%;background:${color};border-radius:99px;"></div>
      </div>
      <div style="${F}width:34px;text-align:right;font-size:12px;font-weight:800;color:${color};">${val}%</div>
    </div>`;
  }

  function nivBar(label, val, color) {
    return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <div style="${F}width:44px;font-size:11px;font-weight:700;color:#4a4a6a;">${label}</div>
      <div style="flex:1;min-width:0;height:8px;background:#ede9fe;border-radius:99px;overflow:hidden;">
        <div style="height:100%;width:${val}%;background:${color};border-radius:99px;"></div>
      </div>
      <div style="${F}width:34px;text-align:right;font-size:11px;font-weight:800;color:${color};">${val}%</div>
    </div>`;
  }

  const scoreBar = Math.min(parseInt(p.score) || 0, 100);

  return `<div style="${F}width:800px;background:#f5f3ff;overflow:hidden;">

    <div style="background:${GRAD};padding:34px 48px;text-align:center;">
      <div style="${F}font-size:24px;font-weight:900;color:#fff;letter-spacing:-.5px;">école-francophone.ch</div>
      <div style="${F}font-size:11px;color:rgba(255,255,255,.75);margin-top:6px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Attestation de niveau de français</div>
    </div>

    <div style="background:#fff;padding:22px 48px;text-align:center;border-bottom:2px solid #ede9fe;">
      <div style="${F}font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:#9090b0;margin-bottom:5px;">Résultats de</div>
      <div style="${F}font-size:27px;font-weight:900;color:#1a1a2e;">${p.prenom} ${p.nom}</div>
      <div style="${F}font-size:12px;color:#7c6faa;margin-top:4px;font-weight:600;">Test effectué le ${p.date_test} à ${p.heure_test}</div>
    </div>

    <div style="background:#fff;border-bottom:2px solid #ede9fe;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr valign="middle">
        <td width="176" style="text-align:center;padding:26px 20px;">
          <div style="width:120px;height:120px;border-radius:50%;background:${GRAD};padding:4px;margin:0 auto;">
            <div style="width:112px;height:112px;border-radius:50%;background:#fff;padding-top:29px;text-align:center;box-sizing:border-box;">
              <div style="${F}font-size:33px;font-weight:900;color:#7C3AED;line-height:1;">${p.niveau}</div>
              <div style="${F}font-size:10px;color:#9090b0;font-weight:700;margin-top:3px;">CECRL</div>
            </div>
          </div>
          <div style="${F}font-size:10px;font-weight:700;color:#9090b0;margin-top:8px;text-transform:uppercase;letter-spacing:.06em;">Niveau estimé</div>
        </td>
        <td style="padding:26px 32px 26px 8px;">
          <div style="${F}font-size:40px;font-weight:900;color:#7C3AED;line-height:1;margin-bottom:4px;">${scoreBar}%</div>
          <div style="${F}font-size:13px;font-weight:700;color:#4a4a6a;margin-bottom:10px;">${p.bonnes} / ${p.total} bonnes réponses &nbsp;·&nbsp; ${p.duree}</div>
          <div style="height:8px;background:#ede9fe;border-radius:99px;overflow:hidden;margin-bottom:12px;">
            <div style="height:100%;width:${scoreBar}%;background:${GRAD};border-radius:99px;"></div>
          </div>
          <div style="border-left:3px solid #7C3AED;background:#f5f3ff;border-radius:0 8px 8px 0;padding:9px 14px;">
            <div style="${F}font-size:12px;color:#4a4a6a;font-style:italic;line-height:1.5;">${p.desc_niveau}</div>
          </div>
        </td>
      </tr></table>
    </div>

    <div style="background:#fff;border-bottom:2px solid #ede9fe;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr valign="top">
        <td style="padding:22px 20px 22px 48px;border-right:2px solid #ede9fe;">
          <div style="${F}font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:#1D4ED8;margin-bottom:14px;">📊 Profil de compétences</div>
          ${compBar("Grammaire",   "📐", cp, "#1D4ED8")}
          ${compBar("Conjugaison", "🔄", cc, "#7C3AED")}
          ${compBar("Oral",        "🎧", co, "#0ea5e9")}
          ${compBar("Écrit",       "📖", ce, "#10b981")}
          ${compBar("Vocabulaire", "📚", cv, "#f59e0b")}
        </td>
        <td style="padding:22px 48px 22px 20px;">
          <div style="${F}font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:#1D4ED8;margin-bottom:14px;">📈 Résultats par niveau CECRL</div>
          ${nivBar("Pré-A1", na, "#9090b0")}
          ${nivBar("A1",     n1, "#7C3AED")}
          ${nivBar("A2",     n2, "#0ea5e9")}
          ${nivBar("B1",     nb, "#f0a030")}
          ${nivBar("B2",     nc, "#A855F7")}
          ${nivBar("C1",     nd, "#f43f5e")}
        </td>
      </tr></table>
    </div>

    <div style="background:#fff;padding:20px 48px;border-bottom:2px solid #ede9fe;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr valign="top">
        <td style="padding-right:10px;">
          <div style="background:#f0fdf4;border:1.5px solid #a7f3d0;border-radius:10px;padding:14px 16px;">
            <div style="${F}font-size:10px;font-weight:900;color:#059669;text-transform:uppercase;letter-spacing:.06em;margin-bottom:7px;">✅ Points forts</div>
            <div style="${F}font-size:12px;color:#064e3b;font-weight:700;line-height:1.6;">${p.points_forts || "—"}</div>
          </div>
        </td>
        <td style="padding-left:10px;">
          <div style="background:#fff7ed;border:1.5px solid #fcd34d;border-radius:10px;padding:14px 16px;">
            <div style="${F}font-size:10px;font-weight:900;color:#d97706;text-transform:uppercase;letter-spacing:.06em;margin-bottom:7px;">📌 À renforcer</div>
            <div style="${F}font-size:12px;color:#78350f;font-weight:700;line-height:1.6;">${p.points_faibles || "Aucune faiblesse détectée"}</div>
          </div>
        </td>
      </tr></table>
    </div>

    <div style="background:${GRAD};padding:16px 48px;text-align:center;">
      <div style="${F}font-size:11px;color:rgba(255,255,255,.8);font-weight:600;letter-spacing:.02em;">école-francophone.ch · learning progress · ${p.date_test}</div>
    </div>

  </div>`;
}

function envoyerEmailTest() {
  if (!_lastEmailParams) { alert("Aucun résultat disponible."); return; }
  const btn = document.getElementById("btn-test-email");
  if (btn) { btn.disabled = true; btn.textContent = "Envoi…"; }
  const ej = window._emailjs;
  if (!ej || typeof emailjs === "undefined") { alert("EmailJS non configuré."); return; }
  emailjs.send(ej.serviceId, ej.templateId, { ..._lastEmailParams, to_email: "alexis.hoppeler@gmail.com" })
    .then(() => { if (btn) { btn.textContent = "✓ Envoyé"; } })
    .catch(err => { if (btn) { btn.textContent = "Erreur"; btn.disabled = false; } console.error(err); });
}

/* ── FIREBASE ── */
async function _sauverFirebase(niv, pct, prenom, nom, email, dureeSec, reg = {}) {
  try {
    const db = window._db;
    if (!db) return;
    await window._addDoc(window._collection(db, "resultats_test"), {
      prenom, nom, email,
      adresse:         reg.adresse  || "",
      npa:             reg.npa      || "",
      ville:           reg.ville    || "",
      telephone:       reg.tel      || "",
      date:            window._serverTimestamp(),
      niveau_final:    niv,
      score_pct:       pct,
      duree_secondes:  dureeSec || 0,
      reponses_detail: repDetail
    });
  } catch(e) { console.warn("Firebase:", e.message); }
}

/* ── UTILITAIRE ── */
function affEcran(id) {
  document.querySelectorAll(".ecran").forEach(e => e.classList.remove("actif"));
  document.getElementById(id).classList.add("actif");
}
