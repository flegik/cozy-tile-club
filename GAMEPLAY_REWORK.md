# Puzzle-Rework 0.2 – Kalibrierung und Nachweise

## Ursache des bisherigen Problems

Bei maximal drei Motiven liegen nach automatischen Dreiermatches höchstens sechs Kacheln in der Leiste. Eine Niederlage bei sieben Plätzen war deshalb in den frühen Leveln mathematisch unmöglich. Der alte Generator legte Dreiergruppen entlang eines vorher gewählten Lösungswegs aus. Seine geometrische Heuristik und reine Lösbarkeitstests erkannten triviale Entscheidungen nicht. Zusätzlich war Cozy automatisch aktiv.

## Neues Verfahren

Geometrie und Motive entstehen unabhängig vom Solver: sieben Grundmasken, pro Seed variable Belegung, versetzte Ebenen und zufällig gemischte Motivmengen in vollständigen Dreiermengen. Es gibt keinen vorgegebenen Spielweg und keine nachträgliche Motivverteilung entlang einer Lösung. Der unabhängige Solver muss einen kompletten Weg beweisen; unbekannte oder unlösbare Kandidaten dürfen nicht in das Paket.

Anschließend wählt eine Kuratierung anhand messbarer Strategieraten aus. Umfang und Form allein geben keine Schwierigkeit vor. 203 Kandidaten wurden untersucht: 168 in der Vorprüfung und fünf nach den vollen Simulationen verworfen; 30 übernommen. In dieser Kuratierung scheiterte kein Kandidat am 60.000-Knoten-Solverbudget. Die Ablehnung unbewiesener Kandidaten bleibt dennoch zwingend.

## Simulationsprotokoll

Pro Level und Strategie 1.000 Durchläufe, insgesamt 90.000 Kalibrierungsdurchläufe. Zusätzlich 90.000 Durchläufe mit einem unabhängigen Zufallsstrom (Holdout). Kalibrierungsseed: 3224248358. Validierungsseed: 1369956866. Der Trialseed entsteht deterministisch aus Basis-Seed und Trialindex. Jede Partie startet leer, hat exakt sieben Plätze, keine Hilfen, kein Cozy, keine Neustarts und kein Undo.

- **Zufall:** gleichverteilte Wahl unter allen freien Kacheln.
- **Greedy:** bevorzugt Motive, von denen am meisten in der Leiste liegen; bei Gleichstand zufällig. Sofortige Matches haben Vorrang.
- **Vorausschau:** Drei-Züge-Vorschau, Beam-Breite vier; bewertet Leistenfüllung, verfügbare Ergänzungen und momentan nicht erreichbare angefangene Motive. Keine Solveraufrufe, keine Zertifikate, kein Zurückspringen.
- **Solver:** ein vollständiger unabhängiger Suchnachweis pro Startzustand. Er ist deterministisch, deshalb werden identische Solveraufrufe nicht künstlich als 1.000 Versuche gezählt. Alle 30 Zertifikate werden mit der echten Spiel-Engine nachgespielt.

Die Vorschau verwendet dieselbe vollständige Motivinformation, die im Spiel in der standardmäßig geöffneten Planungsansicht verfügbar ist. Jeder verbliebene Stein ist dort mit ID, Motiv, Ebene und Position sichtbar. Der Plan ist kostenlos und kann eingeklappt werden; keine unbekannten Motive müssen geraten werden. Er wählt keine Züge automatisch.

## Akzeptanz und Progression

Alle veröffentlichten Level haben fünf bis acht verschiedene Motive, mindestens zwei Ebenen, mehrere Anfangsentscheidungen, echte Blockierungen und einen legalen Verlustweg. Keine Greedy-Quote darf 85 % erreichen. Die Drei-Züge-Strategie muss Greedy um mindestens acht Prozentpunkte übertreffen. Zufall muss unter 40 % bleiben; dies allein genügt ausdrücklich nicht.

Der Index ist `100 × (1 − 0,6 × Greedyquote − 0,4 × Vorschauquote)`. Er ist eine nachvollziehbare Bot-Messung, keine gemessene menschliche Schwierigkeit. Akzeptanzbänder: Level 1–5: 15–33; 6–15: 36–50; 16–25: 54–67; 26–30: 72–90. Für die letzten fünf darf die Drei-Züge-Vorschau höchstens 68 % gewinnen: kurze Planung reicht dort nicht zuverlässig.

| Level | Motive | Kacheln | Ebenen | Anfangsblockierungen | Zufall | Greedy | 3-Züge | Solver | Index | Holdout Greedy / 3-Züge |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 5 | 24 | 2 | 13 | 7.4 % | 73.9 % | 100.0 % | bewiesen | 15.66 | 76.7 % / 100.0 % |
| 2 | 5 | 24 | 2 | 13 | 7.0 % | 69.8 % | 100.0 % | bewiesen | 18.12 | 64.3 % / 100.0 % |
| 3 | 5 | 24 | 2 | 12 | 5.0 % | 69.5 % | 100.0 % | bewiesen | 18.30 | 68.9 % / 100.0 % |
| 4 | 5 | 24 | 2 | 12 | 9.8 % | 68.0 % | 100.0 % | bewiesen | 19.20 | 67.8 % / 100.0 % |
| 5 | 5 | 24 | 2 | 12 | 4.6 % | 64.8 % | 100.0 % | bewiesen | 21.12 | 64.9 % / 100.0 % |
| 6 | 6 | 30 | 3 | 21 | 0.4 % | 34.6 % | 100.0 % | bewiesen | 39.24 | 34.9 % / 100.0 % |
| 7 | 6 | 30 | 3 | 20 | 0.0 % | 34.6 % | 100.0 % | bewiesen | 39.24 | 32.1 % / 100.0 % |
| 8 | 6 | 30 | 3 | 22 | 0.4 % | 32.7 % | 100.0 % | bewiesen | 40.38 | 31.9 % / 100.0 % |
| 9 | 6 | 30 | 3 | 22 | 0.0 % | 26.8 % | 100.0 % | bewiesen | 43.92 | 27.2 % / 100.0 % |
| 10 | 6 | 30 | 3 | 21 | 0.0 % | 25.2 % | 100.0 % | bewiesen | 44.88 | 24.5 % / 100.0 % |
| 11 | 6 | 30 | 3 | 20 | 0.1 % | 23.4 % | 100.0 % | bewiesen | 45.96 | 23.4 % / 99.9 % |
| 12 | 6 | 30 | 3 | 22 | 0.1 % | 21.0 % | 100.0 % | bewiesen | 47.40 | 20.5 % / 100.0 % |
| 13 | 6 | 30 | 3 | 20 | 0.0 % | 19.7 % | 100.0 % | bewiesen | 48.18 | 21.6 % / 100.0 % |
| 14 | 6 | 30 | 3 | 22 | 0.0 % | 18.5 % | 100.0 % | bewiesen | 48.90 | 18.1 % / 100.0 % |
| 15 | 6 | 30 | 3 | 20 | 0.1 % | 16.9 % | 100.0 % | bewiesen | 49.86 | 15.1 % / 100.0 % |
| 16 | 7 | 33 | 3 | 22 | 0.0 % | 7.9 % | 100.0 % | bewiesen | 55.26 | 9.0 % / 100.0 % |
| 17 | 7 | 33 | 4 | 26 | 0.0 % | 7.4 % | 100.0 % | bewiesen | 55.56 | 8.5 % / 100.0 % |
| 18 | 7 | 33 | 3 | 22 | 0.0 % | 6.7 % | 100.0 % | bewiesen | 55.98 | 7.3 % / 100.0 % |
| 19 | 7 | 33 | 4 | 25 | 0.0 % | 7.1 % | 97.8 % | bewiesen | 56.62 | 6.4 % / 96.9 % |
| 20 | 7 | 33 | 4 | 25 | 0.0 % | 8.9 % | 94.7 % | bewiesen | 56.78 | 7.3 % / 94.7 % |
| 21 | 7 | 33 | 3 | 22 | 0.0 % | 4.3 % | 98.2 % | bewiesen | 58.14 | 5.6 % / 98.1 % |
| 22 | 7 | 33 | 3 | 22 | 0.0 % | 2.8 % | 100.0 % | bewiesen | 58.32 | 2.4 % / 100.0 % |
| 23 | 7 | 33 | 4 | 25 | 0.0 % | 1.8 % | 95.7 % | bewiesen | 60.64 | 1.4 % / 96.3 % |
| 24 | 7 | 33 | 3 | 22 | 0.0 % | 9.0 % | 84.2 % | bewiesen | 60.92 | 10.4 % / 81.9 % |
| 25 | 7 | 33 | 4 | 24 | 0.0 % | 4.7 % | 84.0 % | bewiesen | 63.58 | 4.2 % / 84.5 % |
| 26 | 8 | 36 | 4 | 28 | 0.0 % | 0.4 % | 52.1 % | bewiesen | 78.92 | 0.6 % / 54.9 % |
| 27 | 8 | 36 | 4 | 30 | 0.0 % | 0.4 % | 48.2 % | bewiesen | 80.48 | 0.2 % / 45.7 % |
| 28 | 8 | 36 | 4 | 25 | 0.0 % | 0.0 % | 42.4 % | bewiesen | 83.04 | 0.0 % / 40.3 % |
| 29 | 8 | 36 | 4 | 29 | 0.0 % | 0.0 % | 38.1 % | bewiesen | 84.76 | 0.0 % / 37.5 % |
| 30 | 8 | 36 | 4 | 29 | 0.0 % | 0.0 % | 27.8 % | bewiesen | 88.88 | 0.0 % / 29.0 % |

## Beispiel Level 1

Seed 389813, fünf Motive, 24 Kacheln, zwei Ebenen. Zufall gewinnt 7,4 %, Greedy 73,9 %, Drei-Züge-Planung 100 %. Das ist ein Einstieg mit echten Konsequenzen, aber einer erreichbaren logischen Lösung.

Gewinnweg (Kachel-IDs wie im Spiel, beginnend bei 1): 15, 20, 22, 16, 4, 9, 17, 18, 21, 19, 11, 23, 8, 14, 24, 6, 2, 3, 1, 5, 12, 7, 10, 13.

Verlustweg: 4, 17, 1, 16, 22, 15, 12, 19, 24, 5. Nach diesen legalen Zügen sind tatsächlich sieben nicht matchende Kacheln in der Leiste. Tests spielen beide Wege über die Engine und zusätzlich die Verlustfolge über die React-Oberfläche.

## Spielstände und Hilfen

Speicherversion 2 / Paket 2 nutzt weiterhin denselben lokalen Speicherschlüssel. Möbel, Besitz, Herzen, Tapete, Boden und bisheriger Kartenfortschritt bleiben erhalten. Ein laufender Versuch aus Paket 1 wird beendet, weil die Kachelidentitäten ersetzt wurden. Cozy wird bei dieser Migration deaktiviert und bleibt für neue Spiele standardmäßig aus. Eine ausdrückliche neue Aktivierung bleibt in Version 2 gespeichert.

In den Einstellungen kann die Kampagne freiwillig ab Level 1 neu begonnen werden. Eine separate Liste bereits ausgezahlter Belohnungen verhindert zusätzliche Herzen durch wiederholten Kampagnenneustart. Die Zimmer-Engine, Möbel und Preise wurden nicht verändert.

## Qualität und Grenzen

Automatisierte Tests prüfen alle 30 Gewinn- und Verlustzertifikate, 500 zusätzliche Generatorseeds, exakte Reproduktion aller Kalibrierungsraten, Progressionsbänder, unterschiedliche Layouts, echte Blockierungen, unabhängigen Solver gegen eine exhaustive kleine Engine-Suche, Simulator-Übergänge gegen die Engine sowie Save-Migration, Economy und die Oberfläche. Die unbekannte Budgetgrenze wird niemals als Lösbarkeit ausgegeben.

180.000 Bot-Partien sind keine menschlichen Playtests. Die ausgewählten Level sind auf die dokumentierten Strategien kalibriert; die Holdout-Streams prüfen Zufallsschwankungen, keine völlig neue Spielpolitik. Schwierigkeit und Spaß müssen weiterhin auf dem Smartphone beurteilt werden. Die vollständige Planungsansicht erfordert gegebenenfalls Scrollen und räumliches Vergleichen. Realer Android-Browser, Pointer-Hit-Testing und Service-Worker-Upgrade konnten hier mangels unterstützter Browser-QA nicht geprüft werden. Undo/Hinweise bleiben ausdrücklich optional. Keine Zeitlimits oder kostenpflichtigen Hilfen im Spiel.

## Reproduktion

`npm test` prüft Regeln, alle 30 Level und die Kalibrierung. `npm run levels` kuratiert das Paket reproduzierbar neu. `npm run validate:heldout` reproduziert den separaten Validierungsstrom. Bestehende neue Paket-IDs und Seeds sollten künftig stabil bleiben; neue Inhalte anfügen oder die Paketversion mit einer Migration erhöhen.
