# Modes 0.4 — getrennte Kampagnen und begrenzte Hilfen

## Dark als Standard

Neuinstallation und fehlende/ungültige bewusste Theme-Auswahl starten in Midnight Mauve. Der Standard hängt nicht vom Betriebssystem ab; auch Start-CSS, Installationsmanifest und Browser-Themefarbe sind dunkel. Hell bleibt über Einstellungen → Design auswählbar. Eine neue Auswahl wird mit `themeChosen: true` gespeichert.

Version 2 hatte keine Markierung, ob das gespeicherte Theme bewusst gewählt oder automatisch voreingestellt war. Ein gültiger alter Theme-Wert wird deshalb konservativ als persönliche Auswahl erhalten. Fehlt er, wird Dark verwendet. Ein altes automatisch gespeichertes Hell lässt sich nicht zuverlässig von einer expliziten Hell-Auswahl unterscheiden.

## Hilfen pro Versuch

Zentrale Konfiguration: `src/game/config.ts`, `HELP_LIMITS = { undo: 3, hint: 1 }`.

- Nur eine tatsächliche Rücknahme mit vorhandener Historie verbraucht einen Undo-Punkt.
- Ein Hinweis wird nur bei einer vollständigen, legalen Gewinnfortsetzung abgebucht. Das Solverergebnis wird vor der Abbuchung zusätzlich mit der Puzzle-Engine nachgespielt.
- Budgetgrenze, unlösbare Position, Fehler, Zeitüberschreitung, ungültige Fortsetzung und verspätete Antworten verbrauchen keinen Hinweis.
- Die automatische Cozy-Prüfung verbraucht ebenfalls keinen Hinweis.
- Beide Buttons zeigen Restmengen und deaktivieren sich nach Verbrauch; der Verlustdialog berücksichtigt dieselbe Undo-Grenze.
- Historie, Restmengen und der bereits bezahlte markierte Hinweis werden mit dem Versuch gespeichert.
- Verlassen, Fortsetzen, Kartenwahl desselben laufenden Levels, Neuladen und Moduswechsel füllen nichts auf. Auch ein verlorener Versuch wird mit seinen verbrauchten Hilfen fortgesetzt.
- Nur ein vollständiger Neustart des Levels erzeugt einen leeren Versuch mit frischen Kontingenten. Ein anderes ausgewähltes Level beginnt ebenfalls einen neuen Versuch. Pro Kampagne wird ein laufender Versuch gehalten, nicht ein separater Versuch für jedes Level.

## Unabhängige Modi

Normal: keine automatische Prüfung. Cozy: warnt vor nachgewiesenen Sackgassen; ein gefährlicher Zug kann ausdrücklich trotzdem ausgeführt werden. Ungeklärte Solverprüfungen werden nicht als sicher oder nachgewiesen unlösbar ausgegeben.

Die Mode-Auswahl liegt in Levelauswahl und Einstellungen. Beide Segmente zeigen ihren eigenen Fortschritt; Hauptmenü und Puzzle zeigen den aktiven Modus. Umschalten setzt keine Kampagne zurück. Laufende Workeranfragen werden abgebrochen und alte Antworten ignoriert.

Speicherschema 3:

```text
Gemeinsam: hearts, owned, placed, wall, floor, sound, theme, themeChosen
Auswahl: mode = normal | cozy
campaigns.normal / campaigns.cozy:
  completed, rewarded, active
active:
  level, state (removed/tray/status), history, help (undo/hint), hinted
```

Freigeschaltete Level und das nächste Level werden aus den abgeschlossenen Leveln abgeleitet. Die gemeinsame Shop-Freischaltung verwendet den weiter fortgeschrittenen der beiden Modi, damit ein Wechsel Einkäufe nicht wieder sperrt.

Herzen werden pro Kombination **Modus + Level** einmal vergeben: Normal 1 und Cozy 1 können jeweils 30 Herzen zahlen. Wiederholung und freiwilliger Kampagnenneustart vergeben für denselben Modus keine erneute Belohnung. Zimmer, Inventar, Preise, Platzierung und Leveldaten wurden nicht verändert. Ein freiwilliger Kampagnenneustart betrifft nur den ausgewählten Modus.

## Migration

Der originale lokale Schlüssel `cozy-tile-club-v1` bleibt bestehen. Versionen 1 und 2 werden nach Schema 3 migriert:

- Bisherige abgeschlossene Level, bisherige Belohnungsmarkierungen und kompatible laufende Puzzle werden Normal zugeordnet, auch wenn früher der Cozy-Hilfeschalter aktiv war.
- Cozy startet leer bei Level 1; der neue ausgewählte Modus ist Normal.
- Herzen, Inventar, gültige Platzierungen, Tapeten/Böden, Sound und gespeicherte Theme-Präferenz bleiben erhalten.
- Laufende Version-2-Puzzle mit Paket 2 werden durch Nachspielen aller Züge und Prüfen der Historie validiert und fortgesetzt.
- Legacy-Versuche hatten keine Hilfekontingente. Sie erhalten bei der einmaligen Migration 3 Undo / 1 Hinweis; anschließend sind die Restwerte verbindlich gespeichert.
- Ein aktiver Versuch aus dem alten Paket 1 kann nicht über die inzwischen ersetzten Kachel-IDs fortgesetzt werden. Nur dieser Versuch wird verworfen, nicht Kampagnenfortschritt oder Zimmer/Economy.
- Ungültige Hilfemengen werden begrenzt bzw. auf null gesetzt, ohne ein ansonsten gültiges Puzzle zu verlieren. Historienprüfung ist unabhängig von der Reihenfolge der JSON-Objektschlüssel.

## Prüfung

`npm run check`: **50 Tests**, TypeScript und Production Build erfolgreich.

Automatisiert geprüft wurden unter anderem:

- Normal sechs Level wirklich gewinnen, Level 7 starten, dort Hilfe nutzen; Cozy von Level 1 bis zum laufenden Level 4 spielen; mehrfach zurückwechseln und exakt dieselben Zustände/Restmengen wiederfinden.
- Dasselbe Szenario zusätzlich über die React-Oberfläche, inklusive Level-Sperren, Modus-Segmenten und gemeinsamer Währung/Einrichtung.
- Einmalige Belohnung pro Modus/Level und kein erneutes Auszahlen nach Kampagnenneustart.
- Hilfeverbrauch, Verlust-Undo, Persistenz, expliziter Neustart, Solverfehler/Budget/Timeout, ungültige und verspätete Antworten.
- Versionsmigration, Dark-Standard, explizite Hell-Auswahl, Room-/Shop-/Theme-Regressionsprüfungen.
- Alle unveränderten 30 Gewinn-/Verlustzertifikate, 500 zusätzliche Seeds und exakt dieselben 180.000 Strategiesimulationen.

## Grenzen

Die Unterstützung für Browser-QA war in dieser Umgebung nicht verfügbar. Die Oberfläche wurde in jsdom geprüft; echter Android-Browser, PWA-Update, native Installation und reale Pointer-Hit-Tests bleiben für den Smartphone-Test. Das Speichern erfolgt lokal pro Browser; Export/Import enthält beide Kampagnen. Es gibt keine geräteübergreifende Synchronisation. Die bewusste Theme-Wahl und früher verbrauchte Hilfen lassen sich für Version 2 rückwirkend nicht vollständig rekonstruieren; die beschriebenen konservativen Migrationsregeln gelten.
