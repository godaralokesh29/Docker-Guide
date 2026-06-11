##Manual installation
-intall nodejs locally
-clone the repo
-npm install
-start the database
  - docker run -r POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
-change the .env file to the db url 
-npx prisma migrate dev
-npx prisma generate 
-npm run build
-npm run start



##Docker Installation
-install docker 
-start postgress
  -  docker run -r POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
-build the image - `docker build -t user_project`
-start the image - `docker run -p3000:3000 user_project`
  

##Docker Compose
-install docker 
-run `docker compose up`