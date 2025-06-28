CREATE OR REPLACE PROCEDURE AddSubordinateNode(
    p_parent_id IN NUMBER,
    p_name IN NVARCHAR2,
    p_position IN NVARCHAR2
) AS
BEGIN
INSERT INTO Employees (name, position, parent_id, hire_date)
VALUES (p_name, p_position, p_parent_id, SYSDATE);

COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20001, 'Error adding subordinate node: ' || SQLERRM);
END;
/