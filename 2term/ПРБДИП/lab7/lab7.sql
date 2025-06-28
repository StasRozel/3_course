ALTER TABLE Employees
    ADD (
        salary NUMBER(10, 2) DEFAULT 50000, -- Месячная зарплата в условных единицах
        department VARCHAR2(50) DEFAULT 'Mechanics'
        );
SELECT * FROM EMPLOYEES;
UPDATE Employees
SET
    salary = CASE id
                 WHEN 1 THEN 60000
                 WHEN 2 THEN 55000
                 WHEN 3 THEN 52000
                 WHEN 4 THEN 58000
                 WHEN 5 THEN 51000
                 ELSE salary -- Сохраняем текущее значение для остальных id
        END,
    department = CASE id
                     WHEN 1 THEN 'Mechanics'
                     WHEN 2 THEN 'Managers'
                     WHEN 3 THEN 'Technicians'
                     WHEN 4 THEN 'Technicians'
                     WHEN 5 THEN 'Mechanics'
                     ELSE department -- Сохраняем текущее значение для остальных id
        END
WHERE
    id IN (1, 2, 3, 4, 5);
SELECT  * FROM REPAIRREQUESTS;
select * from EMPLOYEES;


INSERT INTO RepairRequests (equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date)
VALUES (1, 1, TO_DATE('2024-10-01', 'YYYY-MM-DD'), 'Hydraulic issue', 'Готов', TO_DATE('2024-10-05', 'YYYY-MM-DD'));

INSERT INTO RepairRequests (equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date)
VALUES (2, 3, TO_DATE('2024-10-15', 'YYYY-MM-DD'), 'Software glitch', 'Готов', TO_DATE('2024-10-20', 'YYYY-MM-DD'));

INSERT INTO RepairRequests (equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date)
VALUES (3, 4, TO_DATE('2024-11-01', 'YYYY-MM-DD'), 'Overheating', 'Готов', TO_DATE('2024-11-10', 'YYYY-MM-DD'));

INSERT INTO RepairRequests (equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date)
VALUES (4, 5, TO_DATE('2024-11-15', 'YYYY-MM-DD'), 'Oil leak', 'Готов', TO_DATE('2024-11-20', 'YYYY-MM-DD'));

INSERT INTO RepairRequests (equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date)
VALUES (5, 2, TO_DATE('2024-12-01', 'YYYY-MM-DD'), 'Wear issue', 'Готов', TO_DATE('2024-12-05', 'YYYY-MM-DD'));

INSERT INTO RepairRequests (equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date)
VALUES (1, 1, TO_DATE('2024-12-10', 'YYYY-MM-DD'), 'Hydraulic issue 2', 'Готов', TO_DATE('2024-12-15', 'YYYY-MM-DD'));

INSERT INTO RepairRequests (equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date)
VALUES (2, 3, TO_DATE('2025-01-01', 'YYYY-MM-DD'), 'Software issue', 'Готов', TO_DATE('2025-01-10', 'YYYY-MM-DD'));

INSERT INTO RepairRequests (equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date)
VALUES (3, 4, TO_DATE('2025-02-01', 'YYYY-MM-DD'), 'Cooling failure', 'Готов', TO_DATE('2025-02-05', 'YYYY-MM-DD'));

INSERT INTO RepairRequests (equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date)
VALUES (4, 5, TO_DATE('2025-02-15', 'YYYY-MM-DD'), 'Leak issue', 'Готов', TO_DATE('2025-02-20', 'YYYY-MM-DD'));

