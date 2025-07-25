# 🪞 Code Mirror — Frontend

**Code Mirror** es la interfaz de usuario para la plataforma de entrevistas técnicas en tiempo real. Construida como **Single‑Page Application (SPA)** y concebida como **cliente grueso (Thick Client)**, concentra gran parte de la lógica de negocio en el navegador para garantizar baja latencia y una experiencia fluida en colaboraciones de hasta **1 a 5 participantes**.

---

## ✨ Características Principales

| Módulo | Descripción |
| ------ | ----------- |
| **Autenticación** | Registro, inicio de sesión y refresco de sesión vía API Gateway. |
| **Dashboard de Entrevistas** | Crear, programar y gestionar ofertas y entrevistas. |
| **Sala de Entrevistas (1‑5 personas)** | <ul><li>**Editor de Código Colaborativo** con sincronización en tiempo real.</li><li>**Chat de Voz P2P** (WebRTC) para todos los participantes.</li><li>**Cargador de Archivos**: soporta subida de snippets, documentos y <br>**hojas de vida** de los candidatos.</li><li>**Sistema de Notificaciones** en tiempo real para invitaciones, cambios de estado y resultados.</li><li>**Auto‑Calificación**: evalúa el código enviado, ejecuta casos de prueba y muestra el feedback al instante.</li></ul> |
| **Historial & Feedback** | Registro de entrevistas anteriores con transcripciones, código final y puntuaciones. |

---

## 🏛️ Arquitectura de Cliente Grueso

| Capa | Rol en el Frontend |
| ---- | ------------------ |
| **WebRTC** | Conecta 1‑5 navegadores directamente para audio de baja latencia. |
| **WebSocket (Textual y Binario)** | - **Señalización WebRTC** (texto).<br>- **Deltas de código** (binario) para el editor colaborativo. |
| **Estado Local** | Manejado con *Zustand / Redux Toolkit* para sincronizar UI, participantes y notificaciones. |
| **Renderizado & Lógica** | El navegador ejecuta:<br>• Detección y aplicación de cambios (CRDT).<br>• Renderizado de syntax highlighting.<br>• Ejecución de pruebas locales previas al envío. |

> **Nota:** La autenticación y la autorización se gestionan **fuera** de este proyecto, en el API Gateway. El frontend solo consume tokens ya verificados.

---

## 🛠️ Tecnologías Utilizadas

- **Framework SPA:** React + Vite (compatible con Vue/Angular)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Gestión de Estado:** Zustand / Redux Toolkit
- **WebSockets:** `socket.io-client` / STOMP.js
- **Audio P2P:** WebRTC (APIs nativas)
- **Editor de Código:** CodeMirror / Monaco Editor
- **Notificaciones Push:** Web Push API
- **Almacenamiento de Archivos:** S3 compatible (firmas pre‑firmadas desde backend)

---


## diagram de componentes

![img.png](public/img.png)