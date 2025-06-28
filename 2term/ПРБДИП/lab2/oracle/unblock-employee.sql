CREATE OR REPLACE PROCEDURE UnblockEmployee
(
    p_EmployeeId IN NUMBER
)
AS
BEGIN
    UPDATE Employees
    SET is_blocked = 0
    WHERE id = p_EmployeeId;
END UnblockEmployee;
/