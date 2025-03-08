# Todo List

## Interfaz e Interacciones

### Propiedades de la mascota
- [x] Definir propiedades mínimas de la mascota:
  - `health` (integer)
  - `mood` (integer)
  - `hunger` (integer)
  - `physical aptitude` (integer)
  - `name` (string)

### Visualización de la mascota
- [ ] Mostrar una mascota virtual (imagen, animación o sprite) que reaccione a las interacciones del usuario.

### Botones de acción
- [x] Incluir controles para las siguientes acciones:
  - Crear
  - Alimentar
  - Acariciar
  - Regañar
  - Enviar a Descansar
  - Jugar
  - Entrenar
- [ ] Cada acción debe tener una representación visual (cambios en la imagen o animaciones) que indique la respuesta del animal.
- [x] En caso de muerte de la mascota, mostrar un mensaje y dar la opción de crear de nuevo.
- [x] El botón "Enviar a Descansar" debe:
  - Retornar un tiempo de inactividad aleatorio.
  - Mostrar un contador con la opción de detenerlo. Si se detiene, no se gana nada del descanso.

## Manejo del Estado de Conectividad

### Modo Online
- [ x] Habilitar todas las acciones.
- [ x] La aplicación debe comunicarse con una API externa mediante peticiones GET/POST para actualizar el estado del animal.

### Modo Offline
- [x ] Deshabilitar las acciones de "Jugar" y "Entrenar".
- [ x] Permitir las acciones de "Alimentar", "Acariciar", "Regañar" y "Enviar a Descansar", registrándolas en una cola local para su posterior sincronización.
- [ x] La aplicación debe detectar automáticamente los cambios en la conectividad.

## Proceso de Reconexión y Sincronización

- [x] Al pasar de offline a online:
  - Bloquear la UI y mostrar un mensaje (ej: "Reconectando...").
  - Sincronizar todas las acciones acumuladas en orden cronológico.
  - Simular el proceso de sincronización (ej: con promesas o `setTimeout`).
  - No aceptar nuevos inputs hasta finalizar la sincronización.

## Retroalimentación y Comunicación Visual

- [x] Proporcionar notificaciones o mensajes visuales que indiquen el estado actual de la aplicación (ej: "Conectado", "Sin conexión", "Sincronizando").
- [x] Reflejar los cambios en el estado del animal en la interfaz (ej: cambios en la imagen, animaciones o mensajes que indiquen la reacción a la acción realizada).