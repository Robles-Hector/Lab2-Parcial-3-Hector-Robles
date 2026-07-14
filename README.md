# 🏎 F1 Historical Database — 2020–2026

Aplicación React SPA para explorar la historia de la Fórmula 1 desde 2020 hasta 2026.

## 🚀 Instalación y arranque

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar en desarrollo
npm start
```

La app se abrirá en `http://localhost:3000`

## 🔑 Credenciales de Administrador

- **Usuario:** `admin`
- **Contraseña:** `admin123`

## 📋 Páginas y rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio — Hero, búsqueda, campeón, timeline |
| `/temporadas` | Clasificaciones por año (2020–2026) |
| `/pilotos` | Lista de todos los pilotos |
| `/piloto/:slug` | Página individual del piloto |
| `/comparador` | Comparador cara a cara entre pilotos |
| `/dashboard` | Panel con gráficos y estadísticas |
| `/circuitos` | Mapa de circuitos del calendario |
| `/admin` | Panel de administración *(solo admin)* |

## 🎯 Funcionalidades

### Invitado
- Ver timeline interactiva (2020–2026)
- Explorar pilotos, temporadas y circuitos
- Comparar pilotos
- Ver dashboard con gráficos
- Búsqueda global con autocompletado

### Administrador
- Todo lo anterior +
- Agregar nueva escudería con 2 pilotos (programada para 2027)
- Editar datos de pilotos individuales
- Ver escuderías pendientes de confirmación

## 🛠 Stack tecnológico

- **React 18** — Framework UI
- **React Router v6** — Navegación SPA
- **Recharts** — Gráficos y visualizaciones
- **CSS Variables** — Sistema de temas (dark/light)
- **Google Fonts** — Titillium Web, Share Tech Mono

## 🎨 Diseño

- Modo oscuro / claro con un clic
- Paleta basada en rojo F1 (#E50914)
- Tipografía: Titillium Web + Share Tech Mono
- Totalmente responsive

## 📁 Estructura del proyecto

```
├── 📁 .github
│   └── 📁 modernize
│       └── 📁 java-upgrade
│           ├── 📁 hooks
│           │   ├── 📁 scripts
│           │   │   ├── 📄 recordToolUse.ps1
│           │   │   └── 📄 recordToolUse.sh
│           │   └── ⚙️ e2736fcc-115a-4d53-bfce-376e760f8a09.json
│           └── ⚙️ .gitignore
├── 📁 f1-historical-backend
│   ├── 📁 .github
│   │   └── 📁 modernize
│   │       └── 📁 java-upgrade
│   │           ├── 📁 20260713212210
│   │           │   ├── 📁 logs
│   │           │   └── 📝 plan.md
│   │           ├── 📁 hooks
│   │           │   └── 📁 scripts
│   │           │       ├── 📄 recordToolUse.ps1
│   │           │       └── 📄 recordToolUse.sh
│   │           └── ⚙️ .gitignore
│   ├── 📁 .mvn
│   │   └── 📁 wrapper
│   │       └── 📄 maven-wrapper.properties
│   ├── 📁 src
│   │   ├── 📁 main
│   │   │   ├── 📁 java
│   │   │   │   └── 📁 edu
│   │   │   │       └── 📁 espe
│   │   │   │           └── 📁 f1
│   │   │   │               ├── 📁 config
│   │   │   │               │   ├── ☕ DataInitializer.java
│   │   │   │               │   ├── ☕ JwtUtil.java
│   │   │   │               │   ├── ☕ OpenApiConfig.java
│   │   │   │               │   └── ☕ SecurityConfig.java
│   │   │   │               ├── 📁 controller
│   │   │   │               │   ├── ☕ AuthController.java
│   │   │   │               │   ├── ☕ CircuitController.java
│   │   │   │               │   ├── ☕ DriverController.java
│   │   │   │               │   ├── ☕ RaceController.java
│   │   │   │               │   ├── ☕ RaceResultController.java
│   │   │   │               │   └── ☕ TeamController.java
│   │   │   │               ├── 📁 dto
│   │   │   │               │   ├── ☕ CircuitMapper.java
│   │   │   │               │   ├── ☕ CircuitResponseDTO.java
│   │   │   │               │   ├── ☕ CircuitSummaryDTO.java
│   │   │   │               │   ├── ☕ DriverMapper.java
│   │   │   │               │   ├── ☕ DriverResponseDTO.java
│   │   │   │               │   ├── ☕ DriverSummaryDTO.java
│   │   │   │               │   ├── ☕ ErrorResponseDTO.java
│   │   │   │               │   ├── ☕ RaceMapper.java
│   │   │   │               │   ├── ☕ RaceResponseDTO.java
│   │   │   │               │   ├── ☕ RaceResultMapper.java
│   │   │   │               │   ├── ☕ RaceResultResponseDTO.java
│   │   │   │               │   ├── ☕ TeamMapper.java
│   │   │   │               │   ├── ☕ TeamResponseDTO.java
│   │   │   │               │   └── ☕ TeamSummaryDTO.java
│   │   │   │               ├── 📁 entity
│   │   │   │               │   ├── ☕ Circuit.java
│   │   │   │               │   ├── ☕ Driver.java
│   │   │   │               │   ├── ☕ DriverTransfer.java
│   │   │   │               │   ├── ☕ Race.java
│   │   │   │               │   ├── ☕ RaceResult.java
│   │   │   │               │   ├── ☕ Role.java
│   │   │   │               │   ├── ☕ Team.java
│   │   │   │               │   └── ☕ User.java
│   │   │   │               ├── 📁 exception
│   │   │   │               │   └── ☕ GlobalExceptionHandler.java
│   │   │   │               ├── 📁 repository
│   │   │   │               │   ├── ☕ CircuitRepository.java
│   │   │   │               │   ├── ☕ DriverRepository.java
│   │   │   │               │   ├── ☕ DriverTransferRepository.java
│   │   │   │               │   ├── ☕ RaceRepository.java
│   │   │   │               │   ├── ☕ RaceResultRepository.java
│   │   │   │               │   ├── ☕ RoleRepository.java
│   │   │   │               │   ├── ☕ TeamRepository.java
│   │   │   │               │   └── ☕ UserRepository.java
│   │   │   │               ├── 📁 service
│   │   │   │               │   ├── ☕ AuthService.java
│   │   │   │               │   ├── ☕ CircuitService.java
│   │   │   │               │   ├── ☕ DriverService.java
│   │   │   │               │   ├── ☕ RaceResultService.java
│   │   │   │               │   ├── ☕ RaceService.java
│   │   │   │               │   └── ☕ TeamService.java
│   │   │   │               └── ☕ F1HistoricalBackendApplication.java
│   │   │   └── 📁 resources
│   │   │       ├── 📄 application.properties
│   │   │       └── ⚙️ f1Data.json
│   │   └── 📁 test
│   │       └── 📁 java
│   │           └── 📁 edu
│   │               └── 📁 espe
│   │                   └── 📁 f1
│   │                       └── ☕ F1HistoricalBackendApplicationTests.java
│   ├── ⚙️ .env.example
│   ├── ⚙️ .gitattributes
│   ├── ⚙️ .gitignore
│   ├── 📝 HELP.md
│   ├── 📄 mvnw
│   ├── 📄 mvnw.cmd
│   └── ⚙️ pom.xml
└── 📁 f1-history
    ├── 📁 public
    │   └── 🌐 index.html
    ├── 📁 src
    │   ├── 📁 components
    │   │   ├── 📁 layout
    │   │   │   └── 📄 Navbar.jsx
    │   │   └── 📁 pages
    │   │       ├── 📄 AdminPage.jsx
    │   │       ├── 📄 CircuitsPage.jsx
    │   │       ├── 📄 ComparatorPage.jsx
    │   │       ├── 📄 DashboardPage.jsx
    │   │       ├── 📄 DriversPage.jsx
    │   │       ├── 📄 HomePage.jsx
    │   │       ├── 📄 LoginPage.jsx
    │   │       ├── 📄 MisPostulacionesPage.jsx
    │   │       ├── 📄 PilotPage.jsx
    │   │       ├── 📄 PostularEquipoPage.jsx
    │   │       ├── 📄 RegisterPage.jsx
    │   │       └── 📄 SeasonsPage.jsx
    │   ├── 📁 context
    │   │   └── 📄 AppContext.jsx
    │   ├── 📁 data
    │   │   └── ⚙️ f1Data.json
    │   ├── 📁 hooks
    │   │   └── 📄 useF1Data.js
    │   ├── 🎨 App.css
    │   ├── 📄 App.jsx
    │   └── 📄 index.js
    ├── 📝 README.md
    ├── ⚙️ package-lock.json
    └── ⚙️ package.json
```

---
*Generated by FileTree Pro Extension*
