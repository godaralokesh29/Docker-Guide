FROM node:22do    // this is base image which first fetched things from the docker hub  and then we can use it to build our own image on top of it
//here we fetch the node image from docker hub of node js and we use it further

WORKDIR /app   // this is the working directory where we will put our code and run our code source code docker image kaha likhna hai to humne workdir set kiya hai /app me to humara code waha pe hoga


COPY . . means bring all the files from current directory to the working directory in the docker image which is /app  but it has flaw that node modules will also be copied and it will increase the size of the image so we can use .dockerignore file to ignore node modules they should not be copied from host they should be installed in the docker image using npm install command use command and it will install the node modules in the docker image and it will not copy from host and it will reduce the size of the image or use .dockerignore file to ignore node modules and then copy package.json and package-lock.json files to the docker image and then run npm install command to install the node modules in the docker image and then copy the rest of the files to the docker image using COPY . . command
//similary copy /index.js /index.js means copy index.js file from current directory to the working directory in the docker image which is /app
RUN npm install   // this runs the command in docer image and it will install the node modules in the docker image

EXPOSE 3000  // this is the port on which our application will run in the docker container


the all obove this happens when we build the docker image using docker build command and then when we run the docker container using docker run command then it will start the application in the docker container and it will run on port 3000 and we can access it using localhost:3000 in our browser or postman or any other client to test our api endpoints



CMD ["node", "index.js"] //this is the command which will run when we start the docker container it will run node index.js command to start our application in the docker container

 container

 container

 container

 container

 container

 container

