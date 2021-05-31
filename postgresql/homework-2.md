#Домашнее задание

###Установка и настройка PostgreSQL

#####Задание:
Цель:
- создавать дополнительный диск для уже существующей виртуальной машины,
  размечать его и делать на нем файловую систему
-  переносить содержимое базы данных PostgreSQL на дополнительный диск
-  переносить содержимое БД PostgreSQL между виртуальными машинами

##### Шаги:
- Создайте виртуальную машину c Ubuntu 20.04 LTS (bionic) в GCE типа e2-medium в default VPC в любом регионе и зоне, например us-central1-a
- поставьте на нее PostgreSQL через sudo apt
- проверьте что кластер запущен через sudo -u postgres pg_lsclusters
  > andrey@instance-2:~$ pg_lsclusters
  > 
  > Ver Cluster Port Status Owner    Data directory              Log file
  > 
  > 13  main    5432 online postgres /var/lib/postgresql/13/main /var/log/postgresql/postgresql-13-main.log
- зайдите из под пользователя postgres в psql и сделайте произвольную таблицу с произвольным содержимым postgres=# create table test(c1 text); postgres=# insert into test values('1'); \q
  ``` postgresql
  
    postgres=# create table test(s text);
    CREATE TABLE
    postgres=# insert into test values ('Lorem Ipsum');
    INSERT 0 1
    postgres=# select * from test ;
      s      
    -------------
    Lorem Ipsum
    (1 row)
  
  ```
- остановите postgres например через sudo -u postgres pg_ctlcluster 13 main stop
- создайте новый standard persistent диск GKE через Compute Engine -> Disks в том же регионе и зоне что GCE инстанс размером например 10GB
- добавьте свеже-созданный диск к виртуальной машине - надо зайти в режим ее редактирования и дальше выбрать пункт attach existing disk
- проинициализируйте диск согласно инструкции и подмонтировать файловую систему, только не забывайте менять имя диска на актуальное, в вашем случае это скорее всего будет /dev/sdb - https://www.digitalocean.com/community/tutorials/how-to-partition-and-format-storage-devices-in-linux
- сделайте пользователя postgres владельцем /mnt/data - chown -R postgres:postgres /mnt/data/
- перенесите содержимое /var/lib/postgres/13 в /mnt/data - mv /var/lib/postgresql/13 /mnt/data
- попытайтесь запустить кластер - sudo -u postgres pg_ctlcluster 13 main start
- напишите получилось или нет и почему
  > Запустить кластер не получилось, т.к. в файле конфигураций /etc/postgresql/13/main/postgresql.conf директория с данными указана: 
  >
  > data_directory = '/var/lib/postgresql/13/main'		# use data in another directory
  > А мы перенесли директорию с данными в /mnt/data

- задание: найти конфигурационный параметр в файлах раположенных в /etc/postgresql/10/main который надо поменять и поменяйте его
- напишите что и почему поменяли
  > Файл, в котором надо внести изменения: /etc/postgresql/13/main/postgresql.conf
  > Поменять data_directory = '/var/lib/postgresql/13/main' на data_directory = '/mnt/data/13/main'
  > так как директория с данными теперь на внешнем диске
- попытайтесь запустить кластер - sudo -u postgres pg_ctlcluster 13 main start
- напишите получилось или нет и почему
  > Кластер запустился, т.к. смог проинициализировать подключение к данным
- зайдите через через psql и проверьте содержимое ранее созданной таблицы 

  > andrey@instance-2:/etc/postgresql/13/main$ sudo -u postgres pg_ctlcluster 13 main start
  > 
  > Warning: the cluster will not be running as a systemd service. Consider using systemctl:
  > sudo systemctl start postgresql@13-main
  > 
  > andrey@instance-2:/etc/postgresql/13/main$ sudo su postgres

  ``` postgresql
    postgres=# select * from test ;
      s      
    -------------
    Lorem Ipsum
    (1 row)
  ```
- задание со звездочкой *: не удаляя существующий GCE инстанс сделайте новый, поставьте на его PostgreSQL, удалите файлы с данными из /var/lib/postgres, перемонтируйте внешний диск который сделали ранее от первой виртуальной машины ко второй и запустите PostgreSQL на второй машине так чтобы он работал с данными на внешнем диске, расскажите как вы это сделали и что в итоге получилось.
  ```
  postgres@instance-3:~$ pg_lsclusters
  Ver Cluster Port Status Owner    Data directory              Log file
  13  main    5432 online postgres /var/lib/postgresql/13/main /var/log/postgresql/postgresql-13-main.log
  ```
  ``` postgresql
  postgres@instance-3:~$ psql
  psql (13.3 (Ubuntu 13.3-1.pgdg20.04+1))
  Type "help" for help.
  
  postgres=# \dt
  Did not find any relations.
  ```
  > Необходимо остановить ВМ, на которой мы начинали работу
  > 
  > Удалить дополнительный диск через GCP
  > 
  > После этого добавить диск к новой ВМ
  > 
  > На новой ВМ выключить кластер
  > 
  > Подмонтировать диск (нет необходимости делать разметку диска, т.к. диск уже размечен)
  > 
  > Удалить директорию sudo rm -rf /var/lib/postgresql/13/main, чтобы убедиться, что данные будут браться именно из нового подмонтированного диска
  > 
  > Изменить в настройке /etc/postgresql/13/main/postgresql.conf: 
  > 
  > data_directory = '/var/lib/postgresql/13/main' на data_directory = '/mnt/data/13/main'
  > 
  > Запустить кластер sudo -u postgres pg_ctlcluster 13 main start
  > 
  > Подключиться к утилите psql - sudo su postgresql \ psql
  > 
  > Сделать выборку данных
  ``` postgresql
    postgres=# select * from test;
          s      
    -------------
    Lorem Ipsum
    (1 row)
    
    postgres=#
    
  ```

