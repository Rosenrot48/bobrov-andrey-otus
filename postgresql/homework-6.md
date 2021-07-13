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

- Создайте новый кластер с включенной контрольной суммой страниц. Создайте таблицу. Вставьте несколько значений. Выключите кластер. Измените пару байт в таблице. Включите кластер и сделайте выборку из таблицы. Что и почему произошло? как проигнорировать ошибку и продолжить работу?
