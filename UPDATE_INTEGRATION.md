# Update-Prompt Integration Guide

## Übersicht

Dieses System erkennt automatisch, wenn eine neue Version der Webapp deployed wurde, und zeigt dem Nutzer einen Update-Dialog an.

## Funktionsweise

1. **Version-Check**: Alle 60 Sekunden wird die aktuelle Version vom Server abgefragt
2. **Vergleich**: Die Server-Version wird mit der im Browser gespeicherten Version verglichen
3. **Update-Dialog**: Bei Unterschied wird ein Dialog angezeigt
4. **Update**: Beim Klick auf "Jetzt updaten" wird die Seite neu geladen

## Dateien

- `app/api/version/route.ts` - API-Route für Version-Check
- `hooks/useAppVersion.ts` - Custom Hook für Version-Management
- `components/update-prompt.tsx` - Update-Dialog Komponente
- `app/layout.tsx` - Integration im Root Layout

## Integration

### 1. API-Route (`/api/version`)

Die API-Route gibt die aktuelle Build-ID zurück. Diese wird bei jedem Deployment neu generiert.

**Optionen für Version-Quelle:**
- `VERCEL_GIT_COMMIT_SHA` (Vercel automatisch)
- `NEXT_BUILD_ID` (Next.js Build-ID)
- Custom `BUILD_ID` Umgebungsvariable
- Timestamp als Fallback

### 2. Hook (`useAppVersion`)

Der Hook prüft regelmäßig die Version und speichert sie im `localStorage`.

**Parameter:**
- `checkInterval`: Prüf-Intervall in Millisekunden (Standard: 60000 = 60 Sekunden)

**Rückgabe:**
- `isUpdateAvailable`: Boolean, ob Update verfügbar ist
- `performUpdate()`: Funktion zum Ausführen des Updates
- `dismissUpdate()`: Funktion zum Ignorieren des Updates

### 3. Komponente (`UpdatePrompt`)

Die Komponente zeigt den Dialog und den Update-Loader.

**Features:**
- Dialog mit "Jetzt updaten" und "Später" Buttons
- Fullscreen-Loader während des Updates
- Automatisches Schließen beim Update

### 4. Integration im Layout

Die Komponente wurde bereits in `app/layout.tsx` integriert:

```tsx
<UpdatePrompt />
```

## Vercel-Konfiguration

### Umgebungsvariablen (optional)

In Vercel können Sie folgende Umgebungsvariablen setzen:

1. **System-Variablen** (automatisch von Vercel gesetzt):
   - `VERCEL_GIT_COMMIT_SHA` - Git Commit SHA
   - `VERCEL` - Boolean, ob auf Vercel deployed

2. **Custom-Variablen** (optional):
   - `APP_VERSION` - App-Version (z.B. aus package.json)
   - `BUILD_ID` - Custom Build-ID

### Build-Konfiguration

Die `next.config.js` wurde erweitert mit:

```js
generateBuildId: async () => {
  return process.env.VERCEL_GIT_COMMIT_SHA || `build-${Date.now()}`;
}
```

Dies stellt sicher, dass bei jedem Deployment eine neue Build-ID generiert wird.

## Anpassungen

### Prüf-Intervall ändern

```tsx
// In app/layout.tsx oder einer anderen Komponente
<UpdatePrompt checkInterval={30000} /> // 30 Sekunden
```

### Design anpassen

Die Komponente `update-prompt.tsx` kann nach Bedarf angepasst werden:
- Farben (aktuell: DB-Rot `#e2001a`)
- Text-Inhalte
- Dialog-Position
- Loader-Animation

### Version-Quelle ändern

In `app/api/version/route.ts` können Sie die Version-Quelle anpassen:

```ts
// Beispiel: Nutze package.json Version
const version = require('../../package.json').version;
```

## Testing

### Lokales Testen

1. Starte die App: `npm run dev`
2. Öffne die Browser-Konsole
3. Ändere die Build-ID in `app/api/version/route.ts` manuell
4. Warte 60 Sekunden (oder reduziere das Intervall)
5. Der Update-Dialog sollte erscheinen

### Production-Testing

1. Deploye eine Version auf Vercel
2. Öffne die App im Browser
3. Deploye eine neue Version (mit Code-Änderungen)
4. Warte bis der Version-Check läuft (max. 60 Sekunden)
5. Der Update-Dialog sollte erscheinen

## Troubleshooting

### Update-Dialog erscheint nicht

- Prüfe, ob die API-Route `/api/version` funktioniert
- Prüfe die Browser-Konsole auf Fehler
- Prüfe, ob `localStorage` verfügbar ist
- Reduziere das Prüf-Intervall für schnelleres Testen

### Update funktioniert nicht

- Prüfe, ob `window.location.reload()` funktioniert
- Prüfe, ob Service Worker das Update blockiert
- Prüfe Browser-Cache-Einstellungen

### Zu viele Version-Checks

- Erhöhe das `checkInterval` (z.B. auf 120000 = 2 Minuten)
- Nutze `requestIdleCallback` für bessere Performance

## Best Practices

1. **Nicht zu häufig prüfen**: 60 Sekunden ist ein guter Kompromiss
2. **User-Experience**: Zeige den Dialog nicht während wichtiger Aktionen
3. **Persistence**: Nutze `localStorage` für Version-Speicherung
4. **Error-Handling**: Behandle API-Fehler gracefully
5. **Accessibility**: Stelle sicher, dass der Dialog zugänglich ist

## Erweiterte Features (optional)

### Service Worker Integration

Für noch bessere Update-Erkennung kann ein Service Worker verwendet werden:

```ts
// public/sw.js
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
```

### Update-Benachrichtigung

Zeige eine kleine Benachrichtigung statt eines Dialogs:

```tsx
// Toast-Notification statt Dialog
{isUpdateAvailable && (
  <Toast>
    Neue Version verfügbar
    <button onClick={performUpdate}>Update</button>
  </Toast>
)}
```

### Automatisches Update

Update automatisch im Hintergrund durchführen (nicht empfohlen für kritische Apps):

```tsx
// Automatisch updaten, wenn verfügbar
useEffect(() => {
  if (isUpdateAvailable) {
    setTimeout(() => performUpdate(), 5000); // Nach 5 Sekunden
  }
}, [isUpdateAvailable]);
```

