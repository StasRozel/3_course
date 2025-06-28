CREATE TABLE Clients_OBJ OF Client_Type (
    id PRIMARY KEY
);

CREATE TABLE Clients (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name NVARCHAR2(255),
    contact_info NVARCHAR2(255)
);

SELECT * FROM Clients;

INSERT INTO Clients (name, contact_info) VALUES ('ООО Технологии', 'info@tech.com');
INSERT INTO Clients (name, contact_info) VALUES ('ИП Иванов', '+79123456789');
INSERT INTO Clients (name, contact_info) VALUES ('ЗАО Прогресс', 'office@progress.ru');
INSERT INTO Clients (name, contact_info) VALUES ('Компания ABC', 'contact@abc.org');
INSERT INTO Clients (name, contact_info) VALUES ('Фирма XYZ', '+74951234567');

INSERT INTO Clients_OBJ (id, name, contact_info)
SELECT id, name, contact_info FROM Clients;

CREATE TABLE Tasks_OBJ OF Task_Type (
    id PRIMARY KEY,
    SCOPE FOR (client_ref) IS Clients_OBJ
);

SELECT * FROM Clients_OBJ;

SELECT * FROM Tasks_OBJ;

CREATE TABLE Tasks (
                       id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                       client_id NUMBER,
                       equipment_id NUMBER,
                       assigned_employee_id NUMBER,
                       request_date DATE,
                       problem_description CLOB,
                       status NVARCHAR2(50),
                       completion_date DATE,
                       CONSTRAINT fk_tasks_client FOREIGN KEY (client_id) REFERENCES Clients(id),
                       CONSTRAINT fk_tasks_equipment FOREIGN KEY (equipment_id) REFERENCES Equipment(id),
                       CONSTRAINT fk_tasks_employee FOREIGN KEY (assigned_employee_id) REFERENCES Employees(id)
);

INSERT INTO Tasks (client_id, equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date)
VALUES (1, 1, 1, SYSDATE-10, 'Неисправность в системе охлаждения', 'В работе', NULL);

INSERT INTO Tasks (client_id, equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date)
VALUES (2, 2, 2, SYSDATE-5, 'Замена масла', 'Ожидает', NULL);

INSERT INTO Tasks (client_id, equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date)
VALUES (3, 3, 3, SYSDATE-15, 'Калибровка измерительных приборов', 'Выполнено', SYSDATE-2);

INSERT INTO Tasks_OBJ (id, client_ref, equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date)
SELECT t.id,
       REF(c) as client_ref,
       t.equipment_id,
       t.assigned_employee_id,
       t.request_date,
       t.problem_description,
       t.status,
       t.completion_date
FROM Tasks t
         JOIN Clients_OBJ c ON t.client_id = c.id;
