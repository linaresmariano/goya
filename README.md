TIP Sistema GOYA
====

![Build Status](https://api.travis-ci.org/linaresmariano/goya.png?branch=master)


Instalar base de datos MYSQL y crear usuario 'root' con password 'root'

      sudo apt-get install mysql-server
      
Crear base de datos goya 

      create database goya;


Luego clonar el proyecto, y ejecutar

      npm install



Para levantar el server

      node app.js



O levantarlo con foreman

      foreman start
	  
	  
Para correr los tests

      npm -g install grunt-cli
      grunt runtests




