# Chakra UI Migration Plan - Dashboard Redesign

## 📊 Aktuelle Dashboard-Struktur

### Hauptkomponenten
1. **Layout & Navigation**
   - `components/dashboard-layout.tsx` - Hauptlayout mit Sidebar
   - `components/dashboard-sidebar.tsx` - Kollabierbare Sidebar mit Navigation
   - `components/breadcrumbs.tsx` - Breadcrumb-Navigation

2. **UI-Komponenten (Custom)**
   - `components/sheet.tsx` - Slide-over Panels (Modal-Ersatz)
   - `components/notifications.tsx` - Benachrichtigungs-Dropdown
   - `components/theme-toggle.tsx` - Dark Mode Toggle

3. **Dashboard Views** (22 Client-Komponenten)
   - Haupt-View: `app/dashboard/dashboard-client.tsx`
   - Alerts: `alerts-client.tsx`, `alert-detail-client.tsx`
   - Projects: `projects-client.tsx`, `project-detail-client.tsx`
   - Telemetry: `telemetry-client.tsx` + 4 Sub-Views
   - Inventory: `inventory-client.tsx` + 2 Sub-Views
   - Workshop: `workshop-client.tsx` + 2 Sub-Views
   - Network: `network-client.tsx` + 2 Sub-Views
   - Reports: `reports-client.tsx`
   - Settings: `settings-client.tsx`

### Technologie-Stack (aktuell)
- **Styling**: Tailwind CSS + Custom CSS
- **Icons**: Lucide React
- **Animationen**: Framer Motion
- **Theme**: Custom Theme Context (Dark Mode)
- **Layout**: Flexbox/Grid mit Tailwind Utilities

### Design-System (aktuell)
- **Farben**: Deutsche Bahn Rot (#e2001a), Slate Grautöne
- **Schriftarten**: DBScreenHead, DBScreenSans (Custom Fonts)
- **Dark Mode**: Vollständig implementiert
- **Responsive**: Mobile-first mit Tailwind Breakpoints

---

## 🎯 Migrations-Plan

### Phase 1: Setup & Grundlagen
1. **Chakra UI Installation**
   - `@chakra-ui/react` + `@emotion/react` + `@emotion/styled`
   - `framer-motion` (bereits vorhanden, wird von Chakra genutzt)

2. **Chakra Provider Setup**
   - `ChakraProvider` in Root Layout einrichten
   - Custom Theme mit DB-Farben erstellen
   - Dark Mode Integration (Chakra `useColorMode`)

3. **Theme-Konfiguration**
   - DB-Rot als Primary Color
   - Custom Fonts (DBScreenHead, DBScreenSans) integrieren
   - Spacing, Border Radius, Shadows anpassen

### Phase 2: Core-Komponenten Migration
1. **Layout-Komponenten**
   - `DashboardLayout` → Chakra `Box`, `Flex`, `Container`
   - `DashboardSidebar` → Chakra `Box`, `VStack`, `Drawer` (Mobile)
   - Header → Chakra `Box`, `HStack`, `IconButton`

2. **Navigation**
   - Sidebar-Nav → Chakra `VStack`, `Link`, `Accordion`
   - Breadcrumbs → Chakra `Breadcrumb`, `BreadcrumbItem`
   - Active States → Chakra `useColorModeValue`

3. **UI-Komponenten**
   - `Sheet` → Chakra `Drawer` (Slide-over)
   - `Notifications` → Chakra `Popover` + `Menu`
   - Buttons → Chakra `Button`, `IconButton`
   - Cards → Chakra `Box` mit `Card`-Style

### Phase 3: Dashboard Views Migration
1. **Haupt-Dashboard** (`dashboard-client.tsx`)
   - Stats Cards → Chakra `Stat`, `StatLabel`, `StatNumber`
   - Grid Layout → Chakra `SimpleGrid`
   - Activity Feed → Chakra `VStack`, `List`
   - Charts/Metrics → Chakra `Progress`, `Box`

2. **Detail-Views** (Alerts, Projects, etc.)
   - Tables → Chakra `Table`, `Thead`, `Tbody`
   - Forms → Chakra `FormControl`, `Input`, `Textarea`
   - Filters → Chakra `Select`, `Checkbox`, `Radio`
   - Modals → Chakra `Modal`, `ModalOverlay`

3. **Sub-Views** (Telemetry, Inventory, etc.)
   - Tabs → Chakra `Tabs`, `TabList`, `TabPanels`
   - Cards → Chakra `Box` mit Card-Styling
   - Badges → Chakra `Badge`
   - Icons → Lucide Icons (beibehalten)

### Phase 4: Responsive & Polish
1. **Mobile Optimization**
   - Sidebar → `Drawer` auf Mobile
   - Header → Hamburger Menu
   - Tables → Scrollable oder Card-View

2. **Dark Mode**
   - Chakra `useColorMode` nutzen
   - Alle Farben mit `useColorModeValue` definieren
   - Theme-Switch mit Chakra `IconButton`

3. **Animationen**
   - Chakra `Fade`, `Slide`, `ScaleFade` nutzen
   - Framer Motion nur wo nötig

### Phase 5: Cleanup
1. **Alte Imports entfernen**
   - Tailwind Classes in Dashboard-Komponenten
   - Custom CSS wo möglich durch Chakra ersetzen
   - Unused Components löschen

2. **Code-Organisation**
   - Wiederverwendbare Chakra-Komponenten extrahieren
   - Theme-Definitionen zentralisieren
   - TypeScript-Types prüfen

---

## 🏗️ Neue Komponenten-Struktur

```
components/
├── dashboard/
│   ├── DashboardLayout.tsx          # Chakra Layout
│   ├── DashboardSidebar.tsx         # Chakra Sidebar
│   ├── DashboardHeader.tsx          # Chakra Header
│   ├── StatCard.tsx                 # Chakra Stat Component
│   ├── DataTable.tsx                # Chakra Table Wrapper
│   └── FilterBar.tsx                # Chakra Filter Components
├── ui/                              # Shared Chakra Components
│   ├── Card.tsx
│   ├── Button.tsx
│   └── Modal.tsx
└── [existing non-dashboard components bleiben]
```

---

## 🎨 Design-Entscheidungen

### Chakra Theme Customization
```typescript
const theme = extendTheme({
  colors: {
    brand: {
      50: '#fef2f2',
      500: '#e2001a',  // DB Rot
      600: '#c10015',
    },
  },
  fonts: {
    heading: 'DBScreenHead, sans-serif',
    body: 'DBScreenSans, sans-serif',
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
});
```

### Layout-Struktur
- **Sidebar**: Fixed, kollabierbar, Drawer auf Mobile
- **Header**: Sticky, mit Breadcrumbs, Actions, Theme Toggle
- **Content**: Container mit max-width, responsive Padding

### Responsive Breakpoints
- `base`: Mobile (< 768px)
- `md`: Tablet (768px - 1024px)
- `lg`: Desktop (> 1024px)

---

## ✅ Checkliste

### Setup
- [ ] Chakra UI installieren
- [ ] ChakraProvider einrichten
- [ ] Custom Theme erstellen
- [ ] Dark Mode konfigurieren

### Core Components
- [ ] DashboardLayout migrieren
- [ ] DashboardSidebar migrieren
- [ ] DashboardHeader migrieren
- [ ] Breadcrumbs migrieren
- [ ] Sheet → Drawer migrieren
- [ ] Notifications migrieren

### Views
- [ ] dashboard-client.tsx migrieren
- [ ] alerts-client.tsx migrieren
- [ ] projects-client.tsx migrieren
- [ ] telemetry-client.tsx + Sub-Views migrieren
- [ ] inventory-client.tsx + Sub-Views migrieren
- [ ] workshop-client.tsx + Sub-Views migrieren
- [ ] network-client.tsx + Sub-Views migrieren
- [ ] reports-client.tsx migrieren
- [ ] settings-client.tsx migrieren

### Cleanup
- [ ] Alte Tailwind Classes entfernen
- [ ] Unused Imports entfernen
- [ ] Tests anpassen (falls vorhanden)

---

## 🚀 Nächste Schritte

1. **Chakra UI installieren** und Provider einrichten
2. **Theme konfigurieren** mit DB-Farben und Fonts
3. **Layout-Komponenten** zuerst migrieren (Layout, Sidebar, Header)
4. **Haupt-Dashboard** migrieren als Proof of Concept
5. **Weitere Views** schrittweise migrieren
6. **Cleanup** und Optimierung

