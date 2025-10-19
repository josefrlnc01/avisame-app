# 📰 Avísame - Sistema de Monitoreo de Noticias

Avísame es una aplicación web que te permite monitorear temas de interés en tiempo real, notificándote cuando aparecen nuevas noticias relacionadas con tus intereses. La aplicación utiliza inteligencia artificial para analizar la relevancia de las noticias y mostrarte solo el contenido que realmente te interesa.

![Demo](https://via.placeholder.com/800x400.png?text=Avísame+Demo)

## 🚀 Características

- Búsqueda en tiempo real de noticias por temas de interés
- Análisis de relevancia utilizando embeddings y similitud de coseno
- Interfaz intuitiva y fácil de usar
- Actualización automática de noticias cada minuto
- Filtrado de noticias duplicadas
- Diseño responsivo

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18
- Vite
- TailwindCSS
- Context API para gestión de estado

### Backend
- Node.js
- Express
- LowDB (base de datos JSON)
- RSS Parser
- Transformers.js para embeddings

## 🚀 Instalación

### Requisitos Previos
- Node.js 16.x o superior
- npm o yarn

### Pasos de Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/josefrlnc01/avisame-app.git
   cd avisame-app
   ```

2. Instala las dependencias del frontend y del backend:
   ```bash
   # Instalar dependencias del frontend
   cd frontend
   npm install
   
   # Instalar dependencias del backend
   cd ../backend
   npm install
   ```

3. Configuración del entorno:
   - Crea un archivo `.env` en la carpeta del backend basado en `.env.example`
   - Configura las variables de entorno necesarias

## 🏃‍♂️ Ejecución

1. Inicia el servidor backend:
   ```bash
   cd backend
   npm start
   ```

2. En otra terminal, inicia el frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Abre tu navegador en [http://localhost:5173](http://localhost:5173)

## 🧪 Uso

1. Ingresa un tema de interés en el campo de búsqueda
2. La aplicación buscará noticias relacionadas automáticamente
3. Las noticias se actualizarán automáticamente cada minuto
4. Haz clic en cualquier noticia para ver el artículo completo

## 📂 Estructura del Proyecto

```
avisame-app/
├── backend/           # Código del servidor
│   ├── index.js      # Punto de entrada del servidor
│   └── db.json       # Base de datos (se crea automáticamente)
├── frontend/         # Aplicación React
│   ├── src/
│   │   ├── components/  # Componentes de React
│   │   └── context/     # Contextos de React
└── README.md         # Este archivo
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, lee las [pautas de contribución](CONTRIBUTING.md) antes de enviar un pull request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📬 Contacto

¿Tienes preguntas? No dudes en abrir un issue o contactar al equipo de desarrollo.
