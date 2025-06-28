ALTER TABLE Employees
    ADD parent_id NUMBER
        CONSTRAINT fk_employee_parent REFERENCES Employees(id);

-- Создаем индекс для ускорения иерархических запросов
CREATE INDEX idx_employee_parent ON Employees(parent_id);

SELECT * FROM EMPLOYEES;

-- Добавляем корневого сотрудника (директор)
INSERT INTO Employees (name, position, parent_id, hire_date)
VALUES ('Иван Иванов', 'Директор', NULL, SYSDATE);

-- Добавляем подчиненных
INSERT INTO Employees (name, position, parent_id, hire_date)
VALUES ('Петр Петров', 'Менеджер', 1, SYSDATE);

INSERT INTO Employees (name, position, parent_id, hire_date)
VALUES ('Анна Сидорова', 'Специалист', 2, SYSDATE);

INSERT INTO Employees (name, position, parent_id, hire_date)
VALUES ('Мария Кузнецова', 'Специалист', 2, SYSDATE);

COMMIT;

-- Проверяем данные
SELECT id, name, position, parent_id FROM Employees;


BEGIN
    GetSubordinateNodes(5);
END;
/

BEGIN
    AddSubordinateNode(2, 'Сергей Смирнов', 'Ассистент');
END;
/

SELECT id, name, position, parent_id FROM Employees WHERE name = 'Сергей Смирнов';

BEGIN
    MoveSubordinateNodes(2, 1);
END;
/