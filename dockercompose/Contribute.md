## Manual installation
 - Install nodejs locally ()
 - Clone the repo
 - Install dependencies (npm install)
 - Start the DB locally
    - docker run -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
    - Go to neon.tech and get yourself a new DB
 - Change the .env file and update your DB credentials
 - npx prisma migrate
 - npx prisma generate
 - npm run build
 - npm run start

 ## Docker installation
 - Install docker
 - Create a network - docker network create user_project //here we need to interact with postgress as we have to generate the prisma client those are first generated in backend hence interaction is important hence we need to setup the network between backend container and postgress container during the build .. 

 - Start postgres
    -  docker run --network user_project --name postgres -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
 - Build the image - `docker build --network=host -t user-project .`
 ![alt text](image-2.png)

![alt text](image-3.png)
 - Start the image - `docker run -e DATABASE_URL=postgresql://postgres:mysecretpassword@postgres:5432/postgres --network user_project -p 3000:3000 user-project`


 ## Docker Compose installation steps
 - Install docker, docker-compose
 - Run `docker-compose up`