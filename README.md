# Docker Networking

## Why Docker Networks?

By default, every container runs in its own isolated environment.

A common misconception is:

```text
localhost = my machine
```

Inside Docker:

```text
localhost = the container itself
```

So if your Node.js backend tries to connect to:

```env
MONGO_URI=mongodb://localhost:27017/mydb
```

it will fail because:

```text
localhost refers to the backend container
NOT the MongoDB container
```

---

## Container Communication

Docker containers cannot directly communicate with each other unless:

1. They are attached to the same Docker network.
2. They know each other's container names.

Example:

```text
Backend Container
        |
        |
        v
Mongo Container
```

To enable this communication, both containers must be connected to the same network.

---

# Creating a Custom Network

Create a network:

```bash
docker network create my_custom_network
```

Verify:

```bash
docker network ls
```

Output:

```text
NETWORK ID     NAME
xxxxxxxxxx     bridge
xxxxxxxxxx     host
xxxxxxxxxx     my_custom_network
```

---

# Building the Application Image

Build the Node.js application image:

```bash
docker build -t image_tag .
```

Example:

```bash
docker build -t backend-app .
```

---

# Running the Backend Container

Attach it to the custom network:

```bash
docker run -d \
-p 3000:3000 \
--name backend \
--network my_custom_network \
image_tag
```

Example:

```bash
docker run -d \
-p 3000:3000 \
--name backend \
--network my_custom_network \
backend-app
```

---

# Running MongoDB on the Same Network

```bash
docker run -d \
-v volume_database:/data/db \
--name mongo \
--network my_custom_network \
-p 27017:27017 \
mongo
```

Explanation:

```text
-v volume_database:/data/db
```

Creates a Docker volume so MongoDB data persists even if the container is removed.

---

# Connecting Backend to MongoDB

Instead of:

```env
mongodb://localhost:27017/mydb
```

Use:

```env
mongodb://mongo:27017/mydb
```

Why?

Because Docker provides built-in DNS resolution.

The container name:

```text
mongo
```

automatically resolves to the MongoDB container's IP address.

---

## Example

Backend:

```env
MONGO_URI=mongodb://mongo:27017/mydb
```

Mongo Container:

```bash
docker run --name mongo ...
```

Docker automatically maps:

```text
mongo
   ↓
Mongo Container IP
```

No manual IP configuration needed.

---

# Verify Database Connection

Check logs:

```bash
docker logs backend
```

or

```bash
docker logs <container-id>
```

Successful connection example:

```text
MongoDB Connected Successfully
Server running on port 3000
```

---

# Testing the Application

Visit:

```text
http://localhost:3000
```

Try an API endpoint:

```text
http://localhost:3000/users
```

If the API successfully reads/writes data from MongoDB, networking is working correctly.

---

# Inspect a Network

View connected containers:

```bash
docker network inspect my_custom_network
```

Output:

```json
{
  "Containers": {
    "backend": {},
    "mongo": {}
  }
}
```

This confirms both containers are connected to the same network.

---

# Docker Volumes

Volumes allow data to persist even if containers are deleted.

Without volumes:

```text
Delete Container
       ↓
Data Lost
```

With volumes:

```text
Delete Container
       ↓
Data Remains
```

Create a volume:

```bash
docker volume create volume_database
```

List volumes:

```bash
docker volume ls
```

Inspect volume:

```bash
docker volume inspect volume_database
```

Remove volume:

```bash
docker volume rm volume_database
```

---

# Optimizing Build Time with Docker Cache

One of Docker's biggest advantages is layer caching.

Consider this Dockerfile:

```dockerfile
FROM node:22

WORKDIR /app

COPY . .

RUN npm install

CMD ["node", "index.js"]
```

Problem:

Whenever any source file changes:

```text
index.js
routes/
controllers/
```

Docker invalidates the COPY layer and reruns:

```bash
npm install
```

even when dependencies haven't changed.

---

## Better Dockerfile

```dockerfile
FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
```

---

## How Docker Caching Works

### First Build

```text
COPY package.json
RUN npm install
COPY source code
```

Everything executes.

---

### Later Build

Only source code changes:

```text
index.js modified
```

Docker sees:

```text
package.json unchanged
```

So it reuses:

```text
RUN npm install
```

from cache.

Only:

```text
COPY . .
```

runs again.

Result:

```text
Build Time ↓↓↓
```

---

## Layer Breakdown

```dockerfile
COPY package*.json ./
```

Layer 1

```dockerfile
RUN npm install
```

Layer 2

```dockerfile
COPY . .
```

Layer 3

If only application code changes:

```text
Layer 1 -> Cached
Layer 2 -> Cached
Layer 3 -> Rebuilt
```

---

## Even Better for Production

Instead of:

```dockerfile
RUN npm install
```

Use:

```dockerfile
RUN npm ci
```

Why?

```text
npm ci
```

- Faster
- Reproducible installs
- Uses package-lock.json exactly
- Preferred in CI/CD pipelines

Example:

```dockerfile
FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
```

---

# Types of Docker Networks

Docker supports multiple network drivers.

---

## 1. Bridge Network (Default)

Most commonly used.

When a container is started without specifying a network:

```bash
docker run nginx
```

Docker automatically attaches it to:

```text
bridge
```

Characteristics:

- Private internal network
- Containers on same bridge can communicate
- Network isolation from host

View default bridge:

```bash
docker network inspect bridge
```

---

## 2. Host Network

Uses host machine networking directly.

```bash
docker run --network host nginx
```

Characteristics:

- No network isolation
- No port mapping required
- Better performance
- Useful for high traffic applications

Example:

```text
Container Port 3000
       =
Host Port 3000
```

No need for:

```bash
-p 3000:3000
```

---

## 3. None Network

Completely disables networking.

```bash
docker run --network none nginx
```

Characteristics:

- No internet access
- No container communication
- Fully isolated

Useful for highly secure workloads.

---

## 4. Overlay Network

Used in Docker Swarm.

Allows communication across multiple Docker hosts.

```text
Server A
    |
    |
Overlay Network
    |
    |
Server B
```

Useful for distributed applications.

---

# Docker Compose (Recommended)

Managing multiple containers manually becomes difficult.

Instead of:

```bash
docker network create my_custom_network

docker run ...

docker run ...
```

Use Docker Compose.

Example:

```yaml
version: "3.9"

services:
  backend:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - mongo

  mongo:
    image: mongo
    volumes:
      - volume_database:/data/db

volumes:
  volume_database:
```

Start:

```bash
docker compose up
```

Stop:

```bash
docker compose down
```

Benefits:

- Single command startup
- Automatic networking
- Easier deployment
- Better project organization

---

# Complete Docker Workflow

```text
Write Dockerfile
        ↓
Build Image
        ↓
Create Network
        ↓
Run Mongo Container
        ↓
Run Backend Container
        ↓
Containers Communicate
        ↓
Expose Application
        ↓
Push Image to Docker Hub
```

---

# Final Quick Revision

```text
Dockerfile → Creates Image

Image → Blueprint

Container → Running Instance

COPY → Copies Files

RUN → Executes During Build

CMD → Executes During Startup

EXPOSE → Documents Port

WORKDIR → Working Directory

docker build → Build Image

docker run → Run Container

docker ps → View Containers

docker logs → View Logs

docker exec → Enter Container

docker network create → Create Network

docker network inspect → Inspect Network

docker volume create → Create Volume

docker push → Upload Image

localhost inside container
       ≠
localhost on host machine

Use container names for communication:
backend → mongo
```