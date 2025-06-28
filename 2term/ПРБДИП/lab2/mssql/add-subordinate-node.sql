CREATE PROCEDURE AddSubordinateNode
    @ParentId INT,
    @EmployeeName NVARCHAR(255),
    @Position NVARCHAR(100)
AS
BEGIN
    INSERT INTO Employees (name, position, parent_id, hire_date)
    VALUES (@EmployeeName, @Position, @ParentId, GETDATE());
END;