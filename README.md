# MINI-NO

Sentirse mejor, no verse mejor. Proyecto abierto de entrenamiento de fuerza en español para adultos que entrenan en casa o en el gimnasio.

## Probar la primera tanda

Con Node 24, ejecutá `npm test`. Con pnpm, ejecutá `pnpm install`, luego `pnpm --filter @mi/app start` y elegí Android o web. La pantalla permite elegir el tiempo disponible y ver por qué cambia el formato. Es una demostración de planificación, sin prescripción de ejercicios.

## Estado

Implementados: check-in de tiempo, energía y motivo de ausencia; adaptación reproducible de la sesión; explicación de cada cambio y pantalla Expo accesible. Planeados: catálogo de 60–80 ejercicios revisados, registro opcional por serie, calendario flexible y sincronización. Primer hito de producto: 10 personas durante cuatro semanas. Ver [arquitectura](docs/ARQUITECTURA.md).

Cada cambio en `main` ejecuta pruebas del motor, chequeo de TypeScript y compilación web en GitHub Actions.
