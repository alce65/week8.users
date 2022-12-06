# Bootcamp 2022-05

index.ts
app.ts
/db/mongoose.ts
/interfaces
/services

/routers

-   instancian el controller inyectándole un Modelo
-   definen las sub-rutas/métodos asignándoles sus middlewares(interceptores y controllers)

/controllers

-   configuran la respuesta express
-   utilizan el modelo para hacer operaciones en la DB

/middleware

-   filtran la posible respuesta express
-   incorporan información extra en la request
-   si es necesario, utilizan el modelo para hacer operaciones en la DB
    /models

# Bootcamp 2022-10

index.ts - servidor node HTTP
config.ts - lectura de datos desde dotenv
db.connect.ts - conexión a mongoDb mediante mongoose
app.ts - aplicación express - middlewares de configuración - discrimina las rutas iniciales y llama al **router** adecuado - middleware de errores

/interfaces
/services: la **S** de **S**OLID: Single Responsibility

**/routers**

-   instancian el **Controller** inyectándole un **Repositorio**
-   definen las [sub-rutas/métodos HTTP] propios de un API Rest
-   asignándoles sus middlewares (interceptores y controllers)

-   Decisiones de diseño
    -   OOP
    -   la **D** de SOLI**D**: Dependency Inversion (Injection)
        => Instancias Singleton de los repositorios

**/controllers**

-   configuran la respuesta Express -> json
-   utilizan el **repositorio** para solicitar operaciones en los datos (e.g. DB)

-   Decisión de diseño
    -   Totalmente separados controller (Express) y repositorios (Mongoose)
        la **S** de **S**OLID: Single Responsibility

**/middlewares**

-   filtran la posible respuesta Express
-   incorporan información extra en la request (e.g payload)
-   si es necesario, utilizan el **repositorio** para solicitar operaciones en los datos (e.g. DB)

**/repositories**

-   realizan operaciones sobre los datos (e.g. MongoDB)
-   se instancián de acuerdo con el patrón Singleton
-   implementan interfaces válidos de cualquier repositorio de datos
-   concretan los tipos genéricos definidos en esos interfaces
-   sus métodos devuelven Promesas de los interfaces de los datos (no exponen hacia el exterior la implementación de Mongoose)
-   se testean junto con los modelos de mongoose usando un DB de testing

-   Decisión de diseño
    -   Repositorios basados en interfaces
        => La **L** de SO**L**ID: Liskov Substitution Principle¡

**/entities**

    -   definen los tipos de datos
    -   definen los esquemas de Mongoose
    -   definen los modelos de Mongoose

    Acoplado a Mongoose (ODM) [equivalente en SQL: Sequelize (ORM)]

    -   Schema: definición del contenido de los documentos de MongoDB

que se agrupan para formar las colecciones - Modelo: representa la conexión con la colección y todas las operaciones que se pueden realizar en ella - Nombre (e.g. Robot) - Esquema (e.g robotSchema) - Colección (e.g robots)
