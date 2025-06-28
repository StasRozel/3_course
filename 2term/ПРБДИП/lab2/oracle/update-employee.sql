CREATE OR REPLACE PROCEDURE UpdateEmployee
(
    p_id IN NUMBER,
    p_name IN VARCHAR2 DEFAULT NULL,
    p_position IN VARCHAR2 DEFAULT NULL,
    p_contact_info IN VARCHAR2 DEFAULT NULL,
    p_hire_date IN DATE DEFAULT NULL
)
AS
BEGIN
    UPDATE Employees
    SET
        name = NVL(p_name, name),
        position = NVL(p_position, position),
        contact_info = NVL(p_contact_info, contact_info),
        hire_date = NVL(p_hire_date, hire_date)
    WHERE id = p_id;
END UpdateEmployee;
/