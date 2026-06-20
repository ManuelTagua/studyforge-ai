# StudyForge AI

StudyForge AI es una aplicación web desarrollada como proyecto de aprendizaje que permite guardar apuntes de estudio y generar automáticamente contenido educativo mediante Inteligencia Artificial.

La aplicación permite crear temas manualmente o importar documentos PDF, almacenarlos en una base de datos y generar recursos de estudio como resúmenes, cuestionarios tipo test, flashcards y explicaciones simplificadas utilizando Google Gemini.

## Demo

https://studyforge.manueltagua.com

---

# Características

## Gestión de apuntes

- Creación manual de temas de estudio.
- Importación de documentos PDF.
- Almacenamiento persistente en MySQL.
- Visualización y consulta de apuntes guardados.
- Buscador de apuntes.
- Vista detallada de cada tema.

## Generación de contenido con IA

A partir del contenido almacenado se puede generar:

### Resumen

Genera un resumen estructurado con las ideas más importantes del contenido.

### Quiz

Genera preguntas tipo test con varias opciones de respuesta para practicar.

### Flashcards

Genera tarjetas de estudio para repasar conceptos clave.

### Explicación fácil

Reescribe el contenido utilizando un lenguaje más sencillo para facilitar la comprensión.

## Interfaz moderna

- Diseño responsive.
- Modo oscuro por defecto.
- Navegación sencilla.
- Experiencia optimizada para escritorio y dispositivos móviles.

---

# Tecnologías utilizadas

## Backend

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- MySQL
- Google Gemini API
- Apache PDFBox

## Frontend

- React
- Vite
- React Router
- JavaScript
- CSS

## Base de datos

- MySQL

---

# Arquitectura del proyecto

```text
studyforge-ai
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── model
│   ├── dto
│   └── config
│
├── frontend
│   ├── pages
│   ├── components
│   ├── api
│   └── styles
│
└── database
```

---

# Funcionalidades principales

## Crear un tema manualmente

El usuario introduce:

- Título
- Apuntes

La información se almacena automáticamente en la base de datos.

<img width="1895" height="910" alt="image" src="https://github.com/user-attachments/assets/50a6ddf7-459b-4f48-9bdd-37b876291a7b" />


---

## Importar un PDF

El usuario puede seleccionar un documento PDF.

La aplicación:

1. Extrae el texto.
2. Genera automáticamente un tema.
3. Lo almacena en la base de datos.
4. Permite utilizar todas las funciones de IA sobre ese contenido.

<img width="1918" height="914" alt="image" src="https://github.com/user-attachments/assets/5242c7ba-964e-4f78-ac8c-46ea1463337a" />


---

## Gestión de apuntes

Todos los temas creados aparecen en la sección de apuntes.

Desde ahí se puede:

- Buscar temas.
- Abrir apuntes.
- Consultar información guardada.

<img width="1916" height="911" alt="image" src="https://github.com/user-attachments/assets/4fd597e3-5794-4300-b249-cc178e98c2f3" />


---

## Vista detallada del tema

Cada tema dispone de una pantalla específica donde se muestra:

- Título
- Fecha de creación
- Texto original
- Herramientas de IA

<img width="1896" height="911" alt="image" src="https://github.com/user-attachments/assets/8f71f436-a7d9-44f4-8d7e-05c401f10c50" />


---

# Generación de contenido con IA

## Resumen automático

Genera un resumen estructurado del contenido.

<img width="750" height="863" alt="image" src="https://github.com/user-attachments/assets/c5d6c681-fd16-41da-b0aa-d36a097ce752" />


---

## Quiz automático

Genera preguntas tipo test para comprobar conocimientos.

Características:

- Varias respuestas posibles.
- Respuesta correcta identificada.
- Adaptado al contenido estudiado.

<img width="747" height="861" alt="image" src="https://github.com/user-attachments/assets/d276241d-69fe-4e86-835f-630efc65ffcf" />


---

## Flashcards

Genera tarjetas de estudio para memorizar conceptos importantes.

Características:

- Pregunta en una cara.
- Respuesta en la otra.
- Animación de giro.

<img width="741" height="855" alt="image" src="https://github.com/user-attachments/assets/19f73034-930e-45e3-a3f5-890b5858a8fd" />


---

## Explicación fácil

Convierte contenido complejo en una explicación sencilla.

Ideal para:

- Repasar.
- Entender conceptos difíciles.
- Aprendizaje rápido.

<img width="744" height="862" alt="image" src="https://github.com/user-attachments/assets/3e1b52a2-b6e8-4890-8af1-9f863c40bfd8" />


---

# Configuración de la API de Gemini

La aplicación utiliza Google Gemini mediante una variable de entorno.

## Variable necesaria

```bash
GEMINI_API_KEY=TU_API_KEY
```

## Configuración en Spring Boot

```properties
gemini.api.key=${GEMINI_API_KEY:}
```

De esta forma la clave no queda expuesta en el repositorio.

---

# Configuración de la base de datos

## application.properties

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/studyforge_ai_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

# Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/studyforge-ai.git
```

---

## 2. Configurar MySQL

Crear una instancia de MySQL local y ajustar las credenciales en:

```properties
application.properties
```

---

## 3. Configurar Gemini

Crear la variable de entorno:

```bash
GEMINI_API_KEY=TU_API_KEY
```

---

## 4. Ejecutar Backend

Desde la carpeta backend:

```bash
mvn spring-boot:run
```

La API quedará disponible en:

```text
http://localhost:8080
```

---

## 5. Ejecutar Frontend

Desde la carpeta frontend:

```bash
npm install
npm run dev
```

La aplicación quedará disponible en:

```text
http://localhost:5173
```

---

# Futuras mejoras

Posibles ampliaciones del proyecto:

- OCR para PDFs escaneados.
- Login y registro de usuarios.
- Sistema de favoritos.
- Estadísticas de estudio.
- Exportación de contenido.
- Generación de mapas conceptuales.
- Generación de exámenes completos.
- Despliegue en la nube.

---

# Despliegue

La aplicación se encuentra desplegada en la nube utilizando una arquitectura Full Stack:

- Frontend: Vercel
- Backend: Render
- Base de datos: Aiven MySQL Cloud
- IA: Google Gemini API

La comunicación entre servicios se realiza mediante API REST y variables de entorno seguras.

---

# Autor

Proyecto desarrollado por Manuel Tagua Pérez como proyecto de aprendizaje y portfolio de desarrollo Full Stack.

Tecnologías principales utilizadas:

- Java
- Spring Boot
- MySQL
- React
- Google Gemini
- PDFBox

---
