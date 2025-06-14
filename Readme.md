# Proyecto Real Estate

Este proyecto es una aplicación web para la gestión de proyectos inmobiliarios, clientes y unidades, desarrollada con **Laravel Lumen** (backend/API), **React** (frontend) y **Docker** para facilitar el despliegue y desarrollo local.

## Documentación de la API

La documentación de la API está disponible en Postman:
https://documenter.getpostman.com/view/45554155/2sB2x6kXL9

---

## Requisitos previos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado en Windows, Mac o Linux.
- (Opcional) [Git](https://git-scm.com/) para clonar el repositorio.

---

## Estructura del proyecto
- `backend-laravel/`: Backend API (Laravel Lumen)
- `frontend-react/`: Frontend SPA (React + Vite)
- `docker/docker-compose.yml`: Orquestador de servicios

---

## Instalación y uso rápido con Docker

1. **Clona el repositorio:**
   ```powershell
   git clone <URL-del-repositorio>
   cd proyecto-realestate
   ```

2. **Copia los archivos de entorno:**
   - Backend: `cp backend-laravel\.env.example backend-laravel\.env`
   - Frontend: crea `.env` si necesitas variables personalizadas.

3. **Levanta los servicios:**
   ```powershell
   docker compose -f docker\docker-compose.yml up --build -d
   ```
   Esto inicia:
   - Backend (Laravel Lumen) en [http://localhost:8000](http://localhost:8000)
   - Frontend (React) en [http://localhost:5173](http://localhost:5173)
   - Base de datos PostgreSQL en el contenedor `db`

4. **Instala dependencias y ejecuta migraciones (solo la primera vez):**
   ```powershell
   docker exec -it backend-laravel bash
   composer install
   php artisan migrate --seed
   exit
   ```

5. **Accede a la aplicación:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend/API: [http://localhost:8000](http://localhost:8000)

6. **Detén los servicios:**
   ```powershell
   docker compose -f docker\docker-compose.yml down
   ```

---

## Uso sin Docker (opcional)

### Backend
1. Instala PHP 8.2+, Composer y PostgreSQL localmente.
2. Copia `.env.example` a `.env` y configura la conexión a la base de datos.
3. Instala dependencias:
   ```powershell
   cd backend-laravel
   composer install
   php artisan migrate --seed
   php -S localhost:8000 -t public
   ```

### Frontend
1. Instala Node.js 20+ y npm.
2. Instala dependencias:
   ```powershell
   cd frontend-react
   npm install
   npm run dev
   ```

## Pruebas unitarias

Para ejecutar las pruebas del backend:
```powershell
cd backend-laravel
# Si usas Docker:
docker exec -it backend-laravel vendor/bin/phpunit --testdox
# O localmente:
vendor\bin\phpunit --testdox


## Notas
- Los datos de la base de datos se almacenan en el volumen Docker `db_data`.
- Puedes gestionar la base de datos con herramientas como pgAdmin.
- El frontend y backend están desacoplados y se comunican vía API REST.