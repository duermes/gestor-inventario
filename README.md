pnpm install
npm install
para instalar modulos

El siguiente codigo es un prototipo de un gestor de inventario, futuros cambios realizados se estan haciendo en un repositorio privado. En caso alguien desee usar el codigo puede contactarme en discord como duermes.

## Base de datos
si es primera vez instalando el proyecto necesitas: npx prisma install y crear un archivo en my-app llamado .env DATABASE_URL="string de tu base de datos"
npx prisma migrate dev --name init
Whenever you update your Prisma schema, you will have to update your database schema using either prisma migrate dev or prisma db push.
