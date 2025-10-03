# US Radio Stations App

Una aplicación Android para escuchar estaciones de radio de Estados Unidos utilizando la API de Radio Browser.

## Características

- 📻 Lista de más de 1000 estaciones de radio de USA
- 🎨 Logos e imágenes de cada estación
- ⭐ Sistema de favoritos con almacenamiento local
- 🔍 Búsqueda de estaciones por nombre, estado o tags
- ▶️ Reproductor integrado con ExoPlayer
- 📱 Interfaz moderna con Material Design
- 🗂️ Dos pestañas: Todas las estaciones y Favoritos

## Requisitos

- Android Studio Arctic Fox o superior
- JDK 8 o superior
- Android SDK 24 (Android 7.0) o superior
- Conexión a Internet

## Cómo compilar

1. Extrae el archivo ZIP
2. Abre Android Studio
3. Selecciona "Open an existing project"
4. Navega hasta la carpeta `USRadioApp` y ábrela
5. Espera a que Gradle sincronice las dependencias
6. Conecta un dispositivo Android o inicia un emulador
7. Haz clic en "Run" (▶️) o presiona Shift+F10

## Estructura del Proyecto

```
USRadioApp/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/usradio/app/
│   │       │   ├── MainActivity.java
│   │       │   ├── adapter/
│   │       │   │   └── RadioStationAdapter.java
│   │       │   ├── api/
│   │       │   │   ├── RadioBrowserService.java
│   │       │   │   └── RetrofitClient.java
│   │       │   ├── database/
│   │       │   │   ├── AppDatabase.java
│   │       │   │   └── FavoriteDao.java
│   │       │   ├── model/
│   │       │   │   └── RadioStation.java
│   │       │   ├── player/
│   │       │   │   └── RadioPlayer.java
│   │       │   └── repository/
│   │       │       └── RadioRepository.java
│   │       ├── res/
│   │       │   ├── layout/
│   │       │   ├── values/
│   │       │   └── drawable/
│   │       └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
└── settings.gradle
```

## Dependencias Principales

- **Retrofit 2.9.0**: Para llamadas a la API REST
- **Glide 4.16.0**: Para cargar imágenes y logos
- **Room 2.6.0**: Base de datos local para favoritos
- **ExoPlayer 2.19.1**: Reproductor de audio para streaming
- **Material Components**: UI moderna de Android

## API Utilizada

[Radio Browser API](https://www.radio-browser.info/) - Una API comunitaria gratuita de estaciones de radio de todo el mundo.

## Funcionalidades

### Pantalla Principal
- Lista de estaciones de radio de USA ordenadas por popularidad
- Muestra logo, nombre, estado, tags y bitrate de cada estación
- Búsqueda en tiempo real
- Sistema de tabs para alternar entre todas las estaciones y favoritos

### Reproductor
- Panel de control en la parte inferior
- Botones de Play/Pause y Cerrar
- Muestra la estación actual reproduciendo
- Streaming en tiempo real con ExoPlayer

### Favoritos
- Agregar/quitar estaciones de favoritos con un tap
- Almacenamiento persistente con Room Database
- Vista separada para ver solo favoritos

## Permisos

La aplicación requiere los siguientes permisos:
- `INTERNET`: Para streaming de audio y llamadas a la API
- `ACCESS_NETWORK_STATE`: Para verificar conexión
- `WAKE_LOCK`: Para mantener reproducción en segundo plano

## Troubleshooting

Si encuentras problemas:

1. **Error de compilación**: Ejecuta `./gradlew clean` y sincroniza Gradle de nuevo
2. **No carga estaciones**: Verifica tu conexión a Internet
3. **No reproduce audio**: Asegúrate de tener permisos de Internet habilitados

## Autor

Desarrollado para demostrar integración con APIs REST, bases de datos locales y reproducción de audio en Android.

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
