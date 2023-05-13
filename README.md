<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Teslo API

1. Clonar proyecto
2. ```yarn install```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
4. Cambiar las variables de entorno
5. Levantar la base de datos
```
Correr Docker 
docker-compose up -d
```
Archivo Post para testear la base de datos atravez de Postman 
```
{
    "title":"Fabio DesarrolloBackend",
    "sizes": ["M","V","P"],
    "gender": "men",
    "slug":"HolaMundo",
    "price": 123
}
```
6. Levantar: ```yarn start:dev```