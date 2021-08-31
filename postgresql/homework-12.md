# Домашнее задание
### Секционирование таблицы

### Цель:
- научиться секционировать таблицы.

- Секционировать большую таблицу из демо базы flights

### Решение
> Для работы был выбран архив demo-big.zip
> 
> Скачал и распокавал на сервере
> 
> Для создания секционирования выбрал таблицу bookings.bookings, 
> 
> т.к. таблица имеет колонку даты заказа билета и по нему логичнее всего разбивать на секции  

```postgresql
demo=# \d bookings.bookings
                        Table "bookings.bookings"
    Column    |           Type           | Collation | Nullable | Default 
--------------+--------------------------+-----------+----------+---------
 book_ref     | character(6)             |           | not null | 
 book_date    | timestamp with time zone |           | not null | 
 total_amount | numeric(10,2)            |           | not null | 
Indexes:
    "bookings_pkey" PRIMARY KEY, btree (book_ref)
Referenced by:
    TABLE "bookings.tickets" CONSTRAINT "tickets_book_ref_fkey" FOREIGN KEY (book_ref) REFERENCES bookings.bookings(book_ref)
```
> Прежде всего определимся с тем, на какие секции мы хотим разбить решение таблицу
> 
> Использовал утилиту для получения списка дат с разбивкой по годам
```postgresql
demo=# select date_trunc('year', book_date) as year_trunc from bookings.bookings group by year_trunc;
       year_trunc       
------------------------
 2016-01-01 00:00:00+00
 2015-01-01 00:00:00+00
(2 rows)
```
> Разбивать будем на три секции:
> - за 2015
> - за 2016
> - дефолтная, если у нас будут даты выходить из секций, чтобы не произошла ошибка при вставке
> 
> Для этого нам понадобиться создать временную таблицу с такой же структурой и включенным секционированием по дате бронирования
```postgresql
create table bookings.bookings_temp(
    total_amount numeric(10,2),
    book_date timestampz,
    book_ref character(6)
    ) partition by range ( book_date);
```
> Дальше создаем три секции 
```postgresql
demo=# create table bookings.bookings_2016 partition of bookings.bookings_temp for values from ('2016-01-01') to ('2017-01-01');
CREATE TABLE
demo=# create table bookings.bookings_2015 partition of bookings.bookings_temp for values from ('2015-01-01') to ('2016-01-01');
CREATE TABLE
demo=# create table bookings.bookings_default partition of bookings.bookings_temp default;
CREATE TABLE
```
> Переношу значения из старой таблицу в таблицу с секциями
```postgresql
insert into bookings.bookings_temp (select total_amount, book_date, book_ref from bookings.bookings);
INSERT 0 2111110
```
> Для проверки, что все значения занеслись в правильные секции сделаем выборку количества по каждой дате
```postgresql
demo=# select count(*) from bookings.bookings where book_date <  date'2016-01-01 00:00:00.000000' and book_date >  date'2015-01-01 00:00:00.000000';
 count  
--------
 521917
(1 row)

demo=# select count(*) from bookings.bookings where book_date >  date'2016-01-01 00:00:00.000000'; 
  count  
---------
 1589186
(1 row)
```
> за 2015 год было 521917 бронирований
> 
> за 2016 год было 1589186
>
> Проверим, что данные правильно занеслись в секции
```postgresql
demo=# select count(*) from bookings.bookings_2015;
 count  
--------
 521917
(1 row)

demo=# select count(*) from bookings.bookings_2016;
  count  
---------
 1589193
(1 row)

demo=# select count(*) from bookings.bookings_default;
 count 
-------
     0
(1 row)
```
> При переносе все данные успешно разнеслись по секциям
> 
> План запросов выглядит следующим образом
```postgresql
demo=# explain select count(*) from bookings.bookings_2016;
                                           QUERY PLAN                                            
-------------------------------------------------------------------------------------------------
 Finalize Aggregate  (cost=19400.26..19400.27 rows=1 width=8)
   ->  Gather  (cost=19400.05..19400.26 rows=2 width=8)
         Workers Planned: 2
         ->  Partial Aggregate  (cost=18400.05..18400.06 rows=1 width=8)
               ->  Parallel Seq Scan on bookings_2016  (cost=0.00..16744.64 rows=662164 width=0)
(5 rows)

demo=# explain select count(*) from bookings.bookings_2015;
                                           QUERY PLAN                                           
------------------------------------------------------------------------------------------------
 Finalize Aggregate  (cost=7043.53..7043.54 rows=1 width=8)
   ->  Gather  (cost=7043.32..7043.53 rows=2 width=8)
         Workers Planned: 2
         ->  Partial Aggregate  (cost=6043.32..6043.33 rows=1 width=8)
               ->  Parallel Seq Scan on bookings_2015  (cost=0.00..5499.65 rows=217465 width=0)
(5 rows)
demo=#  explain select count(*) from bookings.bookings where book_date < date'2016-01-01 00:00:00.000000';
QUERY PLAN                                                    
-----------------------------------------------------------------------------------------------------------------
 Finalize Aggregate  (cost=8692.93..8692.94 rows=1 width=8)
   ->  Gather  (cost=8692.71..8692.92 rows=2 width=8)
         Workers Planned: 2
         ->  Partial Aggregate  (cost=7692.71..7692.72 rows=1 width=8)
               ->  Parallel Append  (cost=0.00..7148.75 rows=217586 width=0)
                     ->  Parallel Seq Scan on bookings_2015 bookings_1  (cost=0.00..6043.32 rows=217444 width=0)
                           Filter: (book_date < '2016-01-01'::date)
                     ->  Parallel Seq Scan on bookings_default bookings_2  (cost=0.00..17.50 rows=200 width=0)
                           Filter: (book_date < '2016-01-01'::date)
(9 rows)
```
> Осталось поменять старую таблицу на новую с секциями
```postgresql
demo=# alter table bookings.bookings rename to bokiings_old;
ALTER TABLE
demo=# alter table bookings.bookings_temp rename to bookings;
ALTER TABLE
```
