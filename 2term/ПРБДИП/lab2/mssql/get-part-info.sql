CREATE PROCEDURE GetPartInfo
    @PartId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        p.id AS PartId,
        e.name AS EquipmentName,
        p.name AS PartName,
        p.part_number AS PartNumber,
        p.quantity AS Quantity,
        p.price AS Price,
        p.supplier AS Supplier,
        p.last_restock_date AS LastRestockDate
    FROM Parts p
    JOIN Equipment e ON p.equipment_id = e.id
    WHERE p.id = @PartId;
END