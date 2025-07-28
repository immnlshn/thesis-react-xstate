# Quiz-Frontend (React + XState + TypeScript)

Dieses Projekt ist Teil der Bachelorarbeit mit dem Titel:

**„Migration bestehender Webkomponenten zu einer zustands- und komponentenbasierten Frontend-Architektur“**

Kapitel 3.3.3 – Beispielhafte Umsetzung mit React, XState und TypeScript

---

## Übersicht

Diese Anwendung ist ein Quiz-Frontend, das als Beispiel für die Migration und den Aufbau moderner, zustandsbasierter Frontend-Architekturen dient. Die App nutzt React, XState und TypeScript und kommuniziert mit einem separaten Backend.

Das zugehörige Backend ist hier zu finden:
[https://github.com/immnlshn/thesis-api-server](https://github.com/immnlshn/thesis-api-server)

---

## Features

- Moderne React-Komponentenstruktur (funktional, Hooks)
- Statemachine mit XState für komplexe Logik
- Asynchrone Datenabfragen (Quiz starten, Antworten absenden, Ergebnis anzeigen)
- Zentrale Ladezustandsbehandlung (Fehlerbehandlung wurde aus Zeitgründen nicht implementiert)
- TypeScript für Typensicherheit
- Responsive und übersichtliche UI

---

## Projektstruktur

- **src/components/** – UI-Komponenten (Quiz, Loader, Question, Result, ...)
- **src/machines/** – XState-Statemachine für Quiz-Logik
- **src/models/** – TypeScript-Typen für Datenmodelle
- **src/types/** – Typdefinitionen für XState-Statemachine
- **src/utils/** – Hilfsfunktionen

---

## Entwicklung & Start

1. **Backend starten:**
   - Folge der Anleitung im [thesis-api-server](https://github.com/immnlshn/thesis-api-server)
2. **Frontend installieren & starten:**
   ```bash
   npm install
   npm run dev
   ```
3. Die App ist dann unter `http://localhost:5173` erreichbar (Standard Vite-Port).

---

## Hinweise

- Die Anwendung ist für Demonstrations- und Analysezwecke im Rahmen der Bachelorarbeit konzipiert.
- Fokus liegt auf klarer Trennung von Logik, State und UI.
- Fehler- und Ladezustände werden zentral und benutzerfreundlich behandelt.

