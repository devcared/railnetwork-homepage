# Update-System Troubleshooting

## Problem: Update-Dialog wird nicht angezeigt

### Mögliche Ursachen und Lösungen

#### 1. Build-ID ändert sich nicht

**Problem:** Die Build-ID wird nicht korrekt generiert oder bleibt gleich.

**Lösung:**
- Prüfe, ob `VERCEL_GIT_COMMIT_SHA` in Vercel verfügbar ist
- Prüfe die Build-Logs: `✅ Build-Info generiert: ...` sollte erscheinen
- Prüfe `lib/build-info.ts` - diese Datei sollte bei jedem Build neu generiert werden

#### 2. localStorage wird nicht aktualisiert

**Problem:** Die gespeicherte Version stimmt nicht mit der Server-Version überein.

**Lösung:**
- Öffne die Browser-Konsole (F12)
- Prüfe die Debug-Logs:
  ```
  📦 Gespeicherte Version geladen: ...
  🔄 Neue Version erkannt! ...
  ```
- Lösche den localStorage manuell:
  ```javascript
  localStorage.removeItem("app-version");
  localStorage.removeItem("app-version-timestamp");
  ```
- Lade die Seite neu

#### 3. API-Route gibt falsche Daten zurück

**Problem:** Die `/api/version` Route gibt nicht die korrekte Build-ID zurück.

**Lösung:**
- Öffne `/api/version` direkt im Browser
- Prüfe die Antwort:
  ```json
  {
    "version": "1.0.0",
    "buildId": "...",
    "buildTimestamp": "...",
    "timestamp": "..."
  }
  ```
- Prüfe, ob `buildId` sich bei jedem Deployment ändert

#### 4. Caching-Probleme

**Problem:** Browser oder Vercel cached die API-Antwort.

**Lösung:**
- Die API-Route hat bereits `Cache-Control: no-store` Header
- Prüfe im Network-Tab, ob die Antwort gecacht wird
- Hard Refresh: `Ctrl+Shift+R` (Windows) oder `Cmd+Shift+R` (Mac)

#### 5. Prüf-Intervall zu lang

**Problem:** Das Standard-Intervall von 60 Sekunden ist zu lang.

**Lösung:**
- Reduziere das Intervall in `app/layout.tsx`:
  ```tsx
  <UpdatePrompt checkInterval={30000} /> // 30 Sekunden
  ```

### Debug-Schritte

1. **Browser-Konsole öffnen** (F12)
2. **Prüfe die Logs:**
   - `📦 Gespeicherte Version geladen: ...`
   - `🔄 Neue Version erkannt! ...`
   - `🔄 Update verfügbar: ...`

3. **Prüfe localStorage:**
   ```javascript
   console.log("Version:", localStorage.getItem("app-version"));
   console.log("Timestamp:", localStorage.getItem("app-version-timestamp"));
   ```

4. **Prüfe API-Antwort:**
   ```javascript
   fetch("/api/version").then(r => r.json()).then(console.log);
   ```

5. **Manueller Version-Check:**
   ```javascript
   // In der Browser-Konsole
   localStorage.setItem("app-version", "old-version");
   // Dann sollte beim nächsten Check ein Update erkannt werden
   ```

### Vercel-spezifische Probleme

#### Build-ID wird nicht generiert

**Problem:** `VERCEL_GIT_COMMIT_SHA` ist nicht verfügbar.

**Lösung:**
- Prüfe Vercel-Umgebungsvariablen
- Nutze alternativ `VERCEL_DEPLOYMENT_ID` (wird bei jedem Deployment neu generiert)

#### Build-Info wird nicht geschrieben

**Problem:** `lib/build-info.ts` wird nicht zur Build-Zeit generiert.

**Lösung:**
- Prüfe Build-Logs auf `✅ Build-Info generiert: ...`
- Stelle sicher, dass `next.config.ts` korrekt ausgeführt wird
- Prüfe, ob die Datei im Repository vorhanden ist (sollte nicht committed werden)

### Manuelles Testen

1. **Aktuelle Version speichern:**
   ```javascript
   localStorage.setItem("app-version", "test-old-version");
   ```

2. **Neue Version simulieren:**
   - Ändere `lib/build-info.ts` manuell (nur zum Testen!)
   - Setze eine andere `BUILD_ID`

3. **Version-Check auslösen:**
   - Warte auf automatischen Check (60 Sekunden)
   - Oder rufe `checkVersion()` manuell auf

### Häufige Fehler

#### ❌ Falsch: Build-ID zur Laufzeit generieren
```typescript
// FALSCH - ändert sich bei jedem Request
const buildId = `build-${Date.now()}`;
```

#### ✅ Richtig: Build-ID zur Build-Zeit generieren
```typescript
// RICHTIG - wird nur beim Build gesetzt
const buildId = process.env.VERCEL_GIT_COMMIT_SHA || `build-${Date.now()}`;
```

### Best Practices

1. ✅ Nutze `VERCEL_GIT_COMMIT_SHA` für eindeutige Build-IDs
2. ✅ Generiere Build-Info zur Build-Zeit, nicht zur Laufzeit
3. ✅ Nutze `localStorage` für Persistenz
4. ✅ Prüfe sowohl Build-ID als auch Timestamp
5. ✅ Füge Debug-Logging hinzu für Development

### Support

Bei weiteren Problemen:
- Prüfe die Browser-Konsole auf Fehler
- Prüfe die Network-Tab auf fehlgeschlagene Requests
- Prüfe die Vercel-Build-Logs
- Prüfe die Server-Logs für API-Fehler

