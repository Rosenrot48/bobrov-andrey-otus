#Домашнее задание

###Работа с базами данных, пользователями и правами

#####Задание:

Цель:

- создание новой базы данных, схемы и таблицы
- создание роли для чтения данных из созданной схемы созданной базы данных
- создание роли для чтения и записи из созданной схемы созданной базы данных

#####Пункты:
1. создайте новый кластер PostgresSQL 13 (на выбор - GCE, CloudSQL)
2. зайдите в созданный кластер под пользователем postgres 
3. создайте новую базу данных testdb
   ```postgresql
    postgres=# create database testdb;
    CREATE DATABASE
   ```
4. зайдите в созданную базу данных под пользователем postgres 
   
   > postgres=# \c testdb
      
5. создайте новую схему testnm
   ```postgresql
    testdb=# create schema testnm;
    CREATE SCHEMA
   ```
6. создайте новую таблицу t1 с одной колонкой c1 типа integer
   ```postgresql
    testdb=# create table t1 (c1 int);
    CREATE TABLE
   ```
7. вставьте строку со значением c1=1
   ```postgresql
   testdb=# insert into t1  values (1);
   INSERT 0 1
   ```
8. создайте новую роль readonly
   ```postgresql
    testdb=# create role readonly;
    CREATE ROLE
   ```
9. дайте новой роли право на подключение к базе данных testdb
   ```postgresql
    testdb=# grant CONNECT on DATABASE testdb to readonly ;
    GRANT
   ```
10. дайте новой роли право на использование схемы testnm
    ```postgresql
    testdb=# grant USAGE on SCHEMA testnm to readonly ;
    GRANT
    ```
11. дайте новой роли право на select для всех таблиц схемы testnm 
    ```postgresql
    testdb=# grant SELECT on all tables in SCHEMA testnm to readonly ;
    GRANT
    ```
12. создайте пользователя testread с паролем test123
    ```postgresql
    testdb=# create user testread with password 'test123';
    CREATE ROLE
    ```
13. дайте роль readonly пользователю testread
    ```postgresql
    testdb=# grant readonly to testread ;
    GRANT ROLE
    ```
14. зайдите под пользователем testread в базу данных testdb 
    > andrey@instance-4:~$ psql -U testread -d testdb -h localhost
    > 
    > Password for user testread:
    > 
    > testdb=>
    > 
15. сделайте select * from t1;
    ```postgresql
    testdb=> select * from t1;
    ERROR:  permission denied for table t1
    ```
16. получилось? (могло если вы делали сами не по шпаргалке и не упустили один существенный момент про который позже) 
    > Не получилось, т.к. таблица t1 была создана в схеме public, куда у нас нет доступа.
    ```postgresql
    testdb=> \dt
    List of relations
    Schema | Name | Type  |  Owner   
    --------+------+-------+----------
    public | t1   | table | postgres
    (1 row)
    ```
    > Т.к. роль readonly имеет доступ только к схеме testnm
    > Необходимо удалить данную таблицу, создать ее в нужной схеме
    ```postgresql
    testdb=# drop table t1;
    DROP TABLE
    testdb=# create table testnm.t1 (c1 int); 
    CREATE TABLE
    testdb=# insert into testnm.t1 values(1);
    INSERT 0 1
    ```
    > Дальше необходимо еще раз выдать права на выборку данных из всех таблиц схемы testnm
    ```postgresql
    testdb=# grant SELECT on all tables in SCHEMA testnm to readonly ;
    GRANT
    ```
17. напишите что именно произошло в тексте домашнего задания 
    > Была неточность в том, что в тексте домашки сказано, 
    что надо создать таблицу, но не сказано,
    что она должна быть в схеме testnm
18. у вас есть идеи почему? ведь права то дали? 
19. посмотрите на список таблиц 
20. подсказка в шпаргалке под пунктом 20 
21. а почему так получилось с таблицей (если делали сами и без шпаргалки то может у вас все нормально) 
22. вернитесь в базу данных testdb под пользователем postgres 
23. удалите таблицу t1 
24. создайте ее заново но уже с явным указанием имени схемы testnm 
25. вставьте строку со значением c1=1 
26. зайдите под пользователем testread в базу данных testdb 
27. сделайте select * from testnm.t1; 
28. получилось? 
    > Да, т.к. заново выдал права на доступ к select'у из всех таблиц схемы testnm
29. есть идеи почему? если нет - смотрите шпаргалку 
30. как сделать так чтобы такое больше не повторялось? если нет идей - смотрите шпаргалку 
31. сделайте select * from testnm.t1; 
32. получилось? 
33. ура!
34. теперь попробуйте выполнить команду create table t2(c1 integer); insert into t2 values (2); 
35. а как так? нам же никто прав на создание таблиц и insert в них под ролью readonly? 
    > Получилось, т.к. они создаются в схеме public. В нее мы не вносили никаких ограничений на взаимодействие
36. есть идеи как убрать эти права? если нет - смотрите шпаргалку 
    > Необходимо убрать все привилегии со схемы public у пользователей с ролью public
    > 
    > testdb=# revoke all on schema public from PUBLIC;
    > 
    > revoke all on database testdb from public;
37. если вы справились сами то расскажите что сделали и почему, если смотрели шпаргалку - объясните что сделали и почему выполнив указанные в ней команды 
38. теперь попробуйте выполнить команду create table t3(c1 integer); insert into t2 values (2); 
39. расскажите что получилось и почему
    >  Получается сделать выборку из доступ нам таблиц схемы testnm
    > 
    > Нет возможность создавать таблицы в схеме public
