CREATE PROCEDURE GetSubordinateNodes
@NodeId INT
AS
BEGIN
    WITH EmployeeHierarchy AS (
        SELECT
            id,
            name,
            position,
            parent_id,
            1 AS hierarchy_level
        FROM Employees
        WHERE id = @NodeId
        UNION ALL
        SELECT
            e.id,
            e.name,
            e.position,
            e.parent_id,
            eh.hierarchy_level + 1
        FROM Employees e
                 INNER JOIN EmployeeHierarchy eh ON e.parent_id = eh.id
    )
    SELECT
        hierarchy_level AS Level,
        id,
        name,
        position,
        parent_id
    FROM EmployeeHierarchy
    OPTION (MAXRECURSION 1000); -- Увеличиваем лимит до 1000
END;

    DROP PROCEDURE GetSubordinateNodes;