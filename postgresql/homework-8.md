#Домашнее задание

### Нагрузочное тестирование и тюнинг PostgreSQL

### Цель:
- сделать нагрузочное тестирование PostgreSQL
- настроить параметры PostgreSQL для достижения максимальной производительности

### Задание:
- сделать проект ---10
- сделать инстанс Google Cloud Engine типа e2-medium с ОС Ubuntu 20.04
- поставить на него PostgreSQL 13 из пакетов собираемых postgres.org
- настроить кластер PostgreSQL 13 на максимальную производительность не обращая внимание на возможные проблемы с надежностью в случае аварийной перезагрузки виртуальной машины 
- нагрузить кластер через утилиту https://github.com/Percona-Lab/sysbench-tpcc (требует установки https://github.com/akopytov/sysbench) 
- написать какого значения tps удалось достичь, показать какие параметры в какие значения устанавливали и почему

> Развернул Postgres на ВМ и установил утилиту sysbench \
> Установку утилиты делал по гайду https://severalnines.com/database-blog/how-benchmark-postgresql-performance-using-sysbench \
> Настройки для конфигурации взял в http://pgconfigurator.cybertec.at/ \
> Для моего инстанса с 1 ядром и 4 ГБ ОЗУ конфигуратор предложил следующие настройки
```
# Memory Settings
shared_buffers = '1024 MB'
work_mem = '128 MB'
maintenance_work_mem = '320 MB'
huge_pages = off
effective_cache_size = '3 GB'
effective_io_concurrency = 100   # concurrent IO only really activated if OS supports posix_fadvise function
random_page_cost = 1.25 # speed of random disk access relative to sequential access (1.0)
```
> добавил эти настройки в postgresql.conf и добавил настройки из лекции про производительность
```
- fsync = off
- full_page_writes = off
- synchronous_commit=off
```
> Полный список получился следующим
### Оконечный список настроек
```
shared_buffers = 1024MB
huge_pages = off
work_mem = 128MB
temp_buffers = 256MB
effective_cache_size = 2GB
maintenance_work_mem = 256MB
effective_io_concurrency = 100
fsync = off
full_page_writes = off
synchronous_commit=off
```

### Результат выполнения нагрузки 
> Создали 24 таблицы с 100000 строк в каждой
```
andrey@max-performance-instance:~$ sysbench --db-driver=pgsql --oltp-table-size=100000 --oltp-tables-count=24 --threads=1 --pgsql-host=localhost --pgsql-port=5432 --pgsql-user=sbtest --pgsql-password=password --pgsql-db=sbtest /usr/share/sysbench/tests/include/oltp_legacy/parallel_prepare.lua run
sysbench 1.0.20 (using bundled LuaJIT 2.1.0-beta2)

Running the test with following options:
Number of threads: 1
Initializing random number generator from current time


Initializing worker threads...

Threads started!

thread prepare0
Creating table 'sbtest1'...
Inserting 100000 records into 'sbtest1'
Creating secondary indexes on 'sbtest1'...
Creating table 'sbtest2'...
Inserting 100000 records into 'sbtest2'
Creating secondary indexes on 'sbtest2'...
Creating table 'sbtest3'...
Inserting 100000 records into 'sbtest3'
Creating secondary indexes on 'sbtest3'...
Creating table 'sbtest4'...
Inserting 100000 records into 'sbtest4'
Creating secondary indexes on 'sbtest4'...
Creating table 'sbtest5'...
Inserting 100000 records into 'sbtest5'
Creating secondary indexes on 'sbtest5'...
Creating table 'sbtest6'...
Inserting 100000 records into 'sbtest6'
Creating secondary indexes on 'sbtest6'...
Creating table 'sbtest7'...
Inserting 100000 records into 'sbtest7'
Creating secondary indexes on 'sbtest7'...
Creating table 'sbtest8'...
Inserting 100000 records into 'sbtest8'
Creating secondary indexes on 'sbtest8'...
Creating table 'sbtest9'...
Inserting 100000 records into 'sbtest9'
Creating secondary indexes on 'sbtest9'...
Creating table 'sbtest10'...
Inserting 100000 records into 'sbtest10'
Creating secondary indexes on 'sbtest10'...
Creating table 'sbtest11'...
Inserting 100000 records into 'sbtest11'
Creating secondary indexes on 'sbtest11'...
Creating table 'sbtest12'...
Inserting 100000 records into 'sbtest12'
Creating secondary indexes on 'sbtest12'...
Creating table 'sbtest13'...
Inserting 100000 records into 'sbtest13'
Creating secondary indexes on 'sbtest13'...
Creating table 'sbtest14'...
Inserting 100000 records into 'sbtest14'
Creating secondary indexes on 'sbtest14'...
Creating table 'sbtest15'...
Inserting 100000 records into 'sbtest15'
Creating secondary indexes on 'sbtest15'...
Creating table 'sbtest16'...
Inserting 100000 records into 'sbtest16'
Creating secondary indexes on 'sbtest16'...
Creating table 'sbtest17'...
Inserting 100000 records into 'sbtest17'
Creating secondary indexes on 'sbtest17'...
Creating table 'sbtest18'...
Inserting 100000 records into 'sbtest18'
Creating secondary indexes on 'sbtest18'...
Creating table 'sbtest19'...
Inserting 100000 records into 'sbtest19'
Creating secondary indexes on 'sbtest19'...
Creating table 'sbtest20'...
Inserting 100000 records into 'sbtest20'
Creating secondary indexes on 'sbtest20'...
Creating table 'sbtest21'...
Inserting 100000 records into 'sbtest21'
Creating secondary indexes on 'sbtest21'...
Creating table 'sbtest22'...
Inserting 100000 records into 'sbtest22'
Creating secondary indexes on 'sbtest22'...
Creating table 'sbtest23'...
Inserting 100000 records into 'sbtest23'
Creating secondary indexes on 'sbtest23'...
Creating table 'sbtest24'...
Inserting 100000 records into 'sbtest24'
Creating secondary indexes on 'sbtest24'...
SQL statistics:
    queries performed:
        read:                            0
        write:                           912
        other:                           48
        total:                           960
    transactions:                        1      (0.03 per sec.)
    queries:                             960    (29.33 per sec.)
    ignored errors:                      0      (0.00 per sec.)
    reconnects:                          0      (0.00 per sec.)

General statistics:
    total time:                          32.7328s
    total number of events:              1

Latency (ms):
         min:                                32731.96
         avg:                                32731.96
         max:                                32731.96
         95th percentile:                    32745.49
         sum:                                32731.96

Threads fairness:
    events (avg/stddev):           1.0000/0.00
    execution time (avg/stddev):   32.7320/0.00
```

> Нагрузочное тестирование на чтение и запись в таблицу
```
andrey@max-performance-instance:~$ sysbench --db-driver=pgsql --report-interval=2 --oltp-table-size=100000 --oltp-tables-count=24 --threads=64 --``time``=60 --pgsql-host=127.0.0.1 --pgsql-port=5432 --pgsql-user=sbtest --pgsql-password=password --pgsql-db=sbtest /usr/share/sysbench/tests/include/oltp_legacy/oltp``.lua run
sysbench 1.0.20 (using bundled LuaJIT 2.1.0-beta2)

Running the test with following options:
Number of threads: 64
Report intermediate results every 2 second(s)
Initializing random number generator from current time


Initializing worker threads...

Threads started!

[ 2s ] thds: 64 tps: 281.71 qps: 6026.80 (r/w/o: 4287.53/1145.16/594.12) lat (ms,95%): 601.29 err/s: 0.00 reconn/s: 0.00
[ 4s ] thds: 64 tps: 362.08 qps: 7213.01 (r/w/o: 5044.55/1444.30/724.15) lat (ms,95%): 204.11 err/s: 0.00 reconn/s: 0.00
[ 6s ] thds: 64 tps: 391.00 qps: 7806.49 (r/w/o: 5455.49/1568.50/782.50) lat (ms,95%): 186.54 err/s: 0.00 reconn/s: 0.00
[ 8s ] thds: 64 tps: 391.50 qps: 7845.45 (r/w/o: 5499.47/1562.49/783.50) lat (ms,95%): 183.21 err/s: 0.00 reconn/s: 0.00
[ 10s ] thds: 64 tps: 407.50 qps: 8126.97 (r/w/o: 5685.98/1626.49/814.50) lat (ms,95%): 176.73 err/s: 0.00 reconn/s: 0.00
[ 12s ] thds: 64 tps: 388.50 qps: 7805.55 (r/w/o: 5475.54/1553.01/777.01) lat (ms,95%): 183.21 err/s: 0.00 reconn/s: 0.00
[ 14s ] thds: 64 tps: 409.50 qps: 8165.91 (r/w/o: 5713.93/1631.48/820.49) lat (ms,95%): 173.58 err/s: 0.00 reconn/s: 0.00
[ 16s ] thds: 64 tps: 396.50 qps: 7953.07 (r/w/o: 5566.05/1594.01/793.01) lat (ms,95%): 176.73 err/s: 0.00 reconn/s: 0.00
[ 18s ] thds: 64 tps: 401.50 qps: 8043.46 (r/w/o: 5628.47/1612.99/802.00) lat (ms,95%): 176.73 err/s: 0.00 reconn/s: 0.00
[ 20s ] thds: 64 tps: 395.50 qps: 7866.56 (r/w/o: 5501.54/1572.01/793.01) lat (ms,95%): 179.94 err/s: 0.50 reconn/s: 0.00
[ 22s ] thds: 64 tps: 400.48 qps: 7996.64 (r/w/o: 5585.25/1609.93/801.46) lat (ms,95%): 173.58 err/s: 0.00 reconn/s: 0.00
[ 24s ] thds: 64 tps: 404.51 qps: 8130.11 (r/w/o: 5706.08/1615.02/809.01) lat (ms,95%): 170.48 err/s: 0.00 reconn/s: 0.00
[ 26s ] thds: 64 tps: 403.51 qps: 8064.23 (r/w/o: 5641.16/1616.55/806.52) lat (ms,95%): 173.58 err/s: 0.00 reconn/s: 0.00
[ 28s ] thds: 64 tps: 405.50 qps: 8073.01 (r/w/o: 5648.51/1614.00/810.50) lat (ms,95%): 167.44 err/s: 0.00 reconn/s: 0.00
[ 30s ] thds: 64 tps: 398.50 qps: 8024.54 (r/w/o: 5618.03/1608.51/798.00) lat (ms,95%): 170.48 err/s: 0.00 reconn/s: 0.00
[ 32s ] thds: 64 tps: 393.50 qps: 7856.49 (r/w/o: 5509.49/1561.00/786.00) lat (ms,95%): 179.94 err/s: 0.00 reconn/s: 0.00
[ 34s ] thds: 64 tps: 391.50 qps: 7827.00 (r/w/o: 5471.00/1572.00/784.00) lat (ms,95%): 176.73 err/s: 0.00 reconn/s: 0.00
[ 36s ] thds: 64 tps: 392.00 qps: 7813.48 (r/w/o: 5473.49/1555.50/784.50) lat (ms,95%): 176.73 err/s: 0.00 reconn/s: 0.00
[ 38s ] thds: 64 tps: 385.00 qps: 7715.07 (r/w/o: 5398.55/1547.51/769.01) lat (ms,95%): 183.21 err/s: 0.00 reconn/s: 0.00
[ 40s ] thds: 64 tps: 378.99 qps: 7614.89 (r/w/o: 5333.42/1522.98/758.49) lat (ms,95%): 183.21 err/s: 0.00 reconn/s: 0.00
[ 42s ] thds: 64 tps: 397.00 qps: 7930.54 (r/w/o: 5556.03/1580.01/794.50) lat (ms,95%): 176.73 err/s: 0.00 reconn/s: 0.00
[ 44s ] thds: 64 tps: 389.00 qps: 7764.40 (r/w/o: 5428.43/1558.98/776.99) lat (ms,95%): 179.94 err/s: 0.00 reconn/s: 0.00
[ 46s ] thds: 64 tps: 390.50 qps: 7788.07 (r/w/o: 5444.05/1562.51/781.51) lat (ms,95%): 176.73 err/s: 0.50 reconn/s: 0.00
[ 48s ] thds: 64 tps: 382.00 qps: 7679.07 (r/w/o: 5388.55/1525.51/765.01) lat (ms,95%): 179.94 err/s: 0.00 reconn/s: 0.00
[ 50s ] thds: 64 tps: 392.49 qps: 7828.82 (r/w/o: 5466.87/1577.46/784.48) lat (ms,95%): 176.73 err/s: 0.00 reconn/s: 0.00
[ 52s ] thds: 64 tps: 389.01 qps: 7787.65 (r/w/o: 5465.11/1543.03/779.52) lat (ms,95%): 176.73 err/s: 0.00 reconn/s: 0.00
[ 54s ] thds: 64 tps: 400.50 qps: 7988.53 (r/w/o: 5585.02/1603.51/800.00) lat (ms,95%): 173.58 err/s: 0.00 reconn/s: 0.00
[ 56s ] thds: 64 tps: 402.50 qps: 8016.52 (r/w/o: 5595.51/1616.00/805.00) lat (ms,95%): 170.48 err/s: 0.00 reconn/s: 0.00
[ 58s ] thds: 64 tps: 391.50 qps: 7929.01 (r/w/o: 5582.01/1563.00/784.00) lat (ms,95%): 173.58 err/s: 0.00 reconn/s: 0.00
[ 60s ] thds: 64 tps: 395.97 qps: 7820.41 (r/w/o: 5439.59/1591.88/788.94) lat (ms,95%): 176.73 err/s: 0.00 reconn/s: 0.00
SQL statistics:
    queries performed:
        read:                            328748
        write:                           93917
        other:                           46971
        total:                           469636
    transactions:                        23480  (389.74 per sec.)
    queries:                             469636 (7795.48 per sec.)
    ignored errors:                      2      (0.03 per sec.)
    reconnects:                          0      (0.00 per sec.)

General statistics:
    total time:                          60.2428s
    total number of events:              23480

Latency (ms):
         min:                                   78.66
         avg:                                  163.82
         max:                                 1595.83
         95th percentile:                      179.94
         sum:                              3846391.89

Threads fairness:
    events (avg/stddev):           366.8750/4.98
    execution time (avg/stddev):   60.0999/0.08

```




