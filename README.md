# 🧪 OlaClick Backend Challenge - API de Gestión de Órdenes

## 📋 Descripción

API RESTful desarrollada con NestJS para gestionar órdenes de un restaurante. Implementa un sistema completo con arquitectura modular, cache con Redis, base de datos PostgreSQL y contenerización con Docker.

## 🛠️ Stack Tecnológico

- **Node.js + TypeScript**
- **NestJS** (arquitectura modular y principios SOLID)
- **Sequelize** (ORM)
- **PostgreSQL** como base de datos
- **Redis** para cache
- **Docker** para contenerización
- **Jest** para pruebas

## 🚀 Instalación y Configuración

### Prerrequisitos

- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)

### Ejecutar con Docker Compose

1. Clona el repositorio:

```bash
git clone <repository-url>
cd challenge-olaclick-2025
```

2. Ejecuta la aplicación con Docker Compose:

```bash
docker-compose up -d
```

3. La aplicación estará disponible en: `http://localhost:3000`

### Ejecutar en modo desarrollo

1. Instala las dependencias:

```bash
npm install
```

2. Configura las variables de entorno (asegúrate de tener PostgreSQL y Redis ejecutándose):

```bash
# Configurar conexión a base de datos y Redis
```

3. Ejecuta en modo desarrollo:

```bash
npm run start:dev
```

## 📚 API Endpoints

### 1. Health Check

Verifica el estado de la aplicación.

**Endpoint:** `GET /health`

**Ejemplo con curl:**

```bash
curl -X GET http://localhost:3000/health
```

**Respuesta:**

```json
{
  "status": "ok",
  "timestamp": "2025-09-16T10:30:00.000Z",
  "uptime": 123.456
}
```

### 2. Listar Órdenes Activas

Obtiene todas las órdenes con estado diferente de `delivered`. Los resultados se cachean en Redis por 30 segundos.

**Endpoint:** `GET /orders`

**Ejemplo con curl:**

```bash
curl -X GET http://localhost:3000/orders
```

**Respuesta:**

```json
[
  {
    "id": 1,
    "clientName": "Ana López",
    "items": [
      {
        "id": 1,
        "description": "Ceviche",
        "quantity": 2,
        "unitPrice": 50
      }
    ],
    "status": "initiated",
    "createdAt": "2025-09-16T10:00:00.000Z"
  },
  {
    "id": 2,
    "clientName": "Carlos Ruiz",
    "items": [
      {
        "id": 2,
        "description": "Chicha morada",
        "quantity": 1,
        "unitPrice": 10
      }
    ],
    "status": "sent",
    "createdAt": "2025-09-16T09:45:00.000Z"
  }
]
```

### 3. Crear Nueva Orden

Crea una nueva orden en estado `initiated`.

**Endpoint:** `POST /orders`

**Ejemplo con curl:**

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Ana López",
    "items": [
      {
        "description": "Ceviche",
        "quantity": 2,
        "unitPrice": 50
      },
      {
        "description": "Chicha morada",
        "quantity": 1,
        "unitPrice": 10
      }
    ]
  }'
```

**Respuesta:**

```json
{
  "id": 3,
  "clientName": "Ana López",
  "status": "initiated",
  "createdAt": "2025-09-16T10:30:00.000Z",
  "items": [
    {
      "id": 5,
      "description": "Ceviche",
      "quantity": 2,
      "unitPrice": 50,
      "orderId": 3
    },
    {
      "id": 6,
      "description": "Chicha morada",
      "quantity": 1,
      "unitPrice": 10,
      "orderId": 3
    }
  ]
}
```

### 4. Ver Detalle de Orden

Obtiene los detalles completos de una orden específica, incluyendo todos sus items.

**Endpoint:** `GET /orders/:id`

**Ejemplo con curl:**

```bash
curl -X GET http://localhost:3000/orders/1
```

**Respuesta:**

```json
{
  "id": 1,
  "clientName": "Ana López",
  "status": "initiated",
  "createdAt": "2025-09-16T10:00:00.000Z",
  "updatedAt": "2025-09-16T10:00:00.000Z",
  "items": [
    {
      "id": 1,
      "description": "Ceviche",
      "quantity": 2,
      "unitPrice": 50,
      "orderId": 1
    },
    {
      "id": 2,
      "description": "Chicha morada",
      "quantity": 1,
      "unitPrice": 10,
      "orderId": 1
    }
  ]
}
```

### 5. Avanzar Estado de Orden

Avanza el estado de una orden siguiendo el flujo: `initiated → sent → delivered`

**Endpoint:** `POST /orders/:id/advance`

**Ejemplo con curl:**

```bash
curl -X POST http://localhost:3000/orders/1/advance
```

**Respuesta (orden avanzada a 'sent'):**

```json
{
  "id": 1,
  "clientName": "Ana López",
  "status": "sent",
  "createdAt": "2025-09-16T10:00:00.000Z",
  "updatedAt": "2025-09-16T10:35:00.000Z"
}
```

**Nota:** Cuando una orden llega al estado `delivered`, se elimina automáticamente de la base de datos y del cache.

## 🏗️ Arquitectura

### Estructura del Proyecto

```
src/
├── modules/
│   └── orders/
│       ├── dto/
│       │   └── create-order.dto.ts
│       ├── entities/
│       │   ├── order.entity.ts
│       │   ├── order-items.entity.ts
│       │   └── order-status.enum.ts
│       ├── orders.controller.ts
│       ├── orders.service.ts
│       ├── orders.repository.ts
│       ├── orders.module.ts
│       └── orders.provider.ts
├── cache/
│   ├── cache.module.ts
│   └── cache.service.ts
├── database/
│   ├── database.module.ts
│   └── database.providers.ts
├── health.controller.ts
├── app.module.ts
└── main.ts
```

### Estados de Orden

- **initiated**: Orden creada inicialmente
- **sent**: Orden enviada a la cocina
- **delivered**: Orden entregada (se elimina del sistema)

### Cache

- Las órdenes activas se cachean en Redis por 30 segundos
- El cache se invalida automáticamente cuando se crean o modifican órdenes

## 🧪 Pruebas

La aplicación incluye pruebas automatizadas para garantizar la funcionalidad correcta de los endpoints.

### Pruebas E2E (End-to-End)

Se incluye un test e2e completo para el endpoint de health check que verifica:

- El estado HTTP 200
- La estructura correcta de la respuesta
- Los tipos de datos apropiados
- El formato ISO del timestamp

### Comandos de pruebas

```bash
# Ejecutar pruebas unitarias
npm run test

# Ejecutar pruebas e2e (requiere base de datos activa)
npm run test:e2e
```

**Nota importante:** Las pruebas e2e requieren que PostgreSQL y Redis estén ejecutándose. Si usas Docker Compose, ejecuta primero:

```bash
docker-compose up -d postgres redis
```

## 🐳 Docker

### Servicios incluidos en docker-compose.yml:

- **app**: Aplicación NestJS (puerto 3000)
- **postgres**: Base de datos PostgreSQL (puerto 5432)
- **redis**: Cache Redis (puerto 6379)

### Comandos útiles:

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Detener servicios
docker-compose down

# Reconstruir imagen
docker-compose up --build
```

## 🔧 Consideraciones Técnicas

### Validaciones

- DTOs con decoradores de `class-validator`
- Validación automática de pipes de NestJS
- Manejo estructurado de errores con filtros de excepción

### Cache Strategy

- Cache de órdenes activas por 30 segundos
- Invalidación automática en operaciones CUD
- Fallback a base de datos si cache falla

## ❓ Preguntas de Arquitectura

### ¿Cómo desacoplarías la lógica de negocio del framework NestJS?

1. **Capa de Dominio**: Crear entidades de dominio puras sin dependencias del framework
2. **Puertos y Adaptadores**: Implementar interfaces para repositorios y servicios externos
3. **Casos de Uso**: Separar la lógica de negocio en casos de uso independientes
4. **Inversión de Dependencias**: Usar interfaces para desacoplar implementaciones concretas

### ¿Cómo escalarías esta API para soportar miles de órdenes concurrentes?

1. **Horizontal Scaling**: Múltiples instancias de la aplicación con load balancer
2. **Database Optimization**:
   - Índices en campos frecuentemente consultados
   - Read replicas para consultas
   - Particionamiento de tablas por fecha
3. **Cache Strategy**:
   - Cache distribuido con Redis Cluster
   - Cache de aplicación con TTL inteligente
4. **Message Queues**: Procesar operaciones asíncronas con Bull/Redis
5. **CDN**: Cache de respuestas estáticas
6. **Monitoring**: APM para identificar cuellos de botella

### ¿Qué ventajas ofrece Redis en este caso y qué alternativas considerarías?

**Ventajas de Redis:**

- Velocidad extrema (operaciones en memoria)
- Estructuras de datos avanzadas
- Persistencia configurable
- Pub/Sub para eventos en tiempo real
- Cluster mode para alta disponibilidad

**Alternativas:**

- **Memcached**: Más simple, mejor para cache puro
- **Hazelcast**: Cache distribuido con capacidades de computación
- **Apache Ignite**: Plataforma de datos en memoria
- **Database Cache**: Cache a nivel de base de datos (PostgreSQL shared_buffers)

## 📝 Scripts Disponibles

```bash
npm run build          # Compilar aplicación
npm run start:dev      # Ejecutar en desarrollo
npm run lint           # Linter de código
npm run format         # Formatear código
npm run test           # Pruebas unitarias
npm run test:e2e       # Pruebas end-to-end
```
