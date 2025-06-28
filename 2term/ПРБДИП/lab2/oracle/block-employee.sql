CREATE OR REPLACE PROCEDURE BlockEmployee
(
    p_EmployeeId IN NUMBER
)
AS
BEGIN
    UPDATE Employees
    SET is_blocked = 1
    WHERE id = p_EmployeeId;
END BlockEmployee;
/