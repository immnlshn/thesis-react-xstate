# Quiz-Frontend (React + Redux Toolkit + TypeScript)

Dieses Projekt ist Teil der Bachelorarbeit mit dem Titel:

**„Migration bestehender Webkomponenten zu einer zustands- und komponentenbasierten Frontend-Architektur“**

Kapitel 3.3.2 – Beispielhafte Umsetzung mit React, Redux Toolkit und TypeScript

---

## Übersicht

Diese Anwendung ist ein Quiz-Frontend, das als Beispiel für die Migration und den Aufbau moderner, zustandsbasierter Frontend-Architekturen dient. Die App nutzt React, Redux Toolkit und TypeScript und kommuniziert mit einem separaten Backend.

Das zugehörige Backend ist hier zu finden:
[https://github.com/immnlshn/thesis-api-server](https://github.com/immnlshn/thesis-api-server)

---

## Features

- Moderne React-Komponentenstruktur (funktional, Hooks)
- Globale State-Verwaltung mit Redux Toolkit
- Asynchrone Datenabfragen (Quiz starten, Antworten absenden, Ergebnis anzeigen)
- Loader- und Fehlerhandling zentral über Redux-State
- TypeScript für Typensicherheit
- Responsive und übersichtliche UI

---

## Projektstruktur

- **src/components/** – UI-Komponenten (Quiz, Loader, Question, Result, ...)
- **src/slices/** – Redux-Slices (insb. QuizSlice für State und Thunks)
- **src/models/** – TypeScript-Typen für Datenmodelle
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

