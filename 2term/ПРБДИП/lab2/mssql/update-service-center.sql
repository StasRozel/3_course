CREATE PROCEDURE UpdateServiceCenter
    @Id INT,
    @Name NVARCHAR(255),
    @Address NVARCHAR(255),
    @ContactInfo NVARCHAR(255),
    @Specialization NVARCHAR(255)
AS
BEGIN
    UPDATE ServiceCenters
    SET
        name = @Name,
        address = @Address,
        contact_info = @ContactInfo,
        specialization = @Specialization
    WHERE id = @Id;
END;