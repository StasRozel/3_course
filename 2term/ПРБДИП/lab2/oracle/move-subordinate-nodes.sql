CREATE OR REPLACE PROCEDURE MoveSubordinateNodes(
    p_source_parent_id IN NUMBER,
    p_target_parent_id IN NUMBER
) AS
BEGIN
UPDATE Employees
SET parent_id = p_target_parent_id
WHERE parent_id = p_source_parent_id;

COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20002, 'Error moving nodes: ' || SQLERRM);
END;
/