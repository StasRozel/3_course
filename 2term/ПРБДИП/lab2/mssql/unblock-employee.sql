CREATE PROCEDURE UnblockEmployee
    @EmployeeId INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Employees
    SET is_blocked = 0
    WHERE id = @EmployeeId;
END