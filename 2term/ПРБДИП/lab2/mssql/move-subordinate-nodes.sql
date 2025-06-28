CREATE PROCEDURE MoveSubordinateNodes
    @SourceParentId INT,
    @TargetParentId INT
AS
BEGIN
    UPDATE Employees
    SET parent_id = @TargetParentId
    WHERE parent_id = @SourceParentId;
END;