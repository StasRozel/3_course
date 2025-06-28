CREATE PROCEDURE DeleteEmployee
    @id INT
AS
BEGIN
    DELETE FROM Employees
    WHERE id = @id;
END;

DROP PROCEDURE DeleteEmployee