CREATE TABLE RSA_T1 (
    id NUMBER PRIMARY KEY,
    data VARCHAR2(50)
) TABLESPACE RSA_QDATA;


INSERT INTO RSA_T1 (id, data) VALUES (1, 'Data 1');
INSERT INTO RSA_T1 (id, data) VALUES (2, 'Data 2');
INSERT INTO RSA_T1 (id, data) VALUES (3, 'Data 3');

DROP TABLE RSA_T1;

SELECT * FROM RSA_T1

SELECT * FROM USER_RECYCLEBIN;

FLASHBACK TABLE "BIN$kqKHRHnZQky0qLaNcr/nGg==$0" TO BEFORE DROP;

DECLARE
    v_id NUMBER;
    v_data VARCHAR2(50);
BEGIN
    FOR i IN 4..10004 LOOP
        v_id := i;
        v_data := 'Data ' || TO_CHAR(i);
        INSERT INTO RSA_T1 (id, data) VALUES (v_id, v_data);
    END LOOP;
    COMMIT;
END;


