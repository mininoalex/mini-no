# Arquitectura y entregas

| Módulo | Responsabilidad |
|---|---|
| apps/app | Expo Router en Android y web. La pantalla lee el check-in y presenta la explicación del motor. |
| packages/engine | Reglas puras TypeScript, independientes de red, UI y base de datos. |
| packages/exercises | Catálogo versionado con patrón, equipo, nivel, cadena ordenada y restricciones. Solo las entradas revisadas podrán usarse para generar sesiones. |
| packages/ui | Tokens visuales compartidos, controles de 48 px y estados de progreso. |
| supabase | Backend previsto para autenticación, Postgres con RLS por persona y funciones para exportar o borrar la cuenta. |

## Flujo previsto del MVP

1. Onboarding para mayores de 18 con consentimiento y cuestionario previo. La calibración recoge preferencias y limitaciones, sin emitir diagnósticos.
2. El motor filtra variantes y mantiene una cadena durante 4–6 semanas. La molestia se registra por separado del esfuerzo. Una zona con dolor repetido requiere revisar la selección y sugerir consulta profesional.
3. La sesión y su evento de sincronización se guardarán en una transacción local SQLite. Cada evento tendrá un identificador estable y el usuario propietario. El servidor confirmará por identificador para permitir reintentos sin duplicar series. Los conflictos de edición requerirán versión de origen y conciliación explícita.
4. El tablero priorizará energía, constancia semanal y fuerza. Las fotos permanecerán en el dispositivo y quedarán excluidas de la cola.

## Tandas siguientes

Primero validar empaquetado Android y web. Después incorporar y revisar una cadena de ejercicios de extremo a extremo; verificar filtros y margen inicial de esfuerzo. Luego probar persistencia sin conexión, cambio de cuenta y reintentos. Abrir el piloto tras probar consentimiento, exportación, borrado y aislamiento entre dos usuarios.
