const NOTE_VALUES = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
const SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

const DEGREE_META = {
  "1": { letterSteps: 0, group: "root" },
  "b2": { letterSteps: 1, group: "second" },
  "2": { letterSteps: 1, group: "second" },
  "#2": { letterSteps: 1, group: "second" },
  "b3": { letterSteps: 2, group: "third" },
  "3": { letterSteps: 2, group: "third" },
  "4": { letterSteps: 3, group: "fourth" },
  "#4": { letterSteps: 3, group: "fourth" },
  "b5": { letterSteps: 4, group: "fifth" },
  "5": { letterSteps: 4, group: "fifth" },
  "#5": { letterSteps: 4, group: "fifth" },
  "6": { letterSteps: 5, group: "sixth" },
  "bb7": { letterSteps: 6, group: "seventh" },
  "b7": { letterSteps: 6, group: "seventh" },
  "7": { letterSteps: 6, group: "seventh" },
  "b9": { letterSteps: 1, group: "ninth" },
  "9": { letterSteps: 1, group: "ninth" },
  "#9": { letterSteps: 1, group: "ninth" },
  "11": { letterSteps: 3, group: "eleventh" },
  "#11": { letterSteps: 3, group: "eleventh" },
  "b13": { letterSteps: 5, group: "thirteenth" },
  "13": { letterSteps: 5, group: "thirteenth" },
};

const TONE_COLORS = {
  root: "#0e9384",
  second: "#7f56d9",
  third: "#e2554f",
  fourth: "#2563eb",
  fifth: "#d08a00",
  sixth: "#c2410c",
  seventh: "#475467",
  ninth: "#7f56d9",
  eleventh: "#2563eb",
  thirteenth: "#c2410c",
};

export const ROOTS = ["C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B"];

export const CHORD_QUALITIES = [
  { symbol: "", label: "Maior", family: "Tríades", example: "C", formula: "1 3 5" },
  { symbol: "m", label: "Menor", family: "Tríades", example: "Cm", formula: "1 b3 5" },
  { symbol: "dim", label: "Diminuto", family: "Tríades", example: "Cdim", formula: "1 b3 b5" },
  { symbol: "aug", label: "Aumentado", family: "Tríades", example: "Caug", formula: "1 3 #5" },
  { symbol: "sus2", label: "Suspenso 2", family: "Suspensos", example: "Csus2", formula: "1 2 5" },
  { symbol: "sus4", label: "Suspenso 4", family: "Suspensos", example: "Csus4", formula: "1 4 5" },
  { symbol: "5", label: "Power", family: "Tríades", example: "C5", formula: "1 5" },
  { symbol: "6", label: "Sexta", family: "Sextas", example: "C6", formula: "1 3 5 6" },
  { symbol: "m6", label: "Menor sexta", family: "Sextas", example: "Cm6", formula: "1 b3 5 6" },
  { symbol: "6/9", label: "Sexta nona", family: "Sextas", example: "C6/9", formula: "1 3 5 6 9" },
  { symbol: "7", label: "Dominante", family: "Sétimas", example: "C7", formula: "1 3 5 b7" },
  { symbol: "maj7", label: "Maior sétima", family: "Sétimas", example: "Cmaj7", formula: "1 3 5 7" },
  { symbol: "m7", label: "Menor sétima", family: "Sétimas", example: "Cm7", formula: "1 b3 5 b7" },
  { symbol: "mMaj7", label: "Menor maior 7", family: "Sétimas", example: "CmMaj7", formula: "1 b3 5 7" },
  { symbol: "dim7", label: "Diminuto 7", family: "Sétimas", example: "Cdim7", formula: "1 b3 b5 bb7" },
  { symbol: "m7b5", label: "Meio diminuto", family: "Sétimas", example: "Cm7b5", formula: "1 b3 b5 b7" },
  { symbol: "7sus4", label: "Dominante sus4", family: "Suspensos", example: "C7sus4", formula: "1 4 5 b7" },
  { symbol: "add9", label: "Add9", family: "Nona", example: "Cadd9", formula: "1 3 5 9" },
  { symbol: "madd9", label: "Menor add9", family: "Nona", example: "Cmadd9", formula: "1 b3 5 9" },
  { symbol: "9", label: "Nona dominante", family: "Nona", example: "C9", formula: "1 3 5 b7 9" },
  { symbol: "maj9", label: "Maior nona", family: "Nona", example: "Cmaj9", formula: "1 3 5 7 9" },
  { symbol: "m9", label: "Menor nona", family: "Nona", example: "Cm9", formula: "1 b3 5 b7 9" },
  { symbol: "11", label: "Décima primeira", family: "Extensões", example: "C11", formula: "1 3 5 b7 9 11" },
  { symbol: "m11", label: "Menor 11", family: "Extensões", example: "Cm11", formula: "1 b3 5 b7 9 11" },
  { symbol: "13", label: "Décima terceira", family: "Extensões", example: "C13", formula: "1 3 5 b7 9 11 13" },
  { symbol: "maj13", label: "Maior 13", family: "Extensões", example: "Cmaj13", formula: "1 3 5 7 9 11 13" },
  { symbol: "m13", label: "Menor 13", family: "Extensões", example: "Cm13", formula: "1 b3 5 b7 9 11 13" },
  { symbol: "7b9", label: "Dominante b9", family: "Alterados", example: "C7b9", formula: "1 3 5 b7 b9" },
  { symbol: "7#9", label: "Dominante #9", family: "Alterados", example: "C7#9", formula: "1 3 5 b7 #9" },
  { symbol: "7#11", label: "Dominante #11", family: "Alterados", example: "C7#11", formula: "1 3 5 b7 #11" },
  { symbol: "7b13", label: "Dominante b13", family: "Alterados", example: "C7b13", formula: "1 3 5 b7 b13" },
  { symbol: "7b5", label: "Dominante b5", family: "Alterados", example: "C7b5", formula: "1 3 b5 b7" },
  { symbol: "7#5", label: "Dominante #5", family: "Alterados", example: "C7#5", formula: "1 3 #5 b7" },
  { symbol: "7alt", label: "Alterado", family: "Alterados", example: "C7alt", formula: "1 3 b7 b9 #9 #11 b13" },
];

export const EXAMPLES = ["A9", "C#m7(b5)", "F7(#11)", "Bbmaj7", "Dm9 G13 Cmaj9", "Am7 D9 Gmaj7", "C/E", "G7alt"];

function mod(value, base = 12) {
  return ((value % base) + base) % base;
}

function normalizeAccidental(accidental = "") {
  return accidental.replace("♯", "#").replace("♭", "b");
}

function normalizeSymbol(symbol) {
  return symbol
    .trim()
    .replaceAll("♯", "#")
    .replaceAll("♭", "b")
    .replaceAll("−", "-")
    .replaceAll("△", "maj")
    .replaceAll("Δ", "maj");
}

export function splitProgression(input) {
  return normalizeSymbol(input)
    .replaceAll("\n", " ")
    .split(/[|,;]+|\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

const VALID_BASE_QUALITIES = new Set([
  "",
  "m",
  "min",
  "-",
  "maj",
  "M",
  "maj7",
  "M7",
  "maj9",
  "maj11",
  "maj13",
  "m7",
  "m9",
  "m11",
  "m13",
  "m6",
  "mMaj7",
  "mmaj7",
  "dim",
  "dim7",
  "°",
  "ø",
  "m7b5",
  "aug",
  "+",
  "sus",
  "sus2",
  "sus4",
  "5",
  "6",
  "6/9",
  "69",
  "7",
  "9",
  "11",
  "13",
  "7sus4",
  "add9",
  "madd9",
  "7b9",
  "7#9",
  "7#11",
  "7b13",
  "7b5",
  "7#5",
  "7alt",
  "alt",
]);

function stripOuterChordPunctuation(token) {
  return normalizeSymbol(token)
    .replace(/^[\[(<{]+/, "")
    .replace(/[\])>},.;:!?]+$/, "")
    .trim();
}

export function isChordCandidate(token) {
  const clean = stripOuterChordPunctuation(token);
  if (!clean) return false;

  const slashMatch = clean.match(/\/([A-Ga-g][#b]?)$/);
  const body = slashMatch ? clean.slice(0, -slashMatch[0].length) : clean;
  const root = parseRoot(body);
  if (!root || root.length !== 1 + root.accidental.length) return false;

  let suffix = body.slice(root.length);
  suffix = suffix.replace(/\((?:[#b]?(?:5|9|11|13)|add(?:2|4|6|9|11|13)|sus[24]?)\)/g, "");
  suffix = suffix.replace(/[#b](?:5|9|11|13)/g, "");

  return VALID_BASE_QUALITIES.has(suffix);
}

export function extractChordSymbolsFromChart(chartText) {
  const results = [];
  const pushChord = (token) => {
    const clean = stripOuterChordPunctuation(token);
    if (clean && isChordCandidate(clean)) results.push(clean);
  };

  for (const rawLine of normalizeSymbol(chartText).split(/\r?\n/)) {
    const bracketMatches = [...rawLine.matchAll(/\[([^\]\s]+)\]/g)]
      .map((match) => match[1])
      .filter(isChordCandidate);
    bracketMatches.forEach(pushChord);
    if (bracketMatches.length) continue;

    const tokens = rawLine
      .split(/\s+/)
      .map(stripOuterChordPunctuation)
      .filter(Boolean);

    if (!tokens.length) continue;

    const chordTokens = tokens.filter(isChordCandidate);
    const chordRatio = chordTokens.length / tokens.length;
    const hasSectionCue = /^(intro|tom|verso|refr[aã]o|ponte|solo|final)\b/i.test(rawLine.trim());
    const looksLikeChordLine =
      chordTokens.length >= 2 && chordRatio >= 0.45
      || chordTokens.length >= 1 && tokens.length <= 3 && chordRatio >= 0.5
      || hasSectionCue && chordTokens.length >= 1;

    if (looksLikeChordLine) chordTokens.forEach(pushChord);
  }

  return results;
}

function parseRoot(value) {
  const match = normalizeSymbol(value).match(/^([A-Ga-g])([#b]?)/);
  if (!match) return null;

  const letter = match[1].toUpperCase();
  const accidental = normalizeAccidental(match[2] || "");
  return {
    name: `${letter}${accidental}`,
    letter,
    accidental,
    semitone: mod(NOTE_VALUES[letter] + (accidental === "#" ? 1 : accidental === "b" ? -1 : 0)),
    length: match[0].length,
  };
}

function tone(degree, semitones) {
  const meta = DEGREE_META[degree];
  return {
    degree,
    semitones,
    letterSteps: meta.letterSteps,
    group: meta.group,
    color: TONE_COLORS[meta.group],
  };
}

function removeToneGroup(tones, group) {
  return tones.filter((item) => item.group !== group);
}

function upsertTone(tones, nextTone, replaceNaturalGroup = true) {
  const withoutSameDegree = tones.filter((item) => item.degree !== nextTone.degree);
  const cleaned = replaceNaturalGroup ? removeToneGroup(withoutSameDegree, nextTone.group) : withoutSameDegree;
  return [...cleaned, nextTone].sort((a, b) => a.semitones - b.semitones || a.degree.localeCompare(b.degree));
}

function addToneIfMissing(tones, nextTone) {
  if (tones.some((item) => item.degree === nextTone.degree && item.semitones === nextTone.semitones)) {
    return tones;
  }
  return [...tones, nextTone].sort((a, b) => a.semitones - b.semitones || a.degree.localeCompare(b.degree));
}

function getQualityLabel({ compact, lower, isMinor, isMajorSeventh, isDim, isAug, isSus2, isSus4, extension }) {
  if (lower.includes("alt")) return "dominante alterado";
  if (lower.includes("m7b5") || lower.includes("ø")) return "meio diminuto";
  if (isDim && lower.includes("7")) return "diminuto com sétima diminuta";
  if (isDim) return "diminuto";
  if (isAug) return "aumentado";
  if (isSus2) return "suspenso 2";
  if (isSus4) return "suspenso 4";
  if (isMinor && isMajorSeventh) return "menor com sétima maior";
  if (isMinor && extension) return `menor com ${extension}`;
  if (isMinor) return "menor";
  if (isMajorSeventh && extension) return `maior com ${extension}`;
  if (isMajorSeventh) return "maior com sétima maior";
  if (compact === "5") return "power chord";
  if (extension) return `dominante com ${extension}`;
  return "maior";
}

function detectExtension(plainLower) {
  if (plainLower.includes("13")) return { number: 13, label: "décima terceira" };
  if (plainLower.includes("11")) return { number: 11, label: "décima primeira" };
  if (plainLower.includes("9") && !plainLower.includes("add9") && !plainLower.includes("69") && !plainLower.includes("6/9")) {
    return { number: 9, label: "nona" };
  }
  if (plainLower.includes("7")) return { number: 7, label: "sétima" };
  return null;
}

function detectAdditions(lower) {
  const additions = [];
  const addMatches = lower.matchAll(/add(2|4|6|9|11|13)/g);
  for (const match of addMatches) additions.push(match[1]);
  return additions;
}

function buildTones(suffix) {
  const compact = normalizeSymbol(suffix).replace(/\s+/g, "").replace(/[()]/g, "");
  const lower = compact.toLowerCase();
  const plainLower = lower.replace(/[#b](5|9|11|13)/g, "");

  const isExplicitMajor = /^maj/i.test(compact) || /^M/.test(compact);
  const isMinor = /^m(?!aj)/.test(compact) || /^min/i.test(compact) || compact.startsWith("-");
  const isDim = lower.includes("dim") || lower.includes("°") || lower.includes("ø") || lower.includes("m7b5");
  const isHalfDim = lower.includes("m7b5") || lower.includes("ø");
  const isAug = lower.includes("aug") || lower.includes("+");
  const isSus2 = lower.includes("sus2");
  const isSus4 = lower.includes("sus4") || (lower.includes("sus") && !isSus2);
  const isAlt = lower.includes("alt");
  const isSix = /(^|[^1])6(\/?9)?/.test(plainLower) || lower.includes("69");
  const isSixNine = lower.includes("6/9") || lower.includes("69");
  const isMajorSeventh = isExplicitMajor || lower.includes("maj7") || lower.includes("maj9") || lower.includes("maj11") || lower.includes("maj13");
  const isMinorMajor = /^m(maj|M)/.test(compact) || lower.includes("mmaj");
  const extension = detectExtension(plainLower);

  let tones;
  if (isAlt) {
    tones = [tone("1", 0), tone("3", 4), tone("b7", 10), tone("b9", 13), tone("#9", 15), tone("#11", 18), tone("b13", 20)];
    return {
      compact,
      tones,
      qualityLabel: "dominante alterado",
    };
  }

  if (compact === "5") {
    tones = [tone("1", 0), tone("5", 7)];
  } else if (isSus2) {
    tones = [tone("1", 0), tone("2", 2), tone("5", 7)];
  } else if (isSus4) {
    tones = [tone("1", 0), tone("4", 5), tone("5", 7)];
  } else if (isHalfDim || isDim) {
    tones = [tone("1", 0), tone("b3", 3), tone("b5", 6)];
  } else if (isAug) {
    tones = [tone("1", 0), tone("3", 4), tone("#5", 8)];
  } else if (isMinor) {
    tones = [tone("1", 0), tone("b3", 3), tone("5", 7)];
  } else {
    tones = [tone("1", 0), tone("3", 4), tone("5", 7)];
  }

  if (extension) {
    if (isDim && !isHalfDim && extension.number === 7) {
      tones = addToneIfMissing(tones, tone("bb7", 9));
    } else if (isMajorSeventh || isMinorMajor) {
      tones = addToneIfMissing(tones, tone("7", 11));
    } else {
      tones = addToneIfMissing(tones, tone("b7", 10));
    }

    if (extension.number >= 9) tones = addToneIfMissing(tones, tone("9", 14));
    if (extension.number >= 11) tones = addToneIfMissing(tones, tone("11", 17));
    if (extension.number >= 13) tones = addToneIfMissing(tones, tone("13", 21));
  }

  if (isSix && !extension) {
    tones = addToneIfMissing(tones, tone("6", 9));
    if (isSixNine) tones = addToneIfMissing(tones, tone("9", 14));
  }

  for (const addition of detectAdditions(lower)) {
    if (addition === "2") tones = addToneIfMissing(tones, tone("2", 2));
    if (addition === "4") tones = addToneIfMissing(tones, tone("4", 5));
    if (addition === "6") tones = addToneIfMissing(tones, tone("6", 9));
    if (addition === "9") tones = addToneIfMissing(tones, tone("9", 14));
    if (addition === "11") tones = addToneIfMissing(tones, tone("11", 17));
    if (addition === "13") tones = addToneIfMissing(tones, tone("13", 21));
  }

  const alterationMatches = lower.matchAll(/([#b])(5|9|11|13)/g);
  for (const match of alterationMatches) {
    const alteration = `${match[1]}${match[2]}`;
    if (alteration === "b5") tones = upsertTone(tones, tone("b5", 6));
    if (alteration === "#5") tones = upsertTone(tones, tone("#5", 8));
    if (alteration === "b9") tones = upsertTone(tones, tone("b9", 13));
    if (alteration === "#9") tones = upsertTone(tones, tone("#9", 15));
    if (alteration === "#11") tones = upsertTone(tones, tone("#11", 18));
    if (alteration === "b13") tones = upsertTone(tones, tone("b13", 20));
  }

  return {
    compact,
    tones,
    qualityLabel: getQualityLabel({
      compact,
      lower,
      isMinor,
      isMajorSeventh,
      isDim,
      isAug,
      isSus2,
      isSus4,
      extension: extension?.label,
    }),
  };
}

function accidentalFromDelta(delta) {
  if (delta === -2) return "bb";
  if (delta === -1) return "b";
  if (delta === 0) return "";
  if (delta === 1) return "#";
  if (delta === 2) return "##";
  return delta > 0 ? "#".repeat(delta) : "b".repeat(Math.abs(delta));
}

export function spellTone(root, item) {
  const rootLetterIndex = LETTERS.indexOf(root.letter);
  const targetLetter = LETTERS[(rootLetterIndex + item.letterSteps) % LETTERS.length];
  const targetSemitone = mod(root.semitone + item.semitones);
  const naturalSemitone = NOTE_VALUES[targetLetter];
  let delta = targetSemitone - naturalSemitone;

  while (delta > 6) delta -= 12;
  while (delta < -6) delta += 12;

  return `${targetLetter}${accidentalFromDelta(delta)}`;
}

export function parseChordSymbol(symbol) {
  const original = symbol.trim();
  const normalized = normalizeSymbol(original);
  if (!normalized) {
    return { ok: false, original, error: "Digite uma cifra." };
  }

  const slashMatch = normalized.match(/\/([A-Ga-g][#b]?)$/);
  const slashBassText = slashMatch ? slashMatch[1] : "";
  const body = slashMatch ? normalized.slice(0, -slashMatch[0].length) : normalized;
  const root = parseRoot(body);

  if (!root) {
    return { ok: false, original, error: "A cifra precisa começar com uma nota entre A e G." };
  }

  const suffix = body.slice(root.length);
  const slashBass = slashBassText ? parseRoot(slashBassText) : null;
  const built = buildTones(suffix);
  const tones = built.tones.map((item) => ({
    ...item,
    note: spellTone(root, item),
    pitchClass: mod(root.semitone + item.semitones),
  }));

  return {
    ok: true,
    original,
    symbol: `${root.name}${built.compact}${slashBass ? `/${slashBass.name}` : ""}`,
    root,
    suffix: built.compact,
    slashBass,
    qualityLabel: built.qualityLabel,
    tones,
    formula: tones.map((item) => item.degree).join(" "),
    notes: tones.map((item) => item.note),
  };
}

export function parseProgression(input) {
  const tokens = splitProgression(input);
  if (!tokens.length) return [];
  return tokens.map(parseChordSymbol);
}

function baseRootMidi(root) {
  return 48 + root.semitone;
}

export function buildVoicing(chord, inversionIndex = 0) {
  if (!chord?.ok) return null;

  const basePitches = chord.tones
    .map((item) => ({
      midi: baseRootMidi(chord.root) + item.semitones,
      tone: item,
      role: "tone",
    }))
    .sort((a, b) => a.midi - b.midi);

  const normalizedInversion = mod(inversionIndex, basePitches.length || 1);
  const rotated = basePitches
    .map((item, index) => ({
      ...item,
      midi: index < normalizedInversion ? item.midi + 12 : item.midi,
    }))
    .sort((a, b) => a.midi - b.midi);

  if (chord.slashBass) {
    let bassMidi = baseRootMidi(chord.slashBass);
    while (bassMidi >= rotated[0].midi) bassMidi -= 12;
    rotated.unshift({
      midi: bassMidi,
      tone: {
        degree: "baixo",
        note: chord.slashBass.name,
        pitchClass: chord.slashBass.semitone,
        color: "#0f172a",
        group: "bass",
      },
      role: "bass",
    });
  }

  return {
    inversionIndex: normalizedInversion,
    label: normalizedInversion === 0 ? "Fundamental" : `${normalizedInversion}ª inversão`,
    pitches: rotated,
    midiList: rotated.map((item) => item.midi),
  };
}

export function noteNameFromMidi(midi, preferFlats = false) {
  const names = preferFlats ? FLAT_NAMES : SHARP_NAMES;
  return names[mod(midi)];
}

export function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function isBlackKey(midi) {
  return [1, 3, 6, 8, 10].includes(mod(midi));
}

export function nearestCAtOrBelow(midi) {
  let value = midi;
  while (mod(value) !== 0) value -= 1;
  return value;
}

export function nearestBAtOrAbove(midi) {
  let value = midi;
  while (mod(value) !== 11) value += 1;
  return value;
}
