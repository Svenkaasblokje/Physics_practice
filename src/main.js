import { createClient } from '@supabase/supabase-js';
import './style.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
const app = document.querySelector('#app');
const deviceKey = 'physics-practice-device';
const deviceId = localStorage.getItem(deviceKey) || crypto.randomUUID();
localStorage.setItem(deviceKey, deviceId);
const roundSize = 10;
const moduleKeys = ['formulas', 'tangent', 'squares', 'sig1', 'sig2', 'sig3', 'sig4', 'units'];
const labels = {
  nl: {
    title: 'Natuurkunde oefenen',
    subtitle: 'VWO 4 — basisvaardigheden',
    introTitle: 'Oefen natuurkunde in korte rondes',
    introText: 'Maak opdrachten over formules, grafieken, significantie en eenheden. Elke ronde heeft tien vragen en pakt telkens andere opdrachten uit een grotere oefenbank.',
    start: 'Begin',
    modules: 'Kies een onderdeel',
    modulesHint: 'Vijftig opdrachten per onderdeel, tien per ronde',
    score: 'Mijn resultaten',
    scoreHint: 'Je beste score per onderdeel',
    best: 'Beste',
    percentGood: '% goed',
    notStarted: 'Nog niet gemaakt',
    startBtn: 'Beginnen',
    newRound: 'Nog een ronde',
    back: 'Terug naar overzicht',
    menu: 'Overzicht',
    question: 'Vraag',
    of: 'van',
    next: 'Volgende',
    reset: 'Voortgang wissen',
    resetConfirm: 'Weet je zeker dat je alle scores en voortgang wilt wissen?',
    correct: 'Goed gedaan',
    incorrect: 'Niet helemaal goed',
    answer: 'Goede antwoord',
    check: 'Nakijken',
    finish: 'Ronde klaar',
    perfect: 'Alles goed',
    sync: 'Bezig met opslaan',
    synced: 'Voortgang opgeslagen',
    syncOffline: 'Lokaal opgeslagen',
    language: 'EN',
    exercises: 'opdrachten',
    round: 'ronde',
    languages: 'talen',
    statusStart: 'Nog niet gemaakt',
    scoreNote: 'Elke ronde kiest tien nieuwe opdrachten. Je ziet hier je hoogste percentage goed per onderdeel.',
    tipTitle: 'Zo pak je het aan',
    tipText: 'Kies een onderdeel hieronder en maak tien opdrachten. Na elke vraag zie je meteen of je antwoord klopt en hoe het zit. Zo leer je niet alleen wat je goed kunt, maar ook wat je nog moet oefenen.',
    slopeHint: 'Sleep de schuifregelaar tot de lijn dezelfde richting heeft als de grafiek bij punt P.',
    tangentTitle: 'Teken de raaklijn bij punt P',
    squaresTitle: 'Bereken de verplaatsing met de hokjesmethode',
    squaresSub: dt => `Eén horizontaal hokje is ${dt} s.`,
    displacement: 'Verplaatsing ≈',
    typeAnswer: 'Vul je antwoord in',
    makeSubject: name => `Maak ${name} vrij`,
    whichAnswer: expr => `Welk antwoord is juist bij ${expr}?`,
    sigSub: 'Let op het aantal significante cijfers.',
    whichUnit: name => `Wat is de SI-eenheid van ${name}?`,
    unitSub: 'Kies de juiste eenheid.',
    formulaExplain: 'Pas dezelfde bewerking toe aan beide kanten van de formule.',
    sigExplain: 'Rond af op de nauwkeurigheid van de minst nauwkeurige waarde.',
    tangentExplain: 'De helling bij P is de afgeleide van de grafiek op dat punt.',
    squaresExplain: 'De oppervlakte onder een snelheid-tijdgrafiek is de verplaatsing.'
  },
  en: {
    title: 'Physics practice',
    subtitle: 'VWO 4 — core skills',
    introTitle: 'Practice physics in short rounds',
    introText: 'Work through exercises on formulas, graphs, significant figures and units. Each round has ten questions drawn from a larger exercise bank.',
    start: 'Start',
    modules: 'Choose a topic',
    modulesHint: 'Fifty exercises per topic, ten per round',
    score: 'My results',
    scoreHint: 'Your best score per topic',
    best: 'Best',
    percentGood: '% correct',
    notStarted: 'Not started',
    startBtn: 'Start',
    newRound: 'Another round',
    back: 'Back to overview',
    menu: 'Overview',
    question: 'Question',
    of: 'of',
    next: 'Next',
    reset: 'Clear progress',
    resetConfirm: 'Are you sure you want to clear all scores and progress?',
    correct: 'Well done',
    incorrect: 'Not quite right',
    answer: 'Correct answer',
    check: 'Check',
    finish: 'Round done',
    perfect: 'All correct',
    sync: 'Saving',
    synced: 'Progress saved',
    syncOffline: 'Saved locally',
    language: 'NL',
    exercises: 'exercises',
    round: 'round',
    languages: 'languages',
    statusStart: 'Not started',
    scoreNote: 'Each round picks ten new exercises. You see your highest percentage correct per topic.',
    tipTitle: 'How to get started',
    tipText: 'Pick a topic below and complete ten exercises. After each question you see whether your answer is right and why. That way you learn both what you already know and what to practice more.',
    slopeHint: 'Drag the slider until the line matches the direction of the graph at point P.',
    tangentTitle: 'Draw the tangent at point P',
    squaresTitle: 'Calculate displacement with the grid method',
    squaresSub: dt => `One horizontal square is ${dt} s.`,
    displacement: 'Displacement ≈',
    typeAnswer: 'Enter your answer',
    makeSubject: name => `Make ${name} the subject`,
    whichAnswer: expr => `Which answer is correct for ${expr}?`,
    sigSub: 'Mind the number of significant figures.',
    whichUnit: name => `What is the SI unit of ${name}?`,
    unitSub: 'Choose the correct unit.',
    formulaExplain: 'Apply the same operation to both sides of the formula.',
    sigExplain: 'Round to the precision of the least precise value.',
    tangentExplain: 'The slope at P is the derivative of the graph at that point.',
    squaresExplain: 'The area under a velocity-time graph is the displacement.'
  }
};
let language = localStorage.getItem('physics-practice-language') || null;
let state = { records: {}, active: null, questions: [], index: 0, points: 0, answered: false };

const moduleInfo = {
  formulas: { nl: ['Formules ombouwen', 'Maak een grootheid vrij in de formule.'], en: ['Rearrange formulas', 'Isolate a variable in the formula.'] },
  tangent: { nl: ['Raaklijn tekenen', 'Vind de juiste helling bij punt P.'], en: ['Draw a tangent', 'Find the right slope at point P.'] },
  squares: { nl: ['Hokjesmethode', 'Schat de oppervlakte onder een grafiek.'], en: ['Grid method', 'Estimate the area under a graph.'] },
  sig1: { nl: ['Significante cijfers 1', 'Tel hoeveel cijfers significant zijn.'], en: ['Significant figures 1', 'Count how many figures are significant.'] },
  sig2: { nl: ['Significante cijfers 2', 'Vermenigvuldigen en delen.'], en: ['Significant figures 2', 'Multiply and divide.'] },
  sig3: { nl: ['Significante cijfers 3', 'Optellen en aftrekken.'], en: ['Significant figures 3', 'Add and subtract.'] },
  sig4: { nl: ['Significante cijfers 4', 'Combineer verschillende bewerkingen.'], en: ['Significant figures 4', 'Combine different operations.'] },
  units: { nl: ['SI-eenheden', 'Koppel grootheden aan hun eenheid.'], en: ['SI units', 'Match quantities to their unit.'] }
};

const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const t = key => labels[language][key] || key;
const shuffle = values => { const copy = [...values]; for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; } return copy; };
const sample = (values, amount) => shuffle(values).slice(0, amount);
const makeOptions = (correct, wrong) => shuffle([String(correct), ...wrong.map(String)]);

function formulaQuestions() {
  const templates = [
    ['s = v · t', 'v', 'v = s / t', ['v = s · t', 'v = t / s']],
    ['s = v · t', 't', 't = s / v', ['t = s · v', 't = v / s']],
    ['a = Δv / Δt', 'a', 'a = Δv / Δt', ['a = Δv · Δt', 'a = Δt / Δv']],
    ['a = Δv / Δt', 'Δv', 'Δv = a · Δt', ['Δv = a / Δt', 'Δv = Δt / a']],
    ['a = Δv / Δt', 'Δt', 'Δt = Δv / a', ['Δt = a / Δv', 'Δt = a · Δv']],
    ['v gem = Δx / Δt', 'Δx', 'Δx = v gem · Δt', ['Δx = v gem / Δt', 'Δx = Δt / v gem']],
    ['v gem = Δx / Δt', 'Δt', 'Δt = Δx / v gem', ['Δt = Δx · v gem', 'Δt = v gem / Δx']],
    ['Δv = veind − vbegin', 'veind', 'veind = Δv + vbegin', ['veind = Δv − vbegin', 'veind = vbegin − Δv']],
    ['Δv = veind − vbegin', 'vbegin', 'vbegin = veind − Δv', ['vbegin = veind + Δv', 'vbegin = Δv − veind']],
    ['v gem = (veind + vbegin) / 2', 'veind', 'veind = 2 · v gem − vbegin', ['veind = v gem / 2 − vbegin', 'veind = 2 · v gem + vbegin']]
  ];
  return Array.from({ length: 50 }, (_, index) => {
    const item = templates[index % templates.length];
    return { type: 'quiz', title: t('makeSubject')(item[1]), subtitle: item[0], correct: item[2], options: makeOptions(item[2], item[3]), explanation: t('formulaExplain') };
  });
}

function significanceQuestions(key) {
  const bases = key === 'sig1' ? [['0,0050', '2'], ['4,50 × 10³', '3'], ['0,02040', '4'], ['7,0 × 10⁻⁴', '2'], ['12,030', '5']]
    : key === 'sig2' ? [['3,20 × 2,1', '6,7'], ['12,0 / 4,00', '3,00'], ['4,5 × 2,00', '9,0'], ['0,0240 / 3,0', '8,0 × 10⁻³'], ['1,25 × 4,0', '5,0']]
    : key === 'sig3' ? [['12,35 + 4,2', '16,6'], ['8,76 − 1,2', '7,6'], ['2,340 + 0,12', '2,46'], ['10,0 − 0,35', '9,7'], ['4,567 + 1,20', '5,77']]
    : [['(2,4 + 1,25) × 3,0', '11'], ['(8,25 − 1,2) / 2,0', '3,5'], ['(1,20 × 10³ + 50) / 2,0', '6,3 × 10²'], ['(5,60 − 0,4) × 1,25', '6,5'], ['(3,0 × 10⁻³) × (2,50 × 10⁴)', '7,5 × 10¹']];
  return Array.from({ length: 50 }, (_, index) => {
    const [expression, correct] = bases[index % bases.length];
    const wrong = key === 'sig1' ? ['1', '3', '4'].filter(v => v !== correct) : [correct.replace(/[0-9]/g, '0'), `${correct}0`, correct.replace(/[0-9]/, n => String(Number(n) + 1))];
    return { type: 'quiz', title: t('whichAnswer')(expression), subtitle: t('sigSub'), correct, options: makeOptions(correct, wrong), explanation: t('sigExplain') };
  });
}

const unitBases = [['afstand', 'distance', 'm'], ['plaats', 'position', 'm'], ['verplaatsing', 'displacement', 'm'], ['tijd', 'time', 's'], ['tijdsduur', 'duration', 's'], ['snelheid', 'speed', 'm/s'], ['gemiddelde snelheid', 'average speed', 'm/s'], ['versnelling', 'acceleration', 'm/s²'], ['frequentie', 'frequency', 'Hz'], ['kracht', 'force', 'N']];
function unitQuestions() {
  const pool = ['m', 's', 'm/s', 'm/s²', 'Hz', 'N', 'kg', 'km/h'];
  return Array.from({ length: 50 }, (_, index) => {
    const [nl, en, correct] = unitBases[index % unitBases.length];
    const name = language === 'nl' ? nl : en;
    return { type: 'quiz', title: t('whichUnit')(name), subtitle: t('unitSub'), correct, options: makeOptions(correct, sample(pool.filter(unit => unit !== correct), 3)), explanation: `${name} → ${correct}` };
  });
}

function graphQuestions(type) {
  return Array.from({ length: 50 }, (_, index) => {
    const tPoint = 2 + index % 6;
    const base = type === 'tangent' ? 4 + index % 7 : 3 + index % 5;
    const slope = ((index % 7) - 3) * .7;
    return { type, time: tPoint, base, slope, curve: type === 'tangent' ? .08 + (index % 3) * .025 : .1, correct: type === 'tangent' ? slope + 2 * (.08 + (index % 3) * .025) * tPoint : null };
  });
}

function squareQuestions() {
  return Array.from({ length: 50 }, (_, index) => {
    const dt = 1 + index % 3;
    const values = Array.from({ length: 7 }, (_, point) => Math.max(1, 2 + (index % 5) + Math.round(Math.sin(point + index) * 2)));
    const area = values.slice(0, -1).reduce((total, value, point) => total + ((value + values[point + 1]) / 2) * dt, 0);
    return { type: 'squares', values, dt, area };
  });
}

function questionsFor(key) {
  if (key === 'formulas') return formulaQuestions();
  if (key.startsWith('sig')) return significanceQuestions(key);
  if (key === 'units') return unitQuestions();
  if (key === 'tangent') return graphQuestions('tangent');
  return squareQuestions();
}

async function loadProgress() {
  const saved = localStorage.getItem('physics-practice-progress');
  if (saved) { try { const parsed = JSON.parse(saved); state.records = parsed.records || {}; language = parsed.language || language; } catch { /* ignore */ } }
  if (!supabase) return;
  const { data, error } = await supabase.from('formula_battle_progress').select('language, records').eq('device_id', deviceId).maybeSingle();
  if (!error && data) { language = data.language || language; state.records = data.records || {}; localStorage.setItem('physics-practice-progress', JSON.stringify({ language, records: state.records })); }
}

async function saveProgress() {
  localStorage.setItem('physics-practice-progress', JSON.stringify({ language, records: state.records }));
  updateSync(t('sync'));
  if (!supabase) { updateSync(t('syncOffline')); return; }
  const { error } = await supabase.from('formula_battle_progress').upsert({ device_id: deviceId, language, records: state.records, updated_at: new Date().toISOString() });
  updateSync(error ? t('syncOffline') : t('synced'));
}

function updateSync(text) { const element = document.querySelector('[data-sync]'); if (element) element.textContent = text; }

function renderLanguagePicker() {
  app.innerHTML = `<main class="app-shell"><div class="lang-picker">
    <div class="lang-picker-mark">N</div>
    <h2 class="lang-picker-title">Natuurkunde oefenen</h2>
    <p class="lang-picker-subtitle">Choose your language / Kies je taal</p>
    <div class="lang-picker-buttons">
      <button class="lang-picker-btn" data-pick="nl">Nederlands</button>
      <button class="lang-picker-btn" data-pick="en">English</button>
    </div>
  </div></main>`;
  document.querySelectorAll('[data-pick]').forEach(button => button.addEventListener('click', () => {
    language = button.dataset.pick;
    localStorage.setItem('physics-practice-language', language);
    saveProgress();
    renderHome();
  }));
}

function recordFor(key) {
  const stored = Number(state.records[key] || 0);
  return stored <= roundSize ? stored * 10 : Math.round(stored);
}
function formatPercent(value) { return `${Math.round(value)}${t('percentGood')}`; }
function moduleTitle(key) { return moduleInfo[key][language][0]; }
function moduleDescription(key) { return moduleInfo[key][language][1]; }
function randomRound(key) { return sample(questionsFor(key), roundSize); }

function renderHome() {
  state.active = null;
  const cards = moduleKeys.map((key, index) => {
    const best = recordFor(key);
    const status = best ? `<span class="best-score">${t('best')}: ${formatPercent(best)}</span>` : t('notStarted');
    return `<button class="module-card" data-module="${key}"><span class="module-icon">${String(index + 1).padStart(2, '0')}</span><h4>${esc(moduleTitle(key))}</h4><p>${esc(moduleDescription(key))}</p><div class="module-status"><span>${status}</span><span>50 ${t('exercises')}</span></div></button>`;
  }).join('');
  const scores = moduleKeys.map(key => {
    const percent = recordFor(key);
    return `<div class="score-row"><div class="score-row-top"><span>${esc(moduleTitle(key))}</span><span>${formatPercent(percent)}</span></div><div class="progress"><i style="width:${percent}%"></i></div></div>`;
  }).join('');
  const nextModule = moduleKeys.find(key => recordFor(key) < 100) || 'formulas';
  app.innerHTML = `<main class="app-shell">
    <header class="topbar">
      <div class="brand"><div class="brand-mark">N</div><div><h1>${t('title')}</h1><span class="eyebrow">${t('subtitle')}</span></div></div>
      <div class="top-actions"><button class="lang-toggle" data-language>${t('language')}</button></div>
    </header>
    <section class="intro">
      <h2>${t('introTitle')}</h2>
      <p>${t('introText')}</p>
      <div class="intro-meta">
        <div class="intro-stat"><strong>50</strong><small>${t('exercises')}</small></div>
        <div class="intro-stat"><strong>10</strong><small>${t('question')} / ${t('round')}</small></div>
        <div class="intro-stat"><strong>2</strong><small>${t('languages')}</small></div>
      </div>
    </section>
    <div class="section-heading"><h3>${t('modules')}</h3><p>${t('modulesHint')}</p></div>
    <div class="modules">${cards}</div>
    <section class="dashboard">
      <div class="card">
        <div class="card-head"><h3>${t('score')}</h3><button class="btn-danger" data-reset>${t('reset')}</button></div>
        <div class="scores">${scores}</div>
        <p class="score-note">${t('scoreNote')}</p>
        <div class="sync-status" data-sync>${t('synced')}</div>
      </div>
      <div class="card tip-card">
        <h3>${t('tipTitle')}</h3>
        <p>${t('tipText')}</p>
        <button class="btn btn-primary" data-module="${nextModule}">${t('startBtn')}</button>
      </div>
    </section>
  </main>`;
  document.querySelectorAll('[data-module]').forEach(button => button.addEventListener('click', () => startRound(button.dataset.module)));
  document.querySelector('[data-language]').addEventListener('click', toggleLanguage);
  document.querySelector('[data-reset]').addEventListener('click', resetProgress);
}

function toggleLanguage() {
  language = language === 'nl' ? 'en' : 'nl';
  localStorage.setItem('physics-practice-language', language);
  saveProgress();
  state.active ? renderGame() : renderHome();
}

function resetProgress() {
  if (!confirm(t('resetConfirm'))) return;
  state.records = {};
  saveProgress();
  renderHome();
}

function startRound(key) {
  state.active = key;
  state.questions = randomRound(key);
  state.index = 0;
  state.points = 0;
  state.answered = false;
  renderGame();
}

function renderGame() {
  if (state.index >= roundSize) return finishRound();
  const key = state.active;
  const question = state.questions[state.index];
  const percent = state.index / roundSize * 100;
  app.innerHTML = `<main class="app-shell">
    <header class="topbar">
      <div class="brand"><div class="brand-mark">N</div><div><h1>${t('title')}</h1><span class="eyebrow">${t('subtitle')}</span></div></div>
      <div class="top-actions"><button class="lang-toggle" data-language>${t('language')}</button></div>
    </header>
    <section class="card game-card">
      <div class="game-top">
        <button class="back-button" data-back>← ${t('menu')}</button>
        <span class="module-label">${esc(moduleTitle(key))}</span>
      </div>
      <div class="game-progress"><i style="width:${percent}%"></i></div>
      <span class="question-meta">${t('question')} ${state.index + 1} ${t('of')} ${roundSize}</span>
      ${renderQuestion(question)}
      <div data-answer-area></div>
      <div class="game-actions"><button class="btn btn-primary" data-next hidden>${t('next')} →</button></div>
    </section>
  </main>`;
  document.querySelector('[data-back]').addEventListener('click', renderHome);
  document.querySelector('[data-language]').addEventListener('click', toggleLanguage);
  attachQuestion(question);
}

function renderQuestion(question) {
  if (question.type === 'quiz') {
    return `<h2 class="question-title">${esc(question.title)}</h2><p class="question-subtitle">${esc(question.subtitle)}</p><div class="answer-grid">${question.options.map((option, index) => `<button class="answer-button" data-answer="${index}">${esc(option)}</button>`).join('')}</div>`;
  }
  if (question.type === 'tangent') {
    return `<h2 class="question-title">${t('tangentTitle')}</h2><p class="question-subtitle">${t('slopeHint')}</p><div class="graph-wrap"><svg class="graph" data-graph viewBox="0 0 700 350" aria-label="Graph"></svg></div><input class="range" data-slope type="range" min="-8" max="8" step="0.01" value="${question.correct - 1.4}"><div class="game-actions"><button class="btn btn-primary" data-check>${t('check')}</button></div>`;
  }
  return `<h2 class="question-title">${t('squaresTitle')}</h2><p class="question-subtitle">${t('squaresSub')(question.dt)}</p><div class="graph-wrap"><svg class="graph" data-square-graph viewBox="0 0 700 350" aria-label="Velocity time graph"></svg></div><div class="input-row"><label for="area-answer">${t('displacement')}</label><input class="answer-input" id="area-answer" data-area type="number" step="0.1" placeholder="${t('typeAnswer')}"><span>m</span></div><div class="game-actions"><button class="btn btn-primary" data-check>${t('check')}</button></div>`;
}

function attachQuestion(question) {
  if (question.type === 'quiz') {
    document.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => answerQuiz(question, button)));
  }
  if (question.type === 'tangent') {
    drawTangent(question, Number(document.querySelector('[data-slope]').value));
    document.querySelector('[data-slope]').addEventListener('input', event => drawTangent(question, Number(event.target.value)));
    document.querySelector('[data-check]').addEventListener('click', () => {
      const chosen = Number(document.querySelector('[data-slope]').value);
      const scorePercent = tangentAccuracy(chosen, question.correct);
      answerInteractive(scorePercent === 100, question.correct.toFixed(2), t('tangentExplain'), scorePercent);
    });
  }
  if (question.type === 'squares') {
    drawSquares(question);
    document.querySelector('[data-check]').addEventListener('click', () => {
      const value = Number(document.querySelector('[data-area]').value);
      if (!Number.isFinite(value)) return;
      answerInteractive(Math.abs(value - question.area) <= Math.max(1, question.area * .05), question.area.toFixed(1), t('squaresExplain'));
    });
  }
}

function tangentAccuracy(chosen, correct) {
  const tolerance = 1.4;
  return Math.max(0, Math.round((1 - Math.abs(chosen - correct) / tolerance) * 100));
}

function answerQuiz(question, button) {
  if (state.answered) return;
  state.answered = true;
  const chosen = button.textContent;
  const correct = chosen === question.correct;
  button.classList.add(correct ? 'correct' : 'incorrect');
  document.querySelectorAll('[data-answer]').forEach(option => { option.disabled = true; if (option.textContent === question.correct) option.classList.add('correct'); });
  showFeedback(correct, question.correct, question.explanation);
}

function answerInteractive(correct, answer, explanation, scorePercent = correct ? 100 : 0) {
  if (state.answered) return;
  state.answered = true;
  document.querySelector('[data-check]').disabled = true;
  showFeedback(correct, answer, explanation, scorePercent);
}

function showFeedback(correct, answer, explanation, scorePercent = correct ? 100 : 0) {
  state.points += scorePercent;
  const area = document.querySelector('[data-answer-area]');
  area.innerHTML = `<div class="feedback"><strong class="${scorePercent >= 50 ? '' : 'bad'}">${formatPercent(scorePercent)}</strong><p>${t('answer')}: <b>${esc(answer)}</b></p><p>${esc(explanation)}</p></div>`;
  const next = document.querySelector('[data-next]');
  next.hidden = false;
  next.addEventListener('click', () => { state.index += 1; state.answered = false; renderGame(); });
}

function drawTangent(question, slope) {
  const svg = document.querySelector('[data-graph]');
  if (!svg) return;
  const W = 700, H = 350, L = 55, B = 285, plotW = 610, plotH = 235;
  const sx = x => L + x / 10 * plotW;
  const sy = y => B - (y + 5) / 35 * plotH;
  const value = x => question.base + question.slope * x + question.curve * x * x;
  const pointX = question.time, pointY = value(pointX);
  const x1 = Math.max(0, pointX - 3), x2 = Math.min(10, pointX + 3);
  let grid = '';
  for (let x = 0; x <= 10; x += 1) grid += `<line class="graph-grid" x1="${sx(x)}" y1="${B - plotH}" x2="${sx(x)}" y2="${B}"/>`;
  let curve = '';
  for (let i = 0; i <= 100; i += 1) { const x = i / 10; curve += `${i ? 'L' : 'M'}${sx(x)} ${sy(value(x))} `; }
  svg.innerHTML = `${grid}<line class="graph-axis" x1="${L}" y1="${B}" x2="${W - 30}" y2="${B}"/><line class="graph-axis" x1="${L}" y1="${B - plotH}" x2="${L}" y2="${B}"/><path class="graph-curve" d="${curve}"/><line class="graph-tangent" x1="${sx(x1)}" y1="${sy(pointY + slope * (x1 - pointX))}" x2="${sx(x2)}" y2="${sy(pointY + slope * (x2 - pointX))}"/><circle class="graph-point" cx="${sx(pointX)}" cy="${sy(pointY)}" r="7"/><text x="${sx(pointX) + 12}" y="${sy(pointY) - 12}" fill="#d4c57b">P</text><text x="${W - 80}" y="${H - 12}" fill="#7a8599">t (s)</text>`;
}

function drawSquares(question) {
  const svg = document.querySelector('[data-square-graph]');
  if (!svg) return;
  const W = 700, H = 350, L = 55, B = 285, plotW = 610, plotH = 235;
  const max = Math.max(...question.values) + 2;
  const sx = i => L + i / (question.values.length - 1) * plotW;
  const sy = y => B - y / max * plotH;
  let grid = '';
  for (let i = 0; i < question.values.length; i += 1) grid += `<line class="graph-grid" x1="${sx(i)}" y1="${B - plotH}" x2="${sx(i)}" y2="${B}"/>`;
  for (let i = 0; i <= max; i += 1) grid += `<line class="graph-grid" x1="${L}" y1="${sy(i)}" x2="${L + plotW}" y2="${sy(i)}"/>`;
  const path = question.values.map((value, index) => `${index ? 'L' : 'M'}${sx(index)} ${sy(value)}`).join(' ');
  const shade = `M${sx(0)} ${B} ${question.values.map((value, index) => `L${sx(index)} ${sy(value)}`).join(' ')} L${sx(question.values.length - 1)} ${B} Z`;
  svg.innerHTML = `${grid}<path d="${shade}" fill="rgba(111,163,212,0.18)"/><path class="graph-curve" d="${path}"/><line class="graph-axis" x1="${L}" y1="${B}" x2="${L + plotW}" y2="${B}"/><line class="graph-axis" x1="${L}" y1="${B - plotH}" x2="${L}" y2="${B}"/><text x="${W - 80}" y="${H - 12}" fill="#7a8599">t (s)</text><text x="14" y="28" fill="#7a8599">v</text>`;
}

function finishRound() {
  const key = state.active;
  const previous = recordFor(key);
  const roundPercent = Math.round(state.points / roundSize);
  state.records[key] = Math.max(previous, roundPercent);
  saveProgress();
  app.innerHTML = `<main class="app-shell">
    <section class="card game-card finish">
      <span class="eyebrow">${esc(moduleTitle(key))}</span>
      <h1>${roundPercent === 100 ? t('perfect') : t('finish')}</h1>
      <div class="finish-score">${formatPercent(roundPercent)}</div>
      <p>${t('best')}: ${formatPercent(Math.max(previous, roundPercent))}</p>
      <div class="finish-actions">
        <button class="btn btn-outline" data-home>← ${t('back')}</button>
        <button class="btn btn-primary" data-again>${t('newRound')} →</button>
      </div>
    </section>
  </main>`;
  document.querySelector('[data-home]').addEventListener('click', renderHome);
  document.querySelector('[data-again]').addEventListener('click', () => startRound(key));
}

await loadProgress();
if (language) renderHome(); else renderLanguagePicker();
