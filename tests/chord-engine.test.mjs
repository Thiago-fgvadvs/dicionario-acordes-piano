import test from "node:test";
import assert from "node:assert/strict";
import { buildVoicing, parseChordSymbol, parseProgression } from "../src/chord-engine.js";

test("parses A9 with complete dominant ninth tones", () => {
  const chord = parseChordSymbol("A9");
  assert.equal(chord.ok, true);
  assert.equal(chord.formula, "1 3 5 b7 9");
  assert.deepEqual(chord.notes, ["A", "C#", "E", "G", "B"]);
});

test("parses half diminished chord with parenthesized alteration", () => {
  const chord = parseChordSymbol("C#m7(b5)");
  assert.equal(chord.ok, true);
  assert.equal(chord.formula, "1 b3 b5 b7");
  assert.deepEqual(chord.notes, ["C#", "E", "G", "B"]);
});

test("parses sharp eleventh spelling from F dominant", () => {
  const chord = parseChordSymbol("F7(#11)");
  assert.equal(chord.ok, true);
  assert.equal(chord.formula, "1 3 5 b7 #11");
  assert.deepEqual(chord.notes, ["F", "A", "C", "Eb", "B"]);
});

test("parses progressions as separate chord symbols", () => {
  const progression = parseProgression("Am7 D9 Gmaj7");
  assert.equal(progression.length, 3);
  assert.deepEqual(
    progression.map((item) => item.symbol),
    ["Am7", "D9", "Gmaj7"],
  );
});

test("keeps slash bass below the voicing", () => {
  const chord = parseChordSymbol("C/E");
  const voicing = buildVoicing(chord, 0);
  assert.equal(voicing.pitches[0].tone.note, "E");
  assert.equal(voicing.pitches[0].role, "bass");
  assert.ok(voicing.pitches[0].midi < voicing.pitches[1].midi);
});
