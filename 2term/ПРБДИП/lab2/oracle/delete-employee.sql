CREATE OR REPLACE PROCEDURE DeleteEmployee
(
    p_id IN NUMBER
)
AS
BEGIN
    DELETE FROM Employees
    WHERE id = p_id;
END DeleteEmployee;
/