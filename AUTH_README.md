# Sistema de Autenticación - Proyecto GEOS

## Configuración Inicial

### 1. Variables de Entorno
Copia el archivo `.env.example` a `.env` en la carpeta `backend/`:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```
MONGODB_URI=tu_cadena_de_conexion_mongodb
JWT_SECRET=tu_secreto_jwt_seguro
PORT=3000
```

### 2. Instalar Dependencias

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

## Ejecutar la Aplicación

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Crear Primer Usuario

Para crear un usuario de prueba, usa el endpoint de registro:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123"
  }'
```

## Endpoints de Autenticación

### Registro de Usuario
```
POST /api/auth/register
Body: { "email": "user@example.com", "password": "password123" }
```

### Login
```
POST /api/auth/login
Body: { "email": "user@example.com", "password": "password123" }
Response: { "token": "jwt_token", "user": { "id": "...", "email": "..." } }
```

## Características Implementadas

### Backend
- ✅ Modelo de Usuario con hash de contraseñas (bcrypt)
- ✅ Endpoints de registro y login con JWT
- ✅ Middleware de autenticación para proteger rutas
- ✅ Todas las rutas de places y zones requieren autenticación
- ✅ Validación de tokens JWT en cada petición protegida

### Frontend
- ✅ Vista de login con validación de formulario
- ✅ Almacenamiento de JWT en localStorage
- ✅ Envío automático del token en todas las peticiones API
- ✅ Detección de sesión expirada con logout automático
- ✅ Visualización del usuario autenticado
- ✅ Botón de cerrar sesión
- ✅ Mensajes de error mejorados

## Seguridad

- Las contraseñas se almacenan hasheadas con bcrypt (factor 10)
- Los tokens JWT expiran en 8 horas
- Las rutas de API están protegidas con middleware de autenticación
- Si el token es inválido o ha expirado, se cierra la sesión automáticamente

## Notas de Desarrollo

- Para desarrollo, si no defines `JWT_SECRET`, se usa `secret_dev_key` por defecto
- En producción, **siempre** define un `JWT_SECRET` fuerte y aleatorio
- La conexión MongoDB usa la variable `MONGODB_URI` o el fallback hardcoded (cambiar en producción)
