---
name: Training Plans Data
description: Hans's 5 training plans with muscle group slots and current exercise weights for seeding
type: project
---

## 5 Training Plans

Exercise IDs reference `openspec/seed/exercise-library.json`. Weight notation: `single(reps)`, `bilateral perSide(reps)`, `stacked base+added(reps)`. Negative = assisted (e.g. -12.5).

---

### Oberkörper A

| Slot (MuscleGroup) | Exercise | Weight | Reps |
|---|---|---|---|
| Hintere Schulter | Reverse Flys KH | single 40 | 10 |
| Rücken Breite | Klimmzug | single -12.5 | 9–10 |
| Schultern | Schulterdrücken KH | bilateral 14 | 11–12 |
| Schulterrotation | Schulterrotation KH | bilateral 6 | 11 |
| Bizeps | Bizeps KH | bilateral 12 | 9–10 |
| Trapez | Seitheben KH *(= schulterheben)* | bilateral 6 | 10 |
| Trizeps | Trizeps Seilzug rückwärts | stacked 21.25+2.5 | 12 |
| Rücken Breite *(Evtl)* | Überzüge Seilzug stehend | — | — |
| Trapez *(Evtl)* | Schulterzucken KH | bilateral 22 | 12 (langsam runter) |

---

### Oberkörper B

| Slot (MuscleGroup) | Exercise options | Weight | Reps |
|---|---|---|---|
| Hintere Schulter | Reverse Flys Kabelzug / Reverse Flys KH Schrägbank / Facepulls | stacked 5+1.25 / — / single 25 | 10 / — / 10–11 |
| Trizeps | Dipps / Trizeps Seilzug Stange | single -4.5 / single 28.75 | 10 / 9–10 |
| Schultern | Seitheben Seilzug / Seitheben Maschine | stacked 2.5+1 / stacked 32+2.5 | 10 / 10 |
| Rücken Dicke | Rudern Seilzug / Rudern MTS / Rudern LH / Rudern T-Bar / Row Maschine | single 50 / bilateral 30 / bilateral 22 / stacked 0+30 / single 67.5 | 10 |
| Schultern | Schulterdrücken LH / Schulterdrücken Maschine | bilateral 10 / single 30 | 10 / 9–10 |
| Rücken Breite | Überzüge Seilzug stehend / Latzug / Negativer Klimmzug / Iso-Lat Maschine | single 28.75 / single 30 / — / — | 10 / 11 |
| Bizeps | Bizeps Seilzug Seil / Bizeps Seilzug Stange / Bizeps MTS | stacked 21.25+1.25 / — / single 15 | 9–10 / — / 11 |

---

### Core

| Slot (MuscleGroup) | Exercise | Weight | Reps | Note |
|---|---|---|---|---|
| Bauch | Oblique Crunch | bilateral 12.5 | 4×11 | 36s Pause, alternierend L/R |
| Gesäß | Glute Drive | single 35 | 14 | |
| Bauch | Bauch Seite KH / Bauch Seite Seilzug | single +8 / single 30 | 10 / 14 | |
| Bauch | Ausrollen | — | — | |
| Unterer Rücken | Hyperextension | single +8 (überkopf) | — | |
| Bauch | Torso Rotation | stacked 31.5+2.3 | 10–11 | |
| Unterer Rücken | Rückenstrecker Maschine / Kreuzheben | stacked 67.5+2.3 / — | 12 | |
| Oberschenkel Rückseite *(Evtl)* | Leg Curl liegend | — | — | |
| Oberschenkel Vorderseite *(Evtl)* | Kniebeugen LH | — | — | |

---

### Beine & Po

| Slot (MuscleGroup) | Exercise options | Weight | Reps |
|---|---|---|---|
| Unterer Rücken / Gesäß | Hyperextension | single +9 | 10–11 |
| Oberschenkel Vorderseite | Kniebeugen LH / Kniebeugen Maschine mit Scheiben / Kniebeugen Maschine | bilateral 24 (+48) / single 97.5 / stacked 112.5+2.3 | 12–13 / 12 / 14 |
| Unterer Rücken | Kreuzheben | bilateral 30 (+60) | 12 |
| Waden | Unterschenkel Maschine mit Scheiben / Unterschenkel Maschine | single 85 / single 85.5 | 14 / 10 |
| Gesäß | Glute Drive | single 35 | — |
| Oberschenkel Vorderseite *(Evtl)* | Ausfallschritt KH / Einbeinig Rolle / Auf Kasten steigen einbeinig / Schlitten schieben | bilateral 12 / — / — / stacked 0+87.5 | bis 14 / 2×12 / — / 4 |
| Beine Außen | Bein Abduktor | stacked 31.5+6.8 | 10–11 |
| Beine Innen *(Evtl)* | Adduktor | stacked 40.5+4.5 | 2×12 |
| Oberschenkel Rückseite | Leg Curl liegend / Leg Curl sitzend / Leg Curl kniend | stacked 32+2.5 / stacked 31.5+5 / single 15 | 11–12 / — / 11 |

---

### Core+Beine

Kürzere Kombination aus Core und Beine. Reihenfolge:

| Slot | Exercise |
|---|---|
| Bauch | Oblique Crunch oder Ausrollen |
| Oberschenkel Vorderseite | Kniebeugen |
| Bauch | Bauch Seite oder Torso Rotation |
| Gesäß / Unterer Rücken | Glute Drive oder Hyperextension |
| Beine Außen *(/ Innen)* | Bein Abduktor (/ Adduktor) |
| Bauch oder Oberschenkel Vorderseite *(Evtl)* | — |
| Oberschenkel Rückseite | Leg Curl |

---

## Rep Range Representation

`9–10` means Hans achieves ~9.5 reps on average (makes 9, not reliably 10). Store as `{ min: 9, max: 10 }`.
