CREATE OR REPLACE TYPE TaskRecord AS OBJECT
(
    id                   NUMBER,
    repair_request_id    NUMBER,
    assigned_employee_id NUMBER,
    task_description     CLOB,
    task_date            DATE,
    estimated_hours      NUMBER,
    status               NVARCHAR2(50)
);

CREATE OR REPLACE TYPE TaskTable AS TABLE OF TaskRecord;

drop type TASKTABLE;

CREATE OR REPLACE FUNCTION fn_GetTasksByDate(p_start_date IN DATE, p_end_date IN DATE)
    RETURN TaskTable
    PIPELINED
    IS
BEGIN
    FOR rec IN (
        SELECT t.id,
               t.repair_request_id,
               t.assigned_employee_id,
               t.task_description,
               t.task_date,
               t.estimated_hours,
               t.status
        FROM Tasks t
                 JOIN Employees e ON t.assigned_employee_id = e.id
        WHERE t.task_date BETWEEN p_start_date AND p_end_date
        )
        LOOP
            PIPE ROW (TaskRecord(
                    rec.id,
                    rec.repair_request_id,
                    rec.assigned_employee_id,
                    rec.task_description,
                    rec.task_date,
                    rec.estimated_hours,
                    rec.status
                      ));
        END LOOP;
    RETURN;
END;
/

CREATE OR REPLACE TYPE ClientRecord AS OBJECT
(
    id                NUMBER,
    name              NVARCHAR2(255),
    contact_info      NVARCHAR2(255),
    registration_date DATE,
    loyalty_points    NUMBER(10, 2)
);

CREATE OR REPLACE TYPE ClientTable AS TABLE OF ClientRecord;

CREATE OR REPLACE FUNCTION fn_GetClientsByDate(p_start_date IN DATE, p_end_date IN DATE)
    RETURN ClientTable
    PIPELINED
    IS
BEGIN
    FOR rec IN (
        SELECT id,
               name,
               contact_info,
               registration_date,
               loyalty_points
        FROM Clients
        WHERE registration_date BETWEEN p_start_date AND p_end_date
        )
        LOOP
            PIPE ROW (ClientRecord(
                    rec.id,
                    rec.name,
                    rec.contact_info,
                    rec.registration_date,
                    rec.loyalty_points
                      ));
        END LOOP;
    RETURN;
END;
/
SELECT *
FROM TABLE (fn_GetTasksByDate(TO_DATE('2025-01-01', 'YYYY-MM-DD'), TO_DATE('2025-12-31', 'YYYY-MM-DD')));

ALTER USER C##RSA_ADMIN IDENTIFIED BY A11111;

truncate table CLIENTS;
