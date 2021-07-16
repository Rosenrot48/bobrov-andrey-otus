#Домашнее задание

###Работа с журналами

###Задание

#####Цель:
- уметь работать с журналами и контрольными точками
- уметь настраивать параметры журналов

#####Пункты:
- Настройте выполнение контрольной точки раз в 30 секунд.
```postgresql
    postgres=# alter system set checkpoint_timeout = '30s';
    ALTER SYSTEM
    postgres=# alter system set log_checkpoints = on;
    ALTER SYSTEM
```
> После изменения настроек необходимо обновить конфиг 
```postgresql
    postgres=# select pg_reload_conf();
```
```postgresql
    postgres=# show checkpoint_timeout;
    checkpoint_timeout 
    --------------------
    30s
    (1 row)
    
    postgres=# show log_checkpoints;
    log_checkpoints 
    -----------------
     on
    (1 row)
```
- 10 минут c помощью утилиты pgbench подавайте нагрузку.
> pgbench -i postgres;
> 
> Инициализируем необходимые таблицы для тестирования нагрузки и запускаем тест нагрузки 
> 
> pgbench -c8 -P 60 -T 600 -U postgres postgres

- Измерьте, какой объем журнальных файлов был сгенерирован за это время. Оцените, какой объем приходится в среднем на одну контрольную точку.

> Изначально pg_current_wal_insert_lsn имел следующее значение
```postgresql
    postgres=# SELECT pg_current_wal_insert_lsn();
     pg_current_wal_insert_lsn 
    ---------------------------
     0/15C9A98
    (1 row)
```
> После теста значение изменилось на 
```postgresql
    postgres=# SELECT pg_current_wal_insert_lsn();
     pg_current_wal_insert_lsn 
    ---------------------------
     0/18B38180
    (1 row)
```

> Вычислим разницу при помощи функции pg_wal_lsn_diff(), значение которого в байтах

```postgresql
postgres=# select pg_wal_lsn_diff('0/18B38180', '0/15C9A98');
 pg_wal_lsn_diff 
-----------------
       391571176
(1 row)
```

> 391571176 байт ≈ 373 мб
> 
> На одну контрольную точку приходится около 35мб файлов-логов

- Проверьте данные статистики: все ли контрольные точки выполнялись точно по расписанию. Почему так произошло?

> Мы можем проверить данный шаг двумя способами
> 1) Выборка из pg_stat_bgwriter, где будем ориентироваться на атрибут checkpoints_timed, который говорит о количестве запланированных контрольных точек, которые уже были выполнены
```postgresql
    postgres=# SELECT * FROM pg_stat_bgwriter \gx
    -[ RECORD 1 ]---------+------------------------------
    checkpoints_timed     | 38
    checkpoints_req       | 0
    checkpoint_write_time | 310214
    checkpoint_sync_time  | 869
    buffers_checkpoint    | 40626
    buffers_clean         | 0
    maxwritten_clean      | 0
    buffers_backend       | 3001
    buffers_backend_fsync | 0
    buffers_alloc         | 3607
    stats_reset           | 2021-07-13 20:44:22.060512+00
```
> Результат говорит о том, что все checkpoint'ы отработали в запланированный срок
> 
> 2) проверить по количеству записей в логах постгреса т.к. мы включили настройку log_checkpoints (пишет в /var/log/postgresql/postgresql-13-main.log информацию о работе checkpoint'a)
> postgres@instance-8:/home/andrey$ cat /var/log/postgresql/postgresql-13-main.log|grep "checkpoint starting"
>>     2021-07-13 20:46:13.658 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:48:43.755 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:49:13.231 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:49:43.163 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:50:13.247 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:50:43.147 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:51:13.191 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:51:43.155 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:52:13.219 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:52:43.179 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:53:13.159 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:53:43.219 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:54:13.219 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:54:43.175 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:55:13.215 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:55:43.211 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:56:13.187 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:56:43.143 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:57:13.211 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:57:43.187 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:58:13.135 UTC [4763] LOG:  checkpoint starting: time
>>     2021-07-13 20:59:13.116 UTC [4763] LOG:  checkpoint starting: time

- Сравните tps в синхронном/асинхронном режиме утилитой pgbench. Объясните полученный результат.

###При синхронном режиме 

```postgresql
     synchronous_commit 
    --------------------
     on
    (1 row)
    
```

>>postgres@instance-9:/home/andrey$ pgbench -c 8 -P 60 -T 600 -U postgres postgres
>>starting vacuum...end.

| -         | time      | tps         |   lat           | stddev         |
|-----------|-----------|-------------|-----------------|----------------|
| progress: | 60.0   s, | 903.0  tps, | 8.854   ms      |    6.855       |
| progress: | 120.0  s, | 937.2  tps, | 8.536   ms      |    6.461       |
| progress: | 180.0  s, | 954.3  tps, | 8.382   ms      |    6.160       |
| progress: | 240.0  s, | 921.3  tps, | 8.682   ms      |    6.866       |
| progress: | 300.0  s, | 917.9  tps, | 8.714   ms      |    6.971       |
| progress: | 360.0  s, | 928.5  tps, | 8.615   ms      |    6.954       |
| progress: | 420.0  s, | 693.5  tps, | 11.526  ms      |    18.285      |
| progress: | 480.0  s, | 587.3  tps, | 13.615  ms      |    22.628      |
| progress: | 540.0  s, | 596.0  tps, | 13.427  ms      |    21.861      |
| progress: | 600.0  s, | 590.9  tps, | 13.534  ms      |    22.511      |
>transaction type: <builtin: TPC-B (sort of)>
> 
>scaling factor: 1
> 
>query mode: simple
> 
>number of clients: 8
> 
>number of threads: 1
> 
>duration: 600 s
> 
>number of transactions actually processed: 481800
> 
>latency average = 9.961 ms
> 
>latency stddev = 13.217 ms
> 
>tps = 802.975808 (including connections establishing)
> 
>tps = 802.979051 (excluding connections establishing)
>postgres@instance-9:/home/andrey$


###При асинхронном режиме
```postgresql
    postgres=# show synchronous_commit;
    synchronous_commit 
    --------------------
     off
    (1 row)
```

>postgres@instance-9:/home/andrey$ pgbench -c 8 -P 60 -T 600 -U postgres postgres
> 
>starting vacuum...end.

| -         | time      | tps         |   lat           | stddev         |
|-----------|-----------|-------------|-----------------|----------------|
| progress: | 60.0  s, 	| 1977.6 tps, | 4.043 ms 	    | 1.328  	     |
| progress: | 120.0 s, 	| 1967.1 tps, | 4.066 ms 	    | 1.300  	     |
| progress: | 180.1 s, 	| 974.0  tps, | 8.196 ms 	    | 23.044 	     |
| progress: | 240.1 s, 	| 975.6  tps, | 8.201 ms 	    | 23.099 	     |
| progress: | 300.1 s, 	| 967.6  tps, | 8.265 ms 	    | 23.248 	     |
| progress: | 360.1 s, 	| 978.2  tps, | 8.175 ms 	    | 23.030 	     |
| progress: | 420.1 s, 	| 984.2  tps, | 8.128 ms 	    | 23.028 	     |
| progress: | 480.1 s, 	| 973.8  tps, | 8.212 ms 	    | 23.038 	     |
| progress: | 540.1 s, 	| 964.1  tps, | 8.297 ms 	    | 23.295 	     |
> transaction type: <builtin: TPC-B (sort of)>
> 
> scaling factor: 1
> 
> query mode: simple
> 
> number of clients: 8
> 
> number of threads: 1
> 
> duration: 600 s
> 
> number of transactions actually processed: 703378
> 
> latency average = 6.824 ms
> 
> latency stddev = 18.968 ms
> 
> tps = 1172.090679 (including connections establishing)
> 
> tps = 1172.096030 (excluding connections establishing)
 
> Количество обработанных строк увеличилось примерно на 70%
> 
> Прирост произошел из-за того, что мы отключили синхронный коммит изменений, т.е. сервер не ждет информации о записи WAL-файла на диск


- Создайте новый кластер с включенной контрольной суммой страниц.
> postgres@instance-10:/home/andrey$ pg_lsclusters
> 
> Ver Cluster Port Status Owner    Data directory              Log file
> 
> 13  main    5432 online postgres /var/lib/postgresql/13/main /var/log/postgresql/postgresql-13-main.log
> 
> После этого выключаем кластер и, при помощи pg_checksums включаем проверку контрольной суммы таблиц
> su - postgres -c '/usr/lib/postgresql/13/bin/pg_checksums --enable -D "/var/lib/postgresql/13/main"'
> Checksum operation completed
> 
> Files scanned:  916
> 
> Blocks scanned: 2964
> 
> pg_checksums: syncing data directory
> 
> pg_checksums: updating control file
> 
> Checksums enabled in cluster
>
> Включаем кластер
>
> pg_ctlcluster 13 main start
> 
> и проверяем настройку data_checksum

```postgresql
    postgres=# show data_checksums ;
     data_checksums 
    ----------------
     on
    (1 row)
```
  Создайте таблицу.
```postgresql
    create table test_checksum(value integer);
    CREATE TABLE
```
  Вставьте несколько значений.
```postgresql
    insert into test_checksum select generate_series(1,100);
    INSERT 0 100
```
  Выключите кластер.
> Необходимо узнать расположение файла нашей таблицы
```postgresql
  SELECT pg_relation_filepath('test_checksum');
    pg_relation_filepath 
    ----------------------
     base/13414/16384
    (1 row)
```
> pg_ctlcluster 13 main stop
  Измените пару байт в таблице.
> sudo dd if=/dev/zero of=/var/lib/postgresql/13/main/base/13414/16384 oflag=dsync conv=notrunc bs=1 count=8
> 
>8+0 records in
> 
>8+0 records out
> 
>8 bytes copied, 0.00567589 s, 1.4 kB/s

  Включите кластер и сделайте выборку из таблицы.
> pg_ctlcluster 13 main start
```postgresql
  postgres=# select * from test_checksum ;
  WARNING:  page verification failed, calculated checksum 54617 but expected 42362
  ERROR:  invalid page in block 0 of relation base/13414/16384
``` 

  Что и почему произошло? как проигнорировать ошибку и продолжить работу?
> Чек-сумма, которая была у постгреса до выключения отличается от той, что была получена перед выборкой данных, из-за этого постгрес прервал транзакцию и оповестил об ошибке
> 
> Чтобы проигнорировать ошибку необходимо включить настройку ignore_checksum_failure
```postgresql
ALTER SYSTEM
postgres=# select pg_reload_conf();
 pg_reload_conf 
----------------
 t
(1 row)

postgres=# show ignore_checksum_failure;
 ignore_checksum_failure 
-------------------------
 on
(1 row)
```

> И сделать выборку
```postgresql
postgres=# select * from test_checksum limit 10;
 value 
-------
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
