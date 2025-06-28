CREATE OR REPLACE PROCEDURE AddEmployee(
    p_name IN NVARCHAR2,
    p_position IN NVARCHAR2,
    p_contact_info IN NVARCHAR2,
    p_hire_date IN DATE
)
AS
BEGIN
    INSERT INTO Employees (name, position, contact_info, hire_date)
    VALUES (p_name, p_position, p_contact_info, p_hire_date);
    COMMIT;
END;
/