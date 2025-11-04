# Choppi App
## URLs públicas

Frontend: https://fe-choppi.vercel.app/

Backend (API/Swagger): https://be-choppi.onrender.com/api (Swagger disponible en https://be-choppi.onrender.com/api)

## Demo user

Puedes probar la aplicación con el siguiente usuario demo:

Email: demo@choppi.test

Password: Password123!

## Repositorios

Backend: https://github.com/BBrendaBaumann/be-choppi

Frontend: https://github.com/BBrendaBaumann/fe-choppi

# Setup local

Frontend

## Clonar el repositorio:

git clone https://github.com/BBrendaBaumann/fe-choppi.git
cd fe-choppi


## Instalar dependencias:

npm install


## Copiar archivo de variables de entorno:

cp .env.example .env


## Configurar las variables de entorno en .env:

NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_EMAIL=demo@choppi.test
NEXT_PUBLIC_DEMO_PASSWORD=Password123!


## Levantar el frontend:

npm run dev


El frontend estará disponible en http://localhost:3000

## Despliegue

Frontend (Vercel)

El frontend está desplegado en Vercel: https://fe-choppi.vercel.app/

Asegúrate de configurar NEXT_PUBLIC_API_URL apuntando al backend desplegado (https://be-choppi.onrender.com).

