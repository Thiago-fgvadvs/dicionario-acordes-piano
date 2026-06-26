import {
  CHORD_QUALITIES,
  EXAMPLES,
  ROOTS,
  buildVoicing,
  isBlackKey,
  extractChordSymbolsFromChart,
  midiToFrequency,
  nearestBAtOrAbove,
  nearestCAtOrBelow,
  noteNameFromMidi,
  parseChordSymbol,
  parseProgression,
} from "./chord-engine.js?v=20260626b";

const STORAGE_KEY = "piano-chord-dictionary-recents";

const state = {
  query: "",
  selectedIndex: 0,
  inversion: 0,
  selectedRoot: "",
  selectedQuality: null,
  songText: "",
  songAnalysis: null,
  audioContext: null,
  lastPlayStartedAt: 0,
};

const app = document.querySelector("#app");

function loadRecents() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.slice(0, 8) : [];
  } catch {
    return [];
  }
}

function saveRecent(value) {
  const clean = value.trim();
  if (!clean) return;
  const next = [clean, ...loadRecents().filter((item) => item !== clean)].slice(0, 8);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function groupedQualities() {
  return CHORD_QUALITIES.reduce((groups, quality) => {
    groups[quality.family] ||= [];
    groups[quality.family].push(quality);
    return groups;
  }, {});
}

function parseCurrentProgression() {
  const parsed = parseProgression(state.query);
  return parsed;
}

function selectedChordFrom(parsed) {
  const valid = parsed.filter((item) => item.ok);
  if (!valid.length) return null;
  const index = Math.min(state.selectedIndex, valid.length - 1);
  return valid[index];
}

function qualityButtonClass(quality) {
  return quality.symbol === state.selectedQuality ? "quality-button is-selected" : "quality-button";
}

function rootButtonClass(root) {
  return root === state.selectedRoot ? "root-button is-selected" : "root-button";
}

function syncSelectorsFromChord(chord) {
  if (!chord?.ok) return;
  state.selectedRoot = chord.root.name;
  state.selectedQuality = chord.suffix;
}

function renderShell() {
  const parsed = parseCurrentProgression();
  const selectedChord = selectedChordFrom(parsed);
  const recents = loadRecents();
  const groups = groupedQualities();

  app.innerHTML = `
    <div class="app-shell">
      <aside class="side-panel">
        <div class="brand-row">
          <div class="brand-mark" aria-hidden="true"></div>
          <div>
            <h1>Dicionário de Acordes</h1>
            <span>Piano</span>
          </div>
        </div>

        <form class="search-panel" id="search-form">
          <label for="chord-input">Digite uma cifra ou sequência</label>
          <div class="search-row">
            <input id="chord-input" value="${escapeHtml(state.query)}" autocomplete="off" spellcheck="false" placeholder="A9 ou Am7 D9 Gmaj7" />
            <button class="primary-button" type="submit" aria-label="Buscar">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.9 18a7.1 7.1 0 1 1 5.02-12.12A7.1 7.1 0 0 1 10.9 18Zm0-2a5.1 5.1 0 1 0 0-10.2 5.1 5.1 0 0 0 0 10.2Zm5.8.2 4 4-1.5 1.4-4-4 1.5-1.4Z"/></svg>
              Buscar
            </button>
          </div>
        </form>

        <form class="song-panel" id="song-form">
          <label for="song-chart-input">Cole a cifra da música</label>
          <textarea id="song-chart-input" spellcheck="false" placeholder="Intro: G D Em C&#10;Verso: Am7 D9 Gmaj7">${escapeHtml(state.songText)}</textarea>
          <button class="secondary-button" type="submit">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v4H4V4Zm0 6h10v4H4v-4Zm0 6h16v4H4v-4Zm13-6 4 2-4 2v-4Z"/></svg>
            Analisar cifra
          </button>
          ${state.songAnalysis ? `
            <div class="song-status ${state.songAnalysis.count ? "is-ok" : "is-empty"}">
              ${escapeHtml(state.songAnalysis.message)}
            </div>
          ` : ""}
        </form>

        <section class="selector-section" aria-label="Tonalidade">
          <div class="section-heading">
            <h2>Notas</h2>
          </div>
          <div class="root-grid">
            ${ROOTS.map((root) => `<button class="${rootButtonClass(root)}" data-root="${root}">${root}</button>`).join("")}
          </div>
        </section>

        <section class="selector-section library-section" aria-label="Biblioteca">
          <div class="section-heading">
            <h2>Biblioteca</h2>
          </div>
          <div class="quality-groups">
            ${Object.entries(groups)
              .map(
                ([family, qualities]) => `
                  <div class="quality-group">
                    <h3>${family}</h3>
                    <div class="quality-list">
                      ${qualities
                        .map(
                          (quality) => `
                            <button class="${qualityButtonClass(quality)}" data-quality="${escapeHtml(quality.symbol)}" title="${escapeHtml(quality.formula)}">
                              <span>${escapeHtml(quality.label)}</span>
                              <code>${escapeHtml(state.selectedRoot ? state.selectedRoot + quality.symbol : quality.example)}</code>
                            </button>
                          `,
                        )
                        .join("")}
                    </div>
                  </div>
                `,
              )
              .join("")}
          </div>
        </section>

        <section class="selector-section" aria-label="Exemplos recentes">
          <div class="section-heading">
            <h2>Recentes</h2>
          </div>
          <div class="example-list">
            ${[...recents, ...EXAMPLES]
              .filter((item, index, list) => list.indexOf(item) === index)
              .slice(0, 10)
              .map((example) => `<button class="example-button" data-example="${escapeHtml(example)}">${escapeHtml(example)}</button>`)
              .join("")}
          </div>
        </section>
      </aside>

      <main class="workspace">
        <header class="topbar">
          <div>
            <span class="topbar-label">Acorde selecionado</span>
            <strong>${selectedChord?.ok ? escapeHtml(selectedChord.symbol) : "Nenhum acorde"}</strong>
          </div>
          <div class="topbar-actions">
            <button class="ghost-button" id="play-chord" ${selectedChord ? "" : "disabled"}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.2v13.6L18.8 12 8 5.2Z"/></svg>
              Tocar
            </button>
            <button class="ghost-button" id="copy-notes" ${selectedChord ? "" : "disabled"}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7V3h14v14h-4v4H3V7h4Zm2 0h8v8h2V5H9v2Zm-4 2v10h10V9H5Z"/></svg>
              Copiar notas
            </button>
          </div>
        </header>

        ${selectedChord ? renderMainContent(selectedChord, parsed) : renderEmptyContent(parsed)}
      </main>
    </div>
  `;

  bindEvents(parsed, selectedChord);
  if (selectedChord) {
    renderKeyboard(document.querySelector("#main-keyboard"), selectedChord, state.inversion, "large");
    document.querySelectorAll("[data-mini-keyboard]").forEach((element) => {
      const chord = parsed.filter((item) => item.ok)[Number(element.dataset.miniKeyboard)];
      renderKeyboard(element, chord, 0, "mini");
    });
  }
}

function renderMainContent(chord, parsed) {
  const voicing = buildVoicing(chord, state.inversion);
  const inversionCount = chord.tones.length;
  const validChords = parsed.filter((item) => item.ok);

  return `
    <section class="chord-stage">
      <div class="stage-header">
        <div>
          <span>Desenho no piano</span>
          <h2>${escapeHtml(chord.symbol)}</h2>
        </div>
        <div class="formula-strip" aria-label="Fórmula do acorde">
          ${chord.tones.map((tone) => `<span style="--tone-color: ${tone.color}">${escapeHtml(tone.degree)}</span>`).join("")}
        </div>
      </div>

      <div class="keyboard-wrap">
        <div id="main-keyboard"></div>
      </div>

      <div class="inversion-panel">
        <div>
          <span>Inversões</span>
          <strong>${escapeHtml(voicing.label)}</strong>
        </div>
        <div class="inversion-list" role="group" aria-label="Inversões">
          ${Array.from({ length: inversionCount }, (_, index) => {
            const label = index === 0 ? "Fundamental" : `${index}ª`;
            return `<button class="inversion-button ${index === state.inversion ? "is-selected" : ""}" data-inversion="${index}">${label}</button>`;
          }).join("")}
        </div>
      </div>
    </section>

    <section class="details-grid">
      <article class="detail-panel">
        <div class="panel-title">
          <span>Notas</span>
          <strong>${escapeHtml(chord.notes.join(" - "))}</strong>
        </div>
        <div class="tone-list">
          ${chord.tones
            .map(
              (tone) => `
                <div class="tone-chip" style="--tone-color: ${tone.color}">
                  <span>${escapeHtml(tone.note)}</span>
                  <small>${escapeHtml(tone.degree)}</small>
                </div>
              `,
            )
            .join("")}
        </div>
        <dl class="chord-facts">
          <div><dt>Tipo</dt><dd>${escapeHtml(chord.qualityLabel)}</dd></div>
          <div><dt>Fórmula</dt><dd>${escapeHtml(chord.formula)}</dd></div>
          <div><dt>Voz atual</dt><dd>${escapeHtml(voicing.pitches.map((item) => item.tone.note).join(" - "))}</dd></div>
          ${chord.slashBass ? `<div><dt>Baixo</dt><dd>${escapeHtml(chord.slashBass.name)}</dd></div>` : ""}
        </dl>
      </article>

      <article class="detail-panel progression-panel">
        <div class="panel-title">
          <span>Progressão</span>
          <strong>${validChords.length} acorde${validChords.length === 1 ? "" : "s"}</strong>
        </div>
        <div class="progression-list">
          ${validChords
            .map(
              (item, index) => `
                <button class="progression-card ${index === state.selectedIndex ? "is-selected" : ""}" data-chord-index="${index}">
                  <div>
                    <strong>${escapeHtml(item.symbol)}</strong>
                    <span>${escapeHtml(item.notes.join(" - "))}</span>
                  </div>
                  <div class="mini-keyboard" data-mini-keyboard="${index}"></div>
                </button>
              `,
            )
            .join("")}
        </div>
      </article>
    </section>
  `;
}

function renderEmptyContent(parsed) {
  const errors = parsed.filter((item) => !item.ok);
  const hasQuery = state.query.trim().length > 0;
  return `
    <section class="empty-state">
      <h2>${hasQuery ? "Não reconheci essa cifra" : "Digite uma cifra para começar"}</h2>
      <p>${escapeHtml(hasQuery ? errors[0]?.error || "Tente uma cifra como A9, C#m7(b5) ou Am7 D9 Gmaj7." : "Use a busca rápida ou cole uma cifra inteira de música para extrair os acordes.")}</p>
      <div class="example-list is-centered">
        ${EXAMPLES.slice(0, 6)
          .map((example) => `<button class="example-button" data-example="${escapeHtml(example)}">${escapeHtml(example)}</button>`)
          .join("")}
      </div>
    </section>
  `;
}

function bindEvents(parsed, selectedChord) {
  const form = document.querySelector("#search-form");
  const input = document.querySelector("#chord-input");
  const songForm = document.querySelector("#song-form");
  const songInput = document.querySelector("#song-chart-input");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.query = input.value.trim();
    state.selectedIndex = 0;
    state.inversion = 0;
    syncSelectorsFromChord(parseProgression(state.query).find((item) => item.ok));
    if (state.query) saveRecent(state.query);
    renderShell();
  });

  input?.addEventListener("input", () => {
    state.query = input.value;
  });

  songInput?.addEventListener("input", () => {
    state.songText = songInput.value;
  });

  songForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.songText = songInput.value;
    const symbols = extractChordSymbolsFromChart(state.songText);
    const uniqueCount = new Set(symbols).size;
    state.songAnalysis = symbols.length
      ? {
          count: symbols.length,
          message: `${symbols.length} acorde${symbols.length === 1 ? "" : "s"} encontrado${symbols.length === 1 ? "" : "s"} (${uniqueCount} único${uniqueCount === 1 ? "" : "s"}).`,
        }
      : {
          count: 0,
          message: "Nenhum acorde encontrado. Tente linhas como: G D Em C.",
        };
    if (symbols.length) {
      state.query = symbols.join(" ");
      state.selectedIndex = 0;
      state.inversion = 0;
      syncSelectorsFromChord(parseProgression(state.query).find((item) => item.ok));
    }
    renderShell();
  });

  document.querySelectorAll("[data-example]").forEach((button) => {
    button.addEventListener("click", () => {
      state.query = button.dataset.example;
      state.selectedIndex = 0;
      state.inversion = 0;
      syncSelectorsFromChord(parseProgression(state.query).find((item) => item.ok));
      saveRecent(state.query);
      renderShell();
    });
  });

  document.querySelectorAll("[data-root]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedRoot = button.dataset.root;
      state.query = `${state.selectedRoot}${state.selectedQuality ?? ""}`;
      state.selectedIndex = 0;
      state.inversion = 0;
      saveRecent(state.query);
      renderShell();
    });
  });

  document.querySelectorAll("[data-quality]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedQuality = button.dataset.quality;
      if (!state.selectedRoot) state.selectedRoot = "C";
      state.query = `${state.selectedRoot}${state.selectedQuality}`;
      state.selectedIndex = 0;
      state.inversion = 0;
      saveRecent(state.query);
      renderShell();
    });
  });

  document.querySelectorAll("[data-inversion]").forEach((button) => {
    button.addEventListener("click", () => {
      state.inversion = Number(button.dataset.inversion);
      renderShell();
    });
  });

  document.querySelectorAll("[data-chord-index]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedIndex = Number(button.dataset.chordIndex);
      state.inversion = 0;
      syncSelectorsFromChord(parsed.filter((item) => item.ok)[state.selectedIndex]);
      renderShell();
    });
  });

  const playButton = document.querySelector("#play-chord");
  const requestPlay = (event) => {
    if (!selectedChord) return;
    if (event?.type === "pointerdown" && event.button !== 0) return;

    const now = performance.now();
    if (now - state.lastPlayStartedAt < 420) return;
    state.lastPlayStartedAt = now;

    if (event?.type !== "click" && event?.cancelable) event.preventDefault();
    playChord(selectedChord, state.inversion);
  };
  playButton?.addEventListener("pointerdown", requestPlay);
  playButton?.addEventListener("touchstart", requestPlay, { passive: false });
  playButton?.addEventListener("click", requestPlay);

  document.querySelector("#copy-notes")?.addEventListener("click", async () => {
    if (!selectedChord) return;
    await navigator.clipboard?.writeText(`${selectedChord.symbol}: ${selectedChord.notes.join(" - ")}`);
    const button = document.querySelector("#copy-notes");
    if (button) {
      const original = button.innerHTML;
      button.innerHTML = "Notas copiadas";
      setTimeout(() => {
        button.innerHTML = original;
      }, 1000);
    }
  });
}

function keyboardRangeFor(voicing, size) {
  if (size === "mini") return { min: 48, max: 71 };
  const minPitch = Math.min(...voicing.midiList);
  const maxPitch = Math.max(...voicing.midiList);
  return {
    min: Math.min(48, nearestCAtOrBelow(minPitch - 2)),
    max: Math.max(84, nearestBAtOrAbove(maxPitch + 2)),
  };
}

function renderKeyboard(container, chord, inversion, size = "large") {
  if (!container || !chord?.ok) return;

  const voicing = buildVoicing(chord, inversion);
  const range = keyboardRangeFor(voicing, size);
  const allKeys = [];
  for (let midi = range.min; midi <= range.max; midi += 1) allKeys.push(midi);

  const whiteKeys = allKeys.filter((midi) => !isBlackKey(midi));
  const activeByMidi = new Map(voicing.pitches.map((item) => [item.midi, item]));
  const preferFlats = chord.root.accidental === "b";
  const whiteMarkup = whiteKeys
    .map((midi) => {
      const active = activeByMidi.get(midi);
      const label = active ? active.tone.note : noteNameFromMidi(midi, preferFlats);
      return `
        <div class="piano-key white-key ${active ? "is-active" : ""}" style="${active ? `--tone-color: ${active.tone.color}` : ""}" data-midi="${midi}">
          ${active ? `<span class="key-degree">${escapeHtml(active.tone.degree)}</span><strong>${escapeHtml(label)}</strong>` : `<span>${escapeHtml(label)}</span>`}
        </div>
      `;
    })
    .join("");

  let whiteIndex = -1;
  const blackMarkup = allKeys
    .map((midi) => {
      if (!isBlackKey(midi)) {
        whiteIndex += 1;
        return "";
      }
      const active = activeByMidi.get(midi);
      const label = active ? active.tone.note : noteNameFromMidi(midi, preferFlats);
      return `
        <div class="piano-key black-key ${active ? "is-active" : ""}" style="--key-index: ${whiteIndex}; ${active ? `--tone-color: ${active.tone.color}` : ""}" data-midi="${midi}">
          ${active ? `<span class="key-degree">${escapeHtml(active.tone.degree)}</span><strong>${escapeHtml(label)}</strong>` : ""}
        </div>
      `;
    })
    .join("");

  container.innerHTML = `
    <div class="keyboard ${size === "mini" ? "is-mini" : ""}" style="--white-count: ${whiteKeys.length}">
      <div class="white-keys">${whiteMarkup}</div>
      <div class="black-keys">${blackMarkup}</div>
    </div>
  `;
}

function getAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  state.audioContext ||= new AudioContext();
  return state.audioContext;
}

function primeAudioContext() {
  const context = getAudioContext();
  if (!context) return null;

  context.resume?.().catch(() => {});
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(440, now);
  gain.gain.setValueAtTime(0.0001, now);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.03);
  return context;
}

function playChord(chord, inversion) {
  const voicing = buildVoicing(chord, inversion);
  if (!voicing) return;

  const context = primeAudioContext();
  if (!context) return;

  context.resume?.().catch(() => {});

  const now = context.currentTime + 0.06;
  const compressor = context.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-20, now);
  compressor.knee.setValueAtTime(24, now);
  compressor.ratio.setValueAtTime(5.5, now);
  compressor.attack.setValueAtTime(0.003, now);
  compressor.release.setValueAtTime(0.18, now);

  const masterGain = context.createGain();
  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.exponentialRampToValueAtTime(1.75, now + 0.025);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + voicing.midiList.length * 0.36 + 2.8);
  masterGain.connect(compressor);
  compressor.connect(context.destination);

  const scheduleTone = (midi, start, duration, peak) => {
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2600, start);
    filter.Q.setValueAtTime(0.7, start);

    const oscillator = context.createOscillator();
    const overtone = context.createOscillator();
    const gain = context.createGain();
    const overtoneGain = context.createGain();

    oscillator.type = "triangle";
    overtone.type = "sine";
    oscillator.frequency.setValueAtTime(midiToFrequency(midi), start);
    overtone.frequency.setValueAtTime(midiToFrequency(midi) * 2, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    overtoneGain.gain.setValueAtTime(0.0001, start);
    overtoneGain.gain.exponentialRampToValueAtTime(peak * 0.22, start + 0.02);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, start + duration * 0.72);

    oscillator.connect(gain);
    overtone.connect(overtoneGain);
    gain.connect(filter);
    overtoneGain.connect(filter);
    filter.connect(masterGain);

    oscillator.start(start);
    overtone.start(start);
    oscillator.stop(start + duration + 0.08);
    overtone.stop(start + duration + 0.08);
  };

  voicing.midiList.forEach((midi, index) => {
    scheduleTone(midi, now + index * 0.36, 0.58, 0.46);
  });

  const chordStart = now + voicing.midiList.length * 0.36 + 0.16;
  const chordPeak = Math.min(0.4, 1.35 / Math.max(2, voicing.midiList.length));
  voicing.midiList.forEach((midi) => {
    scheduleTone(midi, chordStart, 2.25, chordPeak);
  });
}

window.addEventListener("pointerdown", primeAudioContext, { once: true, passive: true });
window.addEventListener("touchstart", primeAudioContext, { once: true, passive: true });
window.addEventListener("touchend", primeAudioContext, { once: true, passive: true });

renderShell();
