# 🚀 Guía de Configuración del Proyecto

Esta guía te ayudará a configurar y ejecutar el proyecto en tu máquina local.

## 📋 Requisitos Previos

- **Node.js** (versión 14 o superior)
- **npm** o **yarn**
- Una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuita)

## 🔧 Configuración Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/YahirHernandezz/proyecto-geos.git
cd proyecto-geos
```

### 2. Configurar MongoDB Atlas

#### 2.1 Crear una cuenta y cluster
1. Ve a [MongoDB Atlas](https://cloud.mongodb.com)
2. Crea una cuenta (si no tienes una)
3. Crea un nuevo cluster (el tier gratuito es suficiente)

#### 2.2 Crear usuario de base de datos
1. En el panel de MongoDB Atlas, ve a **"Database Access"**
2. Haz clic en **"Add New Database User"**
3. Elige un nombre de usuario y contraseña segura
4. Selecciona **"Read and write to any database"**
5. Haz clic en **"Add User"**

#### 2.3 Configurar acceso de red
1. Ve a **"Network Access"**
2. Haz clic en **"Add IP Address"**
3. Selecciona **"Allow Access from Anywhere"** (para desarrollo)
4. Confirma

#### 2.4 Obtener la cadena de conexión
1. Regresa a **"Database"** y haz clic en **"Connect"** en tu cluster
2. Selecciona **"Connect your application"**
3. Copia la cadena de conexión (se verá similar a):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Reemplaza `<username>` y `<password>` con las credenciales del paso 2.2
5. Agrega el nombre de tu base de datos después de `.net/`, por ejemplo:
   ```
   mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/geos_db?retryWrites=true&w=majority
   ```

### 3. Configurar el Backend

```bash
cd backend
npm install
```

#### 3.1 Crear archivo `.env`
Crea un archivo llamado `.env` en la carpeta `backend/` con el siguiente contenido:

```env
# MongoDB connection string (reemplaza con tu URI real)
MONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster0.xxxxx.mongodb.net/geos_db?retryWrites=true&w=majority

# JWT secret key (usa una clave segura en producción)
JWT_SECRET=tu_clave_secreta_super_segura_y_larga_123456

# Server port
PORT=3000
```

⚠️ **Importante**: 
- Reemplaza `TU_USUARIO` y `TU_PASSWORD` con tus credenciales reales
- Cambia `JWT_SECRET` por una clave aleatoria y segura
- **Nunca** subas el archivo `.env` a GitHub (ya está en `.gitignore`)

### 4. Configurar el Frontend

```bash
cd ../frontend
npm install
```

### 5. Ejecutar el Proyecto

#### Opción A: Dos terminales separadas

**Terminal 1 - Backend:**
```bash
cd backend
node app.js
```
Deberías ver: `✓ Conectado a MongoDB exitosamente`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### Opción B: Usar concurrently (desde la raíz)
Si prefieres ejecutar todo desde una terminal, puedes instalar `concurrently`:

```bash
npm install -g concurrently
```

Y agregar este script al `package.json` raíz del proyecto.

### 6. Crear el Primer Usuario

Una vez que el backend esté corriendo:

**Opción 1: Usar el frontend**
1. Abre tu navegador en `http://localhost:5173` (o el puerto que indique Vite)
2. Ve a la página de registro
3. Crea tu cuenta

**Opción 2: Usar cURL**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"tu@email.com","password":"tupassword"}'
```

## 🎯 URLs del Proyecto

- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend API**: http://localhost:3000
- **API Auth**: http://localhost:3000/api/auth
- **API Places**: http://localhost:3000/api/places
- **API Zones**: http://localhost:3000/api/zones
- **API Cases**: http://localhost:3000/api/cases
- **API Resources**: http://localhost:3000/api/resources

## 📁 Estructura del Proyecto

```
proyecto-geos/
├── backend/
│   ├── .env              # Variables de entorno (crear manualmente)
│   ├── app.js            # Servidor principal
│   ├── package.json
│   ├── models/           # Modelos de MongoDB
│   ├── routes/           # Rutas de la API
│   └── middleware/       # Middleware de autenticación
└── frontend/
    ├── src/
    │   ├── components/   # Componentes React
    │   ├── App.jsx       # Componente principal
    │   └── main.jsx      # Punto de entrada
    └── package.json
```

## ❓ Solución de Problemas

### Error: "MONGODB_URI no está definida"
- Verifica que creaste el archivo `.env` en la carpeta `backend/`
- Asegúrate de que el archivo tiene el formato correcto
- Reinicia el servidor después de crear/modificar el `.env`

### Error de conexión a MongoDB
- Verifica que la URI es correcta
- Confirma que el usuario y contraseña son correctos
- Revisa que agregaste tu IP en "Network Access" de MongoDB Atlas
- Asegúrate de incluir el nombre de la base de datos en la URI

### El frontend no se conecta al backend
- Verifica que el backend esté corriendo en el puerto 3000
- Revisa la configuración de CORS en `app.js`
- Comprueba las URLs de las peticiones en los componentes de React

## 🔐 Seguridad

- **Nunca** compartas tu archivo `.env`
- **Nunca** subas credenciales a GitHub
- Usa contraseñas seguras para MongoDB
- Cambia el `JWT_SECRET` a algo único y aleatorio

## 📝 Notas Adicionales

- MongoDB creará automáticamente la base de datos y las colecciones cuando guardes el primer documento
- No necesitas ejecutar migraciones ni scripts de base de datos
- Los esquemas de Mongoose se encargan de la estructura de los datos

## 🆘 Soporte

Si tienes problemas, verifica:
1. Que todas las dependencias estén instaladas (`npm install`)
2. Que el archivo `.env` esté configurado correctamente
3. Que MongoDB Atlas permita conexiones desde tu IP
4. Los logs en la consola del backend y frontend

---

¡Listo! Ahora deberías tener el proyecto corriendo localmente. 🎉
