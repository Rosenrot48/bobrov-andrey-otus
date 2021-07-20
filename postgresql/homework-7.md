# Домашнее задание

### Механизм блокировок

### Задание

##### Цель:
- понимать как работает механизм блокировок объектов и строк

##### Задание:
- Настройте сервер так, чтобы в журнал сообщений сбрасывалась информация о блокировках, удерживаемых более 200 миллисекунд. Воспроизведите ситуацию, при которой в журнале появятся такие сообщения.

> Необходимо изменить настройку log_min_duration_statement c -1 (по умолчанию и означает, что выключена) на 200
```postgresql
postgres=# show log_min_duration_statement ;
 log_min_duration_statement 
----------------------------
 -1
(1 row)

postgres=# alter system set log_min_duration_statement = 200;
ALTER SYSTEM
postgres=# select pg_reload_conf();
 pg_reload_conf 
----------------
 t
(1 row)

postgres=# SELECT name, setting, context, short_desc FROM pg_settings WHERE name= 'log_min_duration_statement';
            name            | setting |  context  |                                 short_desc                                 
----------------------------+---------+-----------+----------------------------------------------------------------------------
 log_min_duration_statement | 200     | superuser | Sets the minimum execution time above which all statements will be logged.
(1 row)


```
> Примером может послужить незакрытая транзакция у одного бэкенда и обновление структуры таблицы другим бэкендом

```postgresql
postgres=# create table locks(l integer);
CREATE TABLE
postgres=# insert into locks(l) select generate_series(1,100)
postgres-# ;
INSERT 0 100
postgres=# begin
postgres-# ;
BEGIN

postgres=*# select l from locks limit 10;
 l  
----
  1
  2
  3
  4
  5
  6
  7
  8
  9
 10
(10 rows)


```

> Во втором окне 

```postgresql

postgres=# alter table locks add column t varchar(255);

```

> Данная команда не будет выполнена, т.к. уровень блокировки для обновления таблицы является ACCESS EXCLUSIVE
> А уровень блокировки у SELECT - ACCESS SHARE
> Как сказано в документации: 
> ACCESS SHARE Конфликтует только с режимом блокировки ACCESS EXCLUSIVE.
> и блокировка с типом EXCLUSIVE будет ждать, пока не завершится транзакция с блокировкой с типом SHARE.
> при завершении транзакции с добавлением колонки мы получаем в логах следующую информацию
>> 2021-07-19 19:37:49.639 UTC [6209] postgres@postgres LOG:  duration: 22093.609 ms  statement: alter table locks add column t varchar(255);


- Смоделируйте ситуацию обновления одной и той же строки тремя командами UPDATE в разных сеансах. Изучите возникшие блокировки в представлении pg_locks и убедитесь, что все они понятны. Пришлите список блокировок и объясните, что значит каждая.

> При моделировании обновления одной и той же строки в трех разных одновременных транзакциях были выявлены следующие блокировки
> Таблица для тестирования  
```postgresql

postgres=# create table locks(l integer);
CREATE TABLE
postgres=# insert into locks(l) select generate_series(1,100);
INSERT 0 100

```
> Запрос на обновление данных в первой транзакции
```postgresql

postgres=# begin;
BEGIN
postgres=*# update locks set l = l + 100 where l = 13;
UPDATE 1

```
> Запрос на обновление данных во второй транзакции


```postgresql

postgres=# begin;
BEGIN
postgres=*# update locks set l = l + 100 where l = 13;

```

> Запрос на обновление данных в третьей транзакции


```postgresql

postgres=# begin;
BEGIN
postgres=*# update locks set l = l + 100 where l = 13;

```
> Как видно 2 и 3 транзакции получили блокировку

###PID-ы бэкендов 
> - 1 бэк - 6600
> - 2 бэк - 6209
> - 3 бэк - 6338
>
> Сделаем выборку из таблицы pg_locks для того, чтобы посмотреть какие блокировки у каждого бэкенда

### 1
```postgresql
postgres=*# SELECT locktype, relation::REGCLASS, virtualxid AS virtxid, transactionid AS xid, mode, granted FROM pg_locks WHERE pid = 6600;
   locktype    |             relation              | virtxid | xid |       mode       | granted 
---------------+-----------------------------------+---------+-----+------------------+---------
 relation      | pg_stat_activity                  |         |     | AccessShareLock  | t
 relation      | pg_namespace_oid_index            |         |     | AccessShareLock  | t
 relation      | pg_namespace_nspname_index        |         |     | AccessShareLock  | t
 relation      | pg_class_tblspc_relfilenode_index |         |     | AccessShareLock  | t
 relation      | pg_class_relname_nsp_index        |         |     | AccessShareLock  | t
 relation      | pg_class_oid_index                |         |     | AccessShareLock  | t
 relation      | pg_namespace                      |         |     | AccessShareLock  | t
 relation      | pg_class                          |         |     | AccessShareLock  | t
 relation      | pg_locks                          |         |     | AccessShareLock  | t
 relation      | locks                             |         |     | RowExclusiveLock | t
 virtualxid    |                                   | 5/112   |     | ExclusiveLock    | t
 relation      | pg_database_oid_index             |         |     | AccessShareLock  | t
 relation      | pg_authid_oid_index               |         |     | AccessShareLock  | t
 relation      | pg_authid_rolname_index           |         |     | AccessShareLock  | t
 transactionid |                                   |         | 493 | ExclusiveLock    | t
 relation      | pg_database                       |         |     | AccessShareLock  | t
 relation      | pg_authid                         |         |     | AccessShareLock  | t
 relation      | pg_database_datname_index         |         |     | AccessShareLock  | t
(18 rows)
```

> Блокировка по отношению к таблице тестов locks - RowExclusiveLock
> 
### 2

```postgresql
postgres=*# SELECT locktype, relation::REGCLASS, virtualxid AS virtxid, transactionid AS xid, mode, granted FROM pg_locks WHERE pid = 6209;
   locktype    |             relation              | virtxid | xid |       mode       | granted 
---------------+-----------------------------------+---------+-----+------------------+---------
 relation      | pg_locks                          |         |     | AccessShareLock  | t
 relation      | locks                             |         |     | RowExclusiveLock | t
 relation      | pg_class_tblspc_relfilenode_index |         |     | AccessShareLock  | t
 relation      | pg_class_relname_nsp_index        |         |     | AccessShareLock  | t
 relation      | pg_class_oid_index                |         |     | AccessShareLock  | t
 relation      | pg_namespace_oid_index            |         |     | AccessShareLock  | t
 relation      | pg_namespace_nspname_index        |         |     | AccessShareLock  | t
 relation      | pg_namespace                      |         |     | AccessShareLock  | t
 relation      | pg_class                          |         |     | AccessShareLock  | t
 virtualxid    |                                   | 3/34    |     | ExclusiveLock    | t
 transactionid |                                   |         | 493 | ShareLock        | f
 transactionid |                                   |         | 491 | ExclusiveLock    | t
 tuple         | locks                             |         |     | ExclusiveLock    | t
(13 rows)
```


> Блокировка по отношению к таблице тестов locks - RowExclusiveLock
> 

### 3
```postgresql
postgres=*# SELECT locktype, relation::REGCLASS, virtualxid AS virtxid, transactionid AS xid, mode, granted FROM pg_locks WHERE pid = 6338;
   locktype    | relation | virtxid | xid |       mode       | granted 
---------------+----------+---------+-----+------------------+---------
 relation      | locks    |         |     | RowExclusiveLock | t
 virtualxid    |          | 4/48    |     | ExclusiveLock    | t
 advisory      |          |         |     | ExclusiveLock    | t
 transactionid |          |         | 495 | ExclusiveLock    | t
 tuple         | locks    |         |     | ExclusiveLock    | f
(5 rows)
```
> Блокировка по отношению к таблице тестов locks - RowExclusiveLock

Насколько я могу судить по информации из журнала блокировок

- Первая транзакция произвела обновление, но транзакция не была завершена
- Вторая транзакция перед обновлением строки проверила, есть ли другие транзакции, которые работают со строкой и поймала SharedLock на первую транзакцию. Создала tuple и заснула в ожидании завершения 1-ой транзакции
- Третья транзакция перед обновлением строки проверила, есть ли другие транзакции, которые работают со строкой и увидела созданный tuple и заснула в ожидании завершении транзакции с tuple. Так же у tuple стоит флаг granted - f, это означает что некоторая другая транзакция удерживает блокировку того же объекта в конфликтующем режиме

- Воспроизведите взаимоблокировку трех транзакций. Можно ли разобраться в ситуации постфактум, изучая журнал сообщений?

> Не получилось сделать с тремя транзакциями, но с двумя был следующий результат:
> 2021-07-19 20:58:15.381 UTC [6600] postgres@postgres ERROR:  deadlock detected
>
>2021-07-19 20:58:15.381 UTC [6600] postgres@postgres DETAIL:  Process 6600 waits for ShareLock on transaction 511; blocked by process 6729.
Process 6729 waits for ShareLock on transaction 512; blocked by process 6600.
Process 6600: update light_locks set ll = ll + 50 where ll = 60; 
Process 6729: update light_locks set ll = ll + 50 where ll = 70;
> 
>2021-07-19 20:58:15.381 UTC [6600] postgres@postgres HINT:  See server log for query details.
> 
> 2021-07-19 20:58:15.381 UTC [6600] postgres@postgres CONTEXT:  while updating tuple (0,150) in relation "light_locks"
> 
> 2021-07-19 20:58:15.381 UTC [6600] postgres@postgres STATEMENT:  update light_locks set ll = ll + 50 where ll = 60; 
> 
> 2021-07-19 20:58:15.381 UTC [6729] postgres@postgres LOG:  duration: 5571.590 ms  statement: update light_locks set ll = ll + 50 where ll = 70;
  
В логах указано, что проблема во взаимной блокировке ресурсов и постгрес смог обнаружить и устранить ее путем отмены второй транзакции 

- Могут ли две транзакции, выполняющие единственную команду UPDATE одной и той же таблицы (без where), заблокировать друг друга? Попробуйте воспроизвести такую ситуацию.

> У меня получилось только если не завершить первую транзакцию
> Пример следующий 
> В первой бэкенде (pid 6729) запускаем транзакцию 

```postgresql
postgres=# begin;
BEGIN
postgres=*# update light_locks set ll = ll + 20;
UPDATE 100

```

> Во втором бэкенде (pid - 6600) запускаем транзакцию

```postgresql
postgres=# begin;
BEGIN
postgres=*# update light_locks set ll = ll + 20;

```
> Как видно, второй бэкенд не может выполнить UPDATE
> Посмотрим кто его блокирует 
```postgresql

postgres=*# select pg_blocking_pids(6600);
 pg_blocking_pids 
------------------
 {6729}
(1 row)

```

Как видно блокирует его наш первый бэкенд

Уровни блокировок у них следующие

```postgresql
postgres=*#  SELECT locktype, relation::REGCLASS, virtualxid AS virtxid, transactionid AS xid, mode, granted FROM pg_locks WHERE pid = 6729;
   locktype    |  relation   | virtxid | xid |       mode       | granted 
---------------+-------------+---------+-----+------------------+---------
 relation      | pg_locks    |         |     | AccessShareLock  | t
 relation      | light_locks |         |     | RowExclusiveLock | t
 virtualxid    |             | 3/51    |     | ExclusiveLock    | t
 transactionid |             |         | 519 | ExclusiveLock    | t
(4 rows)

postgres=*#  SELECT locktype, relation::REGCLASS, virtualxid AS virtxid, transactionid AS xid, mode, granted FROM pg_locks WHERE pid = 6600;
   locktype    |  relation   | virtxid | xid |       mode       | granted 
---------------+-------------+---------+-----+------------------+---------
 relation      | light_locks |         |     | RowExclusiveLock | t
 virtualxid    |             | 5/133   |     | ExclusiveLock    | t
 tuple         | light_locks |         |     | ExclusiveLock    | t
 transactionid |             |         | 519 | ShareLock        | f
 transactionid |             |         | 520 | ExclusiveLock    | t
(5 rows)
```

Оба бэкенда имеют RowExclusiveLock блокировку на таблицу light_locks, а второй бэкенд получил еще и SharedLock на транзакцию первого бэкенда, т.е. перед тем, как выполнить свой UPDATE он ожидает завершения транзакции с id 519 
