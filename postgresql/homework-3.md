#Домашнее задание

###Установка и настройка PostgteSQL в контейнере Docker

#####Задание:
Цель:
- установить PostgreSQL в Docker контейнере
- настроить контейнер для внешнего подключения
- сделать в GCE инстанс с Ubuntu 20.04
- поставить на нем Docker Engine 

> sudo apt-get install \
>     apt-transport-https \
>     ca-certificates \
>     curl \
>     gnupg-agent \
>     software-properties-common
> curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
> echo \
>   "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
>   $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
> sudo apt-get update
> sudo apt-get install docker-ce docker-ce-cli containerd.io


- сделать каталог /var/lib/postgres

> sudo mkdir /var/lib/postgres
  
- развернуть контейнер с PostgreSQL 13 смонтировав в него /var/lib/postgres

> sudo  docker run --name pg-docker --network pg-net -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 -v /var/lib/postgres:/var/lib/postgresql/data postgres:13  


** Создался контейнер: afcf5abfef86befd5abf8f4194a132be64b739daa785d9042ebdc3b04511f8ef **

- развернуть контейнер с клиентом postgres 
  
> sudo docker run -it --rm --network pg-net --name pg-client postgres:13 psql -h pg-docker -U postgres

- подключится из контейнера с клиентом к контейнеру с сервером и сделать таблицу с парой строк

``` postgresql
postgres=# \l
List of databases
Name    |  Owner   | Encoding |  Collate   |   Ctype    |   Access privileges   
-----------+----------+----------+------------+------------+-----------------------
postgres  | postgres | UTF8     | en_US.utf8 | en_US.utf8 |
template0 | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
|          |          |            |            | postgres=CTc/postgres
template1 | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
|          |          |            |            | postgres=CTc/postgres
(3 rows)

```

``` postgresql
postgres=# create database students;
CREATE DATABASE

postgres=# \l
                                 List of databases
   Name    |  Owner   | Encoding |  Collate   |   Ctype    |   Access privileges   
-----------+----------+----------+------------+------------+-----------------------
 postgres  | postgres | UTF8     | en_US.utf8 | en_US.utf8 | 
 school  | postgres | UTF8     | en_US.utf8 | en_US.utf8 | 
 template0 | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
           |          |          |            |            | postgres=CTc/postgres
 template1 | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
           |          |          |            |            | postgres=CTc/postgres
(4 rows)

postgres=# \c school ;

school=# create table students (name varchar(70), surname varchar(75));
CREATE TABLE
school=# insert  into students values ('ivanov' ,'ivan');
INSERT 0 1
school=# insert  into students values ('petrov' ,'petr');
INSERT 0 1

school=# select * from students ;
  name  | surname 
--------+---------
 ivanov | ivan
 petrov | petr
(2 rows)

```

- подключится к контейнеру с сервером с ноутбука/компьютера извне инстансов GCP 
- удалить контейнер с сервером 
  ```
  sudo docker ps -a
  
  CONTAINER ID   IMAGE         COMMAND                  CREATED       STATUS         PORTS                                       NAMES
  
  afcf5abfef86   postgres:13   "docker-entrypoint.s…"   4 hours ago   Up 3 seconds   0.0.0.0:5432->5432/tcp, :::5432->5432/tcp   pg-docker
  
  sudo docker stop afcf5abfef86 
  afcf5abfef86
  
  sudo docker rm afcf5abfef86
  afcf5abfef86
  
  
  ```
- создать его заново 

    ```
    sudo  docker run --name pg-docker --network pg-net -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 -v /var/lib/postgres:/var/lib/postgresql/data postgres:13
  
    56e4e7a33e92fa0b70b04ac38783af6e33649a12529592f44e2e0f424b88874e
    ```

- подключится снова из контейнера с клиентом к контейнеру с сервером

    ``sudo docker run -it --rm --network pg-net --name pg-client postgres:13 psql -h pg-docker -U postgres``


  
- проверить, что данные остались на месте
  
``` postgresql
postgres=# \l
                                 List of databases
   Name    |  Owner   | Encoding |  Collate   |   Ctype    |   Access privileges   
-----------+----------+----------+------------+------------+-----------------------
 postgres  | postgres | UTF8     | en_US.utf8 | en_US.utf8 | 
 school    | postgres | UTF8     | en_US.utf8 | en_US.utf8 | 
 template0 | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
           |          |          |            |            | postgres=CTc/postgres
 template1 | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
           |          |          |            |            | postgres=CTc/postgres
(4 rows)


```

``` postgresql
postgres=# \c school ;
You are now connected to database "school" as user "postgres".
school=# \dt
          List of relations
 Schema |   Name   | Type  |  Owner   
--------+----------+-------+----------
 public | students | table | postgres
(1 row)

school=# select * from students ;
  name  | surname 
--------+---------
 ivanov | ivan
 petrov | petr
(2 rows)


```

- оставляйте в ЛК ДЗ комментарии что и как вы делали и как боролись с проблемами
