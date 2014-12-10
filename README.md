TIP Sistema GOYA
====

![Build Status](https://api.travis-ci.org/linaresmariano/goya.png?branch=master)


Instalar base de datos MYSQL y crear usuario 'root' con password 'root'

      sudo apt-get install mysql-server


Entrar a mysql y crear base de datos goya 
      
      mysql --user=root --password=root
      create database goya;


Instalar node y npm, necesarios para instalar y levantar el server

      sudo apt-get update && sudo apt-get install npm


Luego, clonar el proyecto y ejecutar en la carpeta raíz del proyecto

      npm install


Para levantar el server

      node app.js


O levantarlo con foreman

      foreman start
	  
	  
Para correr los tests

      npm -g install grunt-cli
      grunt runtests




