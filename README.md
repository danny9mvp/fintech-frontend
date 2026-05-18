# FintechFrontend

Aplicacion web SPA para gestion de finanzas personales. Construida con Angular 21 y Angular Material.

## Requisitos

- Node.js 22+
- npm

## Instalacion

```bash
npm install
```

## Servidor de desarrollo

```bash
ng serve
```

Navegar a `http://localhost:4200/`. Las rutas `/auth`, `/users`, `/categories` y `/movements` se redirigen al backend en `http://localhost:8000` mediante proxy.

## Compilacion

```bash
ng build
```

Los artefactos se generan en `dist/`.

## Estructura

```
src/
  app/
    core/             Servicios, modelos, interceptores
    pages/
      auth/           Login y registro
      dashboard/      Resumen de ingresos, gastos y presupuestos
      categories/     CRUD de categorias con presupuesto
      movements/      CRUD de movimientos con filtros
      profile/        Perfil de usuario y cambio de contrasena
```

## Docker

```bash
docker compose up -d
```

Construye la imagen y sirve la app via nginx en el puerto 80. Las peticiones API se redirigen al contenedor `fintech-backend` en el puerto 8000.

## AI Usage

### Herramientas utilizadas

- **OpenCode**: asistente principal para todo el ciclo de desarrollo. Se uso para el scaffolding inicial del proyecto, aplicación de estilos en toda la aplicación, asistencia en la creación de funcionalidades como la renovación del token, corrección de bugs y refactorización de código.
- **Claude (via OpenCode)**: modelo subyacente que ejecuto las instrucciones de OpenCode para generar codigo, depurar errores y refactorizar.

### Tareas asignadas a OpenCode

| Tarea | Descripcion |
|---|---|
| Scaffolding del proyecto | Creacion del proyecto Angular con modulos de autenticacion, categorias, movimientos y dashboard, incluyendo servicios, modelos, guardas de ruta e interceptor HTTP. |
| Configuracion de proxy | Correccion del proxy.conf.json y su activacion en angular.json para redirigir peticiones al backend. |
| Refresh token y logout | Implementacion del flujo de renovacion de token con Bloqueo de peticiones concurrentes y limpieza de sesion. |
| Paleta de colores | Aplicacion de una paleta azul corporativa mediante CSS custom properties y tema preconstruido de Angular Material. |
| Perfil de usuario | Creacion de la pagina de perfil con formulario de actualizacion de datos personales y cambio de contrasena. |
| Verificacion de presupuesto | Integracion del endpoint /check-budget en el formulario de movimientos para alertar sobre uso excesivo del presupuesto. |

### Ejemplos concretos

1. **"Arregla el dashboard que se queda congelado al cargar"** — OpenCode identifico que el metodo `budgetSummary()` del servicio `CategoryService` jamas se invocaba en el `ngOnInit` del dashboard. La correccion fue aniadir la suscripcion a `categorySvc.budgetSummary()` y manejar el estado `loading` para mostrar un progress bar mientras se completan las peticiones asincronicas.

2. **"Implementa el flujo de refresh token con Bloqueo de peticiones concurrentes"** — OpenCode genero en el interceptor HTTP la logica para detectar un 401, bloquear las peticiones entrantes mediante un BehaviorSubject, renovar el token via `POST /auth/refresh`, y reemitir las peticiones encoladas. Incluyo exclusion de las rutas `/auth/refresh` y `/auth/logout` para evitar ciclos infinitos.

### Sugerencia modificada o rechazada

OpenCode sugirio implementar un tema personalizado de Angular Material con la funcion `defineCustomTheme()` de los nuevos theming APIs de Angular Material 19+, generando un archivo `theme.scss` con variables SCSS. Se rechazo la sugerencia porque el proyecto usa Angular 21 con el sistema de temas basado en CSS custom properties y la funcion `createTheme()` con `provideNativeDateAdapter`. En su lugar, se opto por definir la paleta de colores como variables CSS en `app.scss` y usar el tema preconstruido `azure-blue` de Angular Material. La solucion fue mas simple, requirió menos código boilerplate y evitó la dependencia de archivos SCSS de tema adicionales.

### Valoracion

El uso de IA acelero significativamente el desarrollo, especialmente en la generacion de componentes repetitivos (CRUDs, formularios, tablas) y en la depuracion de errores asincronicos (dependencias circulares en servicios, estados de carga no manejados). La calidad del codigo generado fue consistente con las convenciones del proyecto porque OpenCode leia los archivos existentes antes de producir codigo nuevo, replicando el estilo y las importaciones. El principal riesgo fue la generacion de codigo que asumia librerias o endpoints inexistentes, lo cual requirio verificacion manual en cada iteracion. En general, el tiempo de desarrollo se redujo aproximadamente a la mitad comparado con escribir todo manualmente.
