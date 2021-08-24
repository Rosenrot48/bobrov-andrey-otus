# Домашнее задание

###Репликация

### Цель:
- реализовать свой миникластер на 3 ВМ.

###Задание:
> Для выполнения всех пунктов на мастер нодах (ВМ 1 и 2)
> необходимо настроить postgresql.conf - listen_address = '*'
> необходимо во всех мастер базах указать alter system wal_level = 'logical' и перезапустить кластер
> Для выполнения логической репликации необходимо
> в pg_hba.conf разрешить подключения к таблице
> host	master1		postgres	10.182.0.0/24		md5
> 10.182.0.0 - локальная сеть в кластере GCP
> 
> Для выполнения физической репликации и создания бэкапов необходимо разрешить подключение на репликацию
> host	replication	postgres	10.182.0.0/24		md5
> 
> Обновим пароль для пользователя postgres
> /password -> master1
> 

- На 1 ВМ создаем таблицы test для записи, test2 для запросов на чтение. 
  Создаем публикацию таблицы test и подписываемся на публикацию таблицы test2 с ВМ №2.
  ```postgresql
  postgres=# create database master1;
  postgres=# \c master1
  postgres=# create table logical1(name varchar);
  postgres=# insert into logical1 values ('Andrey'), ('Maxim'), ('Ivan');
  ```
  
> после чего создаем публикацию

    
    master1=# create publication master_1_logical for table logical1 ; 
    master1=# \dRp+
    Publication master_1_logical
    Owner   | All tables | Inserts | Updates | Deletes | Truncates | Via root
    ----------+------------+---------+---------+---------+-----------+----------
    postgres | f          | t       | t       | t       | t         | f
    Tables:
    "public.logical1"
    
    master1=#

> Создаем подписку на таблицу от 2 ВМ

```postgresql
    create subscription master_2_logical_sub connection 'host=10.182.0.3 port=5432 user=postgres password=master1 dbname=master1' publication master_2_logical with (copy_data = true);
```
    

- На 2 ВМ создаем таблицы test2 для записи, test для запросов на чтение.
  Создаем публикацию таблицы test2 и подписываемся на публикацию таблицы test1 с ВМ №1.

> С этой ВМ аналогичные шаги, только создаем публикацию таблицы logical2 и подписываемся на logical1  
> Обе ВМ получили данные существующие на мастере для подписки и при заполнении новых postgres передает данные на подписчика

- 3 ВМ использовать как реплику для чтения и бэкапов (подписаться на таблицы из ВМ №1 и №2 ). Небольшое описание, того, что получилось.
> Необходимо установить постгрес и создать два кластера и удалить файлы с данными из /var/lib/postgresql/13/<название кластера>
> Следующим шагом необходимо сделать бэкапы с двух мастеров в разные кластеры
> sudo -u postgres pg_basebackup -h 10.182.0.2 -p 5432 -R -D /var/lib/postgresql/13/main2
> sudo -u postgres pg_basebackup -h 10.182.0.3 -p 5432 -R -D /var/lib/postgresql/13/main2
> 10.182.0.2 - первая ВМ
> 10.182.0.3 - вторая ВМ
> 
> После развертывания кластеров мы получили физическую репликацию двух разных мастеров
> при настройках по умолчанию (synchronous_commit = on) при обновлении данных на мастере происходит моментальное обновление данных на реплике
