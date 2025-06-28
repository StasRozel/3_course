CREATE PROCEDURE AddServiceCenter
    @Name NVARCHAR(255),
    @Address NVARCHAR(255),
    @ContactInfo NVARCHAR(255),
    @Specialization NVARCHAR(255)
AS
BEGIN
    INSERT INTO ServiceCenters (name, address, contact_info, specialization)
    VALUES (@Name, @Address, @ContactInfo, @Specialization);
END;