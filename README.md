# 🐳 Docker Notes for Node.js Applications

## 1. Basic Docker Commands

### Check Running Containers

```bash
docker ps
```

Shows all currently running containers.

---

### Run a Container from an Existing Image

```bash
docker run <image-name>
```

Example:

```bash
docker run hello-world
```

Docker creates and starts a container using the specified image.

---

# Understanding a Dockerfile

## Base Image

```dockerfile
FROM node:22
```

This is the base image.

* Docker first pulls the Node.js image from Docker Hub.
* We then build our own image on top of this image.
* Think of it as the operating system + Node.js already installed.

  <img width="1821" height="800" alt="image" src="https://github.com/user-attachments/assets/ec8a7dc4-921f-445c-be04-0421314e3107" />


---

## Working Directory

```dockerfile
WORKDIR /app
```

Sets the working directory inside the container.

Any future commands like:

```dockerfile
COPY
RUN
CMD
```

will execute relative to `/app`.

So our application source code will live inside:

```text
/app
```

---

## Copying Files

```dockerfile
COPY . .
```

Meaning:

```text
Current Project Folder (Host)
          ↓
      /app (Container)
```

This copies all files from the current directory into `/app`.

### Problem

It also copies:

```text
node_modules
.git
.env
```

which unnecessarily increases image size.

---

## Using .dockerignore

Create:

```text
.dockerignore
```

Example:

```text
node_modules
.git
.env
```

Now Docker will ignore these files/folders while copying.

---

## Better Approach

Instead of copying everything first:

```dockerfile
COPY package*.json ./

RUN npm install

COPY . .
```

Why?

1. Copy package files.
2. Install dependencies inside container.
3. Copy remaining source code.

Benefits:

* Smaller image size.
* Faster rebuilds due to Docker caching.
* Avoids copying host machine's `node_modules`.

---

## Installing Dependencies

```dockerfile
RUN npm install
```

Runs during image build.

Docker creates a layer where all dependencies are installed.

---

## Exposing a Port

```dockerfile
EXPOSE 3000
```

Indicates that the application listens on port:

```text
3000
```

inside the container.

This does **not** publish the port automatically.

---

## Starting the Application

```dockerfile
CMD ["node", "index.js"]
```

This command runs when the container starts.

Equivalent to:

```bash
node index.js
```

inside the container.

---

## Complete Example Dockerfile

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

# Build and Run Flow

## Step 1: Build Image

```bash
docker build -t hello_world .
```

Docker will:

1. Pull base image.
2. Create `/app`.
3. Copy files.
4. Install dependencies.
5. Create final image.

---

## Step 2: Run Container

```bash
docker run -p 3000:3000 hello_world
```

Port mapping:

```text
Host Machine : 3000
       ↓
Container    : 3000
```

Now visit:

```text
http://localhost:3000
```

---

# Passing Environment Variables

## During Container Runtime

```bash
docker run -p 3000:3000 \
-e DATABASE_URL=lokesh@localhost:2020 \
hello_world
```

Example access:

```javascript
process.env.DATABASE_URL
```

---

## Using an Environment File

Create:

```text
.env
```

```env
DATABASE_URL=lokesh@localhost:2020
JWT_SECRET=mysecret
```

Run:

```bash
docker run --env-file .env -p 3000:3000 hello_world
```

---

## Using ENV in Dockerfile

```dockerfile
ENV PORT=3000
```

Access:

```javascript
process.env.PORT
```

---

# Accessing the Container Terminal

Sometimes you want to enter the running container and execute commands.

First find container id:

```bash
docker ps
```

Example:

```text
CONTAINER ID
bf94a24ec2f3
```

Enter the container:

```bash
docker exec -it bf94a24ec2f3 sh
```

For Ubuntu-based images:

```bash
docker exec -it bf94a24ec2f3 bash
```

Now you are inside the container shell.

Useful commands:

```bash
ls
pwd
node -v
npm -v
```

Exit:

```bash
exit
```

---

# Pushing Images to Docker Hub

This allows anyone to pull and run your application.

---

## Step 1: Create Docker Hub Account

Go to Docker Hub and create an account.

It works similarly to GitHub:

* Repositories
* Images
* Public/Private repos

---

## Step 2: Login

```bash
docker login
```

Enter:

```text
Username
Password
```

---

## Step 3: Build Image with Docker Hub Username

```bash
docker build -t godaralokesh/first-docker-repo .
```

Format:

```text
dockerhub-username/repository-name
```

Example:

```text
godaralokesh/first-docker-repo
```

---

## Step 4: Push Image

```bash
docker push godaralokesh/first-docker-repo
```

Docker uploads all image layers to Docker Hub.

---

## Step 5: Anyone Can Run It

Pull image:

```bash
docker pull godaralokesh/first-docker-repo
```

Run image:

```bash
docker run -p 3000:3000 godaralokesh/first-docker-repo
```

Or directly:

```bash
docker run -p 3000:3000 godaralokesh/first-docker-repo
```

Docker automatically pulls the image if it does not exist locally.

---

# Useful Docker Commands

## List Images

```bash
docker images
```

---

## List Running Containers

```bash
docker ps
```

---

## List All Containers

```bash
docker ps -a
```

---

## Stop a Container

```bash
docker stop <container-id>
```

Example:

```bash
docker stop bf94a24ec2f3
```

---

## Remove a Container

```bash
docker rm <container-id>
```

---

## Remove an Image

```bash
docker rmi <image-id>
```

---

## View Container Logs

```bash
docker logs <container-id>
```

---

## Build Image

```bash
docker build -t image-name .
```

---

## Run Container

```bash
docker run -p hostPort:containerPort image-name
```

Example:

```bash
docker run -p 3000:3000 hello_world
```

---

# Quick Summary

```text
Dockerfile → Build Image → Run Container

FROM      → Base Image
WORKDIR   → Working Directory
COPY      → Copy Files
RUN       → Execute Command During Build
EXPOSE    → Document Port
CMD       → Start Application

docker build → Creates Image
docker run   → Creates Container
docker ps    → Shows Running Containers
docker exec  → Enter Container
docker push  → Upload Image to Docker Hub
```
