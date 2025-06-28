CREATE OR REPLACE PROCEDURE GetSubordinateNodes(
    p_node_id IN NUMBER
) AS
BEGIN
FOR rec IN (
        SELECT
            LEVEL AS hierarchy_level,
            id,
            name,
            position
        FROM Employees
        START WITH id = p_node_id
        CONNECT BY PRIOR id = parent_id
        ORDER BY LEVEL, name
    ) LOOP
        DBMS_OUTPUT.PUT_LINE(
            'Level: ' || rec.hierarchy_level ||
            ', ID: ' || rec.id ||
            ', Name: ' || rec.name ||
            ', Position: ' || rec.position
        );
END LOOP;
END;
/