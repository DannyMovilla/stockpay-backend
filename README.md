# Payments API – Backend (NestJS + Wompi)

## 📌 Descripción general

Este proyecto corresponde al **backend de una API de servicios de pago**, desarrollada en **NestJS (TypeScript)** e integrada con **Wompi** como pasarela de pago.

La aplicación fue diseñada siguiendo principios de **Arquitectura Hexagonal (Puertos y Adaptadores)** y **Programación Orientada a Ferrocarriles (ROP)**, garantizando separación de responsabilidades, manejo explícito de errores y consistencia del estado interno frente a fallos externos.

---

## 🛠️ Tecnologías utilizadas

- **Node.js**
- **NestJS**
- **TypeScript**
- **Axios**
- **Prisma ORM**
- **PostgreSQL**
- **Wompi API**
- **Helmet (seguridad HTTP)**
- **CORS controlado**

---

## 🧱 Arquitectura

La aplicación sigue una **Arquitectura Hexagonal**, donde:

- La lógica de negocio **NO vive en los controladores**
- Los casos de uso están desacoplados de frameworks y proveedores externos
- Wompi y la base de datos son tratados como adaptadores externos

### Estructura del proyecto


### Diseño de Base de Datos

<img width="1615" height="799" alt="Image" src="https://github.com/user-attachments/assets/8a47783b-373b-4bd1-aca1-60785b60ed1c" />


### Principios aplicados

- Arquitectura Hexagonal (Puertos y Adaptadores)
- Separación de capas (Domain / Application / Infrastructure)
- Código desacoplado y mantenible

---

## 🚦 Programación Orientada a Ferrocarriles (ROP)

El flujo de ejecución se maneja mediante el tipo `Result<T>`, evitando el uso de excepciones (`throw`) dentro de los casos de uso.

```ts
export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: Error };
```

### Variables de entorno

```env
PORT=3000
NODE_ENV=production

DATABASE_URL=
WOMPI_PUBLIC_KEY=
WOMPI_PRIVATE_KEY=
WOMPI_EVENT_SECRET=
WOMPI_INTEGRITY_SECRET=
WOMPI_API_URL=
UAT_URL=
FRONTEND_URL=

```

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm run build
npm run start
```

### Test de endpoints - Swagger

```url
http://localhost:3000/docs
```
