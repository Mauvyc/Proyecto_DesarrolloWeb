# Plan de Eliminación y Reorganización de Archivos

## Estructura General

El proyecto debe tener dos carpetas principales:

1. **backend/** - Todo el código del servidor
2. **seguros-react/** - Todo el código del frontend

## Diagnóstico de la Situación Actual

- Los archivos y carpetas en el directorio raíz (`index.js`, `routes/`, `controllers/`, `models/`, etc.) son **versiones refactorizadas** siguiendo el patrón MVC
- En `backend/` están las versiones originales del código sin refactorizar completamente
- En `seguros-react/` está el frontend React, que también ha sido refactorizado

## Plan de Acción

### 1. Asegurar el Frontend (seguros-react)

#### Archivos ya eliminados:
- ✅ `src/App.css` (movido a `src/views/styles/App.css`)
- ✅ `src/index.css` (movido a `src/views/styles/index.css`)

#### Directorios a eliminar en seguros-react:
- `src/components/` (contenido ya copiado a `src/views/components/`)
- `src/pages/` (contenido ya copiado a `src/views/pages/`)

### 2. Reorganizar el Backend

#### Opción recomendada: Reemplazar el backend con la versión refactorizada

1. Hacer un respaldo de la carpeta `backend/` actual
2. Copiar todo el contenido del directorio raíz que corresponde al backend a `backend/`
   - `index.js`
   - `routes/`
   - `controllers/`
   - `models/`
   - `views/`
   - `utils/`
   - `config/`

#### Archivos a eliminar en backend después de la migración:
- `config.js` (reemplazado por `config/config.js`)
- `db.js` (reemplazado por `utils/db.js`)
- `middlewares/` (reemplazado por `utils/authUtils.js`)

### 3. Limpiar el Directorio Raíz

Después de asegurar que todo funciona correctamente, eliminar las carpetas refactorizadas del directorio raíz:
- `index.js`
- `routes/`
- `controllers/`
- `models/`
- `views/`
- `utils/`
- `config/`

## Paso a Paso para la Reorganización:

1. **Hacer un respaldo completo** del proyecto
2. **Limpiar el frontend**:
   - Eliminar directorios redundantes en seguros-react
3. **Reorganizar el backend**:
   - Hacer copia de seguridad de la carpeta backend
   - Mover los archivos refactorizados del raíz a backend
4. **Verificar funcionamiento**:
   - Probar que el backend funcione correctamente
   - Probar que el frontend siga funcionando
5. **Limpiar el directorio raíz**:
   - Eliminar archivos y carpetas que ya se han movido

## Comandos para la Reorganización:

```powershell
# 1. Respaldo del proyecto (opcional si ya usas git)
# Copia-Item -Path "*" -Destination "../backup-seguros-flex" -Recurse

# 2. Limpiar el frontend
Remove-Item -Path "seguros-react/src/components" -Recurse
Remove-Item -Path "seguros-react/src/pages" -Recurse

# 3. Hacer respaldo del backend actual
Copy-Item -Path "backend" -Destination "backend-original" -Recurse

# 4. Mover archivos refactorizados al backend
# Primero copiar index.js
Copy-Item -Path "index.js" -Destination "backend/index.js" -Force

# Luego copiar carpetas, sobreescribiendo las existentes
Copy-Item -Path "routes/*" -Destination "backend/routes/" -Recurse -Force
Copy-Item -Path "controllers/*" -Destination "backend/controllers/" -Recurse -Force
Copy-Item -Path "models/*" -Destination "backend/models/" -Recurse -Force
Copy-Item -Path "views/*" -Destination "backend/views/" -Recurse -Force
Copy-Item -Path "utils/*" -Destination "backend/utils/" -Recurse -Force
Copy-Item -Path "config/*" -Destination "backend/config/" -Recurse -Force

# 5. Eliminar archivos redundantes en backend
Remove-Item -Path "backend/config.js" -Force
Remove-Item -Path "backend/db.js" -Force
Remove-Item -Path "backend/middlewares" -Recurse -Force

# 6. Después de verificar que todo funciona, eliminar las carpetas del directorio raíz
Remove-Item -Path "index.js" -Force
Remove-Item -Path "routes" -Recurse -Force
Remove-Item -Path "controllers" -Recurse -Force
Remove-Item -Path "models" -Recurse -Force
Remove-Item -Path "views" -Recurse -Force
Remove-Item -Path "utils" -Recurse -Force
Remove-Item -Path "config" -Recurse -Force
```

⚠️ **IMPORTANTE**:
1. Realiza un respaldo completo o commit antes de ejecutar estos comandos
2. Prueba la aplicación después de cada paso importante
3. Si algo falla, puedes restaurar desde tu respaldo 