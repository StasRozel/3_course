-- Удаление старых типов (если существуют)
DROP TABLE tasks;
DROP TABLE clients;
DROP TYPE task_type_varray FORCE;
DROP TYPE task_type FORCE;
DROP TYPE client_type_varray FORCE;
DROP TYPE client_type FORCE;

-- Создание типов
CREATE TYPE client_type AS OBJECT
(
    client_id   NUMBER,
    client_name VARCHAR2(100),
    MAP MEMBER FUNCTION get_map RETURN NUMBER
);
/

CREATE OR REPLACE TYPE BODY client_type AS
    MAP MEMBER FUNCTION get_map RETURN NUMBER IS
    BEGIN
        RETURN client_id;
    END;
END;
/

CREATE TYPE client_type_varray AS VARRAY(100) OF client_type;
/

CREATE TYPE task_type AS OBJECT
(
    task_id   NUMBER,
    task_name VARCHAR2(100),
    clients   client_type_varray,
    MAP MEMBER FUNCTION get_map RETURN NUMBER
);
/

CREATE OR REPLACE TYPE BODY task_type AS
    MAP MEMBER FUNCTION get_map RETURN NUMBER IS
    BEGIN
        RETURN task_id;
    END;
END;
/

CREATE TYPE task_type_varray AS VARRAY(100) OF task_type;
/

-- Создание таблиц
CREATE TABLE tasks OF task_type;
CREATE TABLE clients OF client_type;

-- Наполнение данными
INSERT INTO clients
VALUES (client_type(1, 'Client A'));
INSERT INTO clients
VALUES (client_type(2, 'Client B'));
INSERT INTO clients
VALUES (client_type(3, 'Client C'));

INSERT INTO tasks
VALUES (task_type(1, 'Task 1', client_type_varray(client_type(1, 'Client A'), client_type(2, 'Client B'))));
INSERT INTO tasks
VALUES (task_type(2, 'Task 2', client_type_varray(client_type(3, 'Client C'))));
INSERT INTO tasks
VALUES (task_type(3, 'Task 3', client_type_varray()));

COMMIT;

DECLARE
    k1 task_type_varray;
BEGIN
    SELECT VALUE(t) BULK COLLECT
    INTO k1
    FROM tasks t;

    -- Вывод содержимого коллекции K1
    FOR i IN 1..k1.COUNT
        LOOP
            DBMS_OUTPUT.PUT_LINE('Task: ' || k1(i).task_name);
            FOR j IN 1..k1(i).clients.COUNT
                LOOP
                    DBMS_OUTPUT.PUT_LINE('  Client: ' || k1(i).clients(j).client_name);
                END LOOP;
        END LOOP;
END;
/
-- Проверка членства
DECLARE
    k1        task_type_varray;
    test_task task_type;
    is_member BOOLEAN := FALSE;
BEGIN
    -- Заполнение коллекции k1
    SELECT VALUE(t) BULK COLLECT
    INTO k1
    FROM tasks t;

    -- Выборка test_task
    SELECT VALUE(t)
    INTO test_task
    FROM tasks t
    WHERE task_id = 1;

    -- Проверка членства через цикл
    FOR i IN 1..k1.COUNT
        LOOP
            IF k1(i).task_id = test_task.task_id THEN
                is_member := TRUE;
                EXIT;
            END IF;
        END LOOP;

    IF is_member THEN
        DBMS_OUTPUT.PUT_LINE('Task is a member of K1');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Task is NOT a member of K1');
    END IF;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Task with task_id = 1 not found');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
/

DECLARE
    k1 task_type_varray;
BEGIN
    SELECT VALUE(t) BULK COLLECT
    INTO k1
    FROM tasks t;

    FOR i IN 1..k1.COUNT
        LOOP
            IF k1(i).clients.COUNT = 0 THEN
                DBMS_OUTPUT.PUT_LINE('Task ' || k1(i).task_name || ' has an empty client collection');
            END IF;
        END LOOP;
END;
/

-- 4. Преобразование коллекции

-- a. Преобразование коллекции в реляционные данные
CREATE TABLE tasks_relational
(
    task_id     NUMBER,
    task_name   VARCHAR2(100),
    client_id   NUMBER,
    client_name VARCHAR2(100)
);

DECLARE
    k1 task_type_varray;
BEGIN
    -- Получение коллекции
    SELECT VALUE(t) BULK COLLECT
    INTO k1
    FROM tasks t;

    -- Вставка в реляционную таблицу
    FOR i IN 1..k1.COUNT
        LOOP
            FOR j IN 1..k1(i).clients.COUNT
                LOOP
                    INSERT INTO tasks_relational
                    VALUES (k1(i).task_id,
                            k1(i).task_name,
                            k1(i).clients(j).client_id,
                            k1(i).clients(j).client_name);
                END LOOP;
        END LOOP;
END;
/

-- b. Преобразование в коллекцию другого типа
CREATE TYPE task_simple_type AS OBJECT
(
    task_id   NUMBER,
    task_name VARCHAR2(100)
);
/

CREATE TYPE task_simple_varray AS VARRAY(100) OF task_simple_type;
/

DECLARE
    k1       task_type_varray;
    k_simple task_simple_varray := task_simple_varray();
BEGIN
    SELECT VALUE(t) BULK COLLECT
    INTO k1
    FROM tasks t;

    k_simple.EXTEND(k1.COUNT);
    FOR i IN 1..k1.COUNT
        LOOP
            k_simple(i) := task_simple_type(k1(i).task_id, k1(i).task_name);
        END LOOP;

    -- Вывод преобразованной коллекции
    FOR i IN 1..k_simple.COUNT
        LOOP
            DBMS_OUTPUT.PUT_LINE('Simple Task: ' || k_simple(i).task_name);
        END LOOP;
END;
/

-- 5. Демонстрация BULK операций
DECLARE
    TYPE task_update_rec IS RECORD
                            (
                                task_id       NUMBER,
                                new_task_name VARCHAR2(100)
                            );
    TYPE task_update_tab IS TABLE OF task_update_rec;

    updates task_update_tab := task_update_tab();
BEGIN
    -- Подготовка данных для обновления
    updates.EXTEND(2);
    updates(1).task_id := 1;
    updates(1).new_task_name := 'Updated Task 1';
    updates(2).task_id := 2;
    updates(2).new_task_name := 'Updated Task 2';

    -- BULK UPDATE
    FORALL i IN 1..updates.COUNT
        UPDATE tasks
        SET task_name = updates(i).new_task_name
        WHERE task_id = updates(i).task_id;

    COMMIT;

    -- Проверка результата
    FOR rec IN (SELECT task_name FROM tasks WHERE task_id IN (1, 2))
        LOOP
            DBMS_OUTPUT.PUT_LINE('Updated Task Name: ' || rec.task_name);
        END LOOP;
END;
/

DECLARE
    k1        task_type_varray;
    test_task task_type;
    is_member BOOLEAN            := FALSE;
    k_simple  task_simple_varray := task_simple_varray();

    TYPE task_update_rec IS RECORD
                            (
                                task_id       NUMBER,
                                new_task_name VARCHAR2(100)
                            );
    TYPE task_update_tab IS TABLE OF task_update_rec;
    updates   task_update_tab    := task_update_tab();
BEGIN
    -- 1. Создание и вывод коллекции K1
    DBMS_OUTPUT.PUT_LINE('=== 1. Вывод содержимого коллекции K1 ===');
    SELECT VALUE(t) BULK COLLECT
    INTO k1
    FROM tasks t;

    FOR i IN 1..k1.COUNT
        LOOP
            DBMS_OUTPUT.PUT_LINE('Task: ' || k1(i).task_name);
            FOR j IN 1..k1(i).clients.COUNT
                LOOP
                    DBMS_OUTPUT.PUT_LINE('  Client: ' || k1(i).clients(j).client_name);
                END LOOP;
        END LOOP;

    -- 2. Проверка членства задачи в коллекции K1
    DBMS_OUTPUT.PUT_LINE('=== 2. Проверка членства задачи (task_id = 1) ===');
    BEGIN
        SELECT VALUE(t)
        INTO test_task
        FROM tasks t
        WHERE task_id = 1;

        FOR i IN 1..k1.COUNT
            LOOP
                IF k1(i).task_id = test_task.task_id THEN
                    is_member := TRUE;
                    EXIT;
                END IF;
            END LOOP;

        IF is_member THEN
            DBMS_OUTPUT.PUT_LINE('Task is a member of K1');
        ELSE
            DBMS_OUTPUT.PUT_LINE('Task is NOT a member of K1');
        END IF;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            DBMS_OUTPUT.PUT_LINE('Task with task_id = 1 not found');
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
    END;

    -- 3. Поиск пустых коллекций клиентов
    DBMS_OUTPUT.PUT_LINE('=== 3. Поиск задач с пустыми коллекциями клиентов ===');
    FOR i IN 1..k1.COUNT
        LOOP
            IF k1(i).clients.COUNT = 0 THEN
                DBMS_OUTPUT.PUT_LINE('Task ' || k1(i).task_name || ' has an empty client collection');
            END IF;
        END LOOP;

    -- 4a. Преобразование коллекции в реляционные данные
    DBMS_OUTPUT.PUT_LINE('=== 4a. Преобразование коллекции в реляционные данные ===');
    FOR i IN 1..k1.COUNT
        LOOP
            FOR j IN 1..k1(i).clients.COUNT
                LOOP
                    INSERT INTO tasks_relational
                    VALUES (k1(i).task_id,
                            k1(i).task_name,
                            k1(i).clients(j).client_id,
                            k1(i).clients(j).client_name);
                END LOOP;
        END LOOP;
    DBMS_OUTPUT.PUT_LINE('Data inserted into tasks_relational. Rows affected: ' || SQL%ROWCOUNT);

    -- Вывод содержимого реляционной таблицы
    DBMS_OUTPUT.PUT_LINE('Contents of tasks_relational:');
    FOR rec IN (SELECT task_id, task_name, client_id, client_name FROM tasks_relational)
        LOOP
            DBMS_OUTPUT.PUT_LINE('Task ID: ' || rec.task_id || ', Task Name: ' || rec.task_name ||
                                 ', Client ID: ' || rec.client_id || ', Client Name: ' || rec.client_name);
        END LOOP;

    -- 4b. Преобразование в коллекцию другого типа
    DBMS_OUTPUT.PUT_LINE('=== 4b. Преобразование в коллекцию другого типа ===');
    k_simple.EXTEND(k1.COUNT);
    FOR i IN 1..k1.COUNT
        LOOP
            k_simple(i) := task_simple_type(k1(i).task_id, k1(i).task_name);
        END LOOP;

    FOR i IN 1..k_simple.COUNT
        LOOP
            DBMS_OUTPUT.PUT_LINE('Simple Task: ' || k_simple(i).task_name);
        END LOOP;

    -- 5. Демонстрация BULK-операций
    DBMS_OUTPUT.PUT_LINE('=== 5. Демонстрация BULK-операций ===');
    updates.EXTEND(2);
    updates(1).task_id := 1;
    updates(1).new_task_name := 'Updated Task 1';
    updates(2).task_id := 2;
    updates(2).new_task_name := 'Updated Task 2';

    FORALL i IN 1..updates.COUNT
        UPDATE tasks
        SET task_name = updates(i).new_task_name
        WHERE task_id = updates(i).task_id;

    COMMIT;
    DBMS_OUTPUT.PUT_LINE('BULK UPDATE completed. Rows affected: ' || SQL%ROWCOUNT);

    -- Проверка результата обновления
    DBMS_OUTPUT.PUT_LINE('Updated tasks:');
    FOR rec IN (SELECT task_id, task_name FROM tasks WHERE task_id IN (1, 2))
        LOOP
            DBMS_OUTPUT.PUT_LINE('Task ID: ' || rec.task_id || ', Updated Task Name: ' || rec.task_name);
        END LOOP;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error in main block: ' || SQLERRM);
        RAISE;
END;
/