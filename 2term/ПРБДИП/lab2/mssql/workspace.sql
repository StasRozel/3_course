ALTER TABLE Employees
    ADD hierarchy_path HIERARCHYID;

ALTER TABLE Employees
    DROP COLUMN hierarchy_path;

-- Создаем первичный индекс для иерархического столбца
CREATE UNIQUE INDEX idx_hierarchy_path
    ON Employees(hierarchy_path);

ALTER TABLE Employees
    ADD parent_id INT NULL
        CONSTRAINT fk_employee_parent FOREIGN KEY (parent_id) REFERENCES Employees(id);

-- Создаем индекс для ускорения запросов
CREATE INDEX idx_employee_parent ON Employees(parent_id);

SELECT * FROM Employees;

-- Добавляем корневого сотрудника
INSERT INTO Employees (name, position, parent_id, hire_date)
VALUES ('Ivan', 'Director', NULL, GETDATE());

EXEC GetSubordinateNodes @NodeId = 2;

EXEC AddSubordinateNode @ParentId = 2, @EmployeeName = 'Ivanov', @Position = 'Assistent';

EXEC MoveSubordinateNodes @SourceParentId = 3004, @TargetParentId = 3;