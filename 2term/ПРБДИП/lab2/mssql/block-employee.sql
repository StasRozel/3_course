CREATE PROCEDURE BlockEmployee
    @EmployeeId INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Employees
    SET is_blocked = 1
    WHERE id = @EmployeeId;
END