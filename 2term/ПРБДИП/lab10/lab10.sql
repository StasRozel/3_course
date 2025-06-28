-- Предполагая, что путь к данным внутри контейнера - /opt/oracle/oradata/ORCL/
CREATE TABLESPACE lob_ts
    DATAFILE '/opt/oracle/oradata/ORCLCDB/lob_data_01.dbf'
    SIZE 100M
    AUTOEXTEND ON NEXT 50M
    MAXSIZE 500M;

CREATE USER C##lob_user IDENTIFIED BY s11111
    DEFAULT TABLESPACE users
    TEMPORARY TABLESPACE temp;

CREATE OR REPLACE DIRECTORY doc_dir AS '/opt/oracle/ext_documents';

-- Предоставляем права всем пользователям для тестирования
GRANT READ, WRITE ON DIRECTORY doc_dir TO PUBLIC;

-- Предоставление необходимых привилегий
GRANT CREATE SESSION TO C##lob_user;
GRANT CREATE TABLE TO C##lob_user;
GRANT UNLIMITED TABLESPACE TO C##lob_user;
GRANT READ, WRITE ON DIRECTORY doc_dir TO C##lob_user;
-- Проверка существующих директорий в Oracle
SELECT *
FROM ALL_DIRECTORIES
WHERE DIRECTORY_NAME = 'DOC_DIR';

DROP TABLE BLOB_TABLE;

-- Создание таблицы заново
CREATE TABLE BLOB_TABLE
(
    ID   INT PRIMARY KEY,
    FOTO BLOB DEFAULT EMPTY_BLOB(),
    DOC  BFILE
);

-- Первоначальная вставка (только ID и DOC)
INSERT INTO BLOB_TABLE (ID, DOC)
VALUES (1, BFILENAME('DOC_DIR', 'doc.docx'));

COMMIT;

-- Обновление BLOB через PL/SQL
DECLARE
    v_blob       BLOB;
    v_bfile      BFILE;
    v_src_offset INTEGER := 1;
    v_dst_offset INTEGER := 1;
    v_loblen     PLS_INTEGER;
BEGIN
    -- Получаем BLOB для обновления
    SELECT foto
    INTO v_blob
    FROM BLOB_TABLE
    WHERE id = 1
        FOR UPDATE;

    -- Загружаем фото из файла
    v_bfile := BFILENAME('DOC_DIR', 'cat.jpg');

    -- Проверяем, существует ли файл
    IF DBMS_LOB.FILEEXISTS(v_bfile) = 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Файл cat.jpg не существует');
    END IF;

    -- Открываем файл
    DBMS_LOB.FILEOPEN(v_bfile, DBMS_LOB.FILE_READONLY);

    -- Получаем размер файла
    v_loblen := DBMS_LOB.GETLENGTH(v_bfile);

    -- Загружаем данные из файла в BLOB
    DBMS_LOB.LOADBLOBFROMFILE(
            dest_lob => v_blob,
            src_bfile => v_bfile,
            amount => v_loblen,
            dest_offset => v_dst_offset,
            src_offset => v_src_offset
    );

    -- Закрываем файл
    DBMS_LOB.FILECLOSE(v_bfile);

    COMMIT;

    DBMS_OUTPUT.PUT_LINE('BLOB успешно обновлен. Размер: ' || DBMS_LOB.GETLENGTH(v_blob) || ' байт');

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ошибка: ' || SQLERRM);
        IF DBMS_LOB.FILEISOPEN(v_bfile) = 1 THEN
            DBMS_LOB.FILECLOSE(v_bfile);
        END IF;
        ROLLBACK;
END;
/


COMMIT;


SELECT ID,
       DBMS_LOB.GETLENGTH(FOTO) AS FOTO_SIZE,
       DBMS_LOB.FILEEXISTS(DOC) AS DOC_EXISTS,
       DBMS_LOB.GETLENGTH(DOC)  AS DOC_SIZE
FROM BLOB_TABLE;