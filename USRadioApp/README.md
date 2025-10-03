# US Radio App

Una aplicación móvil Android para escuchar radios de Estados Unidos con funcionalidad de favoritos.

## Características

- 🎵 Streaming de radios de Estados Unidos usando la API de Radio Browser
- 🖼️ Logos de las radios mostrados en cada banner
- ⭐ Sistema de favoritos para guardar tus radios preferidas
- 🔍 Búsqueda de radios por nombre, tags o ubicación
- 🎛️ Reproductor integrado con controles de reproducción
- 📱 Interfaz moderna con Material Design
- 🔄 Actualización por deslizamiento (pull-to-refresh)

## Tecnologías Utilizadas

- **Kotlin** - Lenguaje de programación principal
- **Android Architecture Components** - ViewModel, LiveData
- **Retrofit** - Cliente HTTP para la API REST
- **ExoPlayer** - Reproductor multimedia para streaming de audio
- **Glide** - Carga y caché de imágenes
- **Material Design Components** - UI moderna
- **SharedPreferences** - Almacenamiento local de favoritos

## Estructura del Proyecto

```
app/src/main/
├── java/com/usradio/app/
│   ├── MainActivity.kt                 # Actividad principal
│   ├── model/
│   │   └── RadioStation.kt            # Modelo de datos de radio
│   ├── api/
│   │   ├── RadioBrowserApi.kt         # Interface de la API
│   │   └── ApiClient.kt               # Cliente HTTP
│   ├── repository/
│   │   ├── RadioRepository.kt         # Repositorio de radios
│   │   └── FavoritesRepository.kt     # Repositorio de favoritos
│   ├── viewmodel/
│   │   └── RadioViewModel.kt          # ViewModel principal
│   ├── adapter/
│   │   ├── RadioStationAdapter.kt     # Adaptador RecyclerView
│   │   └── ViewPagerAdapter.kt        # Adaptador ViewPager
│   ├── fragment/
│   │   └── RadioListFragment.kt       # Fragment lista de radios
│   └── service/
│       └── RadioPlayerService.kt      # Servicio de reproducción
└── res/
    ├── layout/                        # Layouts XML
    ├── values/                        # Strings, colores, temas
    └── drawable/                      # Iconos y recursos gráficos
```

## Compilación

### Requisitos

- Android Studio Arctic Fox o superior
- SDK de Android 21+ (Android 5.0)
- JDK 8 o superior

### Pasos para compilar

1. **Abrir el proyecto**
   ```bash
   # Extraer el ZIP y abrir en Android Studio
   # O usar línea de comandos:
   cd USRadioApp
   ./gradlew build
   ```

2. **Compilar APK de debug**
   ```bash
   ./gradlew assembleDebug
   ```

3. **Compilar APK de release**
   ```bash
   ./gradlew assembleRelease
   ```

4. **Instalar en dispositivo**
   ```bash
   ./gradlew installDebug
   ```

### Ubicación de APKs generados

- Debug: `app/build/outputs/apk/debug/app-debug.apk`
- Release: `app/build/outputs/apk/release/app-release-unsigned.apk`

## Funcionalidades

### 🎵 Reproducción de Radio

- Streaming en tiempo real de radios de Estados Unidos
- Controles de reproducción (play/pause/stop)
- Notificación con controles de reproducción
- Reproducción en segundo plano

### ⭐ Sistema de Favoritos

- Agregar/quitar radios de favoritos con un toque
- Almacenamiento persistente local
- Tab dedicada para favoritos
- Sincronización automática entre listas

### 🔍 Búsqueda

- Búsqueda en tiempo real mientras escribes
- Filtrado por nombre de radio, tags y ubicación
- Funciona tanto en la lista principal como en favoritos

### 📱 Interfaz de Usuario

- Diseño Material Design moderno
- Lista con logos de radios cargados dinámicamente
- Mini reproductor flotante
- Tabs para navegar entre todas las radios y favoritos
- Estados de carga y error manejados

## API Utilizada

La aplicación utiliza la **Radio Browser API** (https://api.radio-browser.info/) que proporciona:

- Base de datos gratuita y abierta de radios mundiales
- Información detallada de cada radio (nombre, país, tags, logo, etc.)
- URLs de streaming actualizadas
- Filtrado por país (Estados Unidos en este caso)

## Permisos Requeridos

- `INTERNET` - Para streaming de audio y carga de datos
- `ACCESS_NETWORK_STATE` - Para verificar conectividad
- `WAKE_LOCK` - Para reproducción en segundo plano
- `FOREGROUND_SERVICE` - Para el servicio de reproducción

## Notas de Desarrollo

- La aplicación filtra automáticamente las radios de Estados Unidos
- Se validan las URLs de streaming antes de mostrar las radios
- Los favoritos se almacenan localmente usando SharedPreferences con serialización JSON
- El reproductor usa ExoPlayer para mejor compatibilidad con formatos de streaming
- Las imágenes se cargan con caché para optimizar el rendimiento

## Próximas Mejoras

- [ ] Modo nocturno
- [ ] Ecualizador
- [ ] Temporizador de apagado
- [ ] Compartir radios
- [ ] Historial de reproducción
- [ ] Categorías por género musical

---

**Desarrollado para Android con ❤️**