# Bot de Discord

Este es un bot de Discord completo con comandos prefix, comandos slash e interacciones.

## Características

- Sistema de comandos prefix (usando `!` por defecto)
- Sistema de comandos slash
- Sistema de interacciones (botones, menús de selección)
- Estructura organizada en carpetas
- Logs detallados de inicialización
- Archivo .env para configuración

## Estructura de carpetas

```
├── commands/
│   ├── prefix/
│   │   ├── moderation/
│   │   └── utility/
│   └── slash/
│       ├── moderation/
│       └── utility/
├── handlers/
│   ├── commandHandler.js
│   ├── slashHandler.js
│   └── interactionHandler.js
├── interactions/
│   ├── buttons/
│   └── selectMenus/
├── .env
├── index.js
└── package.json
```

## Configuración

1. Crea un archivo `.env` con la siguiente información:
   ```
   TOKEN=tu_token_aqui
   CLIENT_ID=tu_client_id_aqui
   GUILD_ID=tu_guild_id_aqui
   PREFIX=!
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Inicia el bot:
   ```
   npm start
   ```

## Comandos disponibles

### Comandos Prefix (!)

- `!normativa` - Crea mensaje en el canal de normativas IC/OCC
- `!ping` - Responde con la latencia del bot
- `!help` - Muestra la lista de comandos disponibles

### Comandos Slash (/)

- `/normativa` - Crea mensaje en el canal de normativas IC/OCC
- `/ping` - Responde con la latencia del bot

## Interacciones

El bot incluye interacciones para los botones de las reglas, que muestran información detallada sobre cada regla al hacer clic.