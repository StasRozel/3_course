CREATE PROCEDURE DeleteServiceCenter
    @Id INT
AS
BEGIN
    DELETE FROM ServiceCenters
    WHERE id = @Id;
END;