# Serve Node-Express-TypeScrip-Jest - Robots + User by JWT

## Modelo de datos

**User** - name string; - email string; - passwd string; - role: string; - robots: Array<`id.robot`>;

**Robot** - name string (nombre) - image string (imagen: URL de internet) - speed number (velocidad: 0-10) - resistance number (resistencia: 0-10) - date Date (fecha de creación) - owner `id.user` (usuario que crea el robot)

## Endpoints

Tendrás que crear una API REST con Express, con los siguientes endpoints:

/users
[POST]/register
[POST]/login

/robots
[GET]/ -> devuelve un array con todos los robots de la BD
[GET]/:id -> devuelve un robot de la BD por id
[POST]/ -> recibe un robot (sin id), lo crea en la BD y devuelve el robot recién creado
[PATCH]/:id -> recibe un robot, modifica en la BD el robot con la misma id que el recibido, y devuelve el robot modificado
[DELETE]/:id -> elimina de la BD un robot por id y devuelve un objeto con la id

Recuerda que cada response debe ir con un código de status adecuado y que todos los body de las responses tienen que ser **objetos** en JSON.

**TESTEAMOS** todo y lo mostramos en **SonarCloud**.

## Frontend - Robots

Tendrás que crear un **frontend** en React (con Redux) que permita al usuario gestionar un listado con sus robots. El usuario debe poder listar, crear, modificar y borrar robots.
