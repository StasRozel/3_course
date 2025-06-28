CREATE OR REPLACE PROCEDURE AddServiceCenter(
    p_Name IN NVARCHAR2,
    p_Address IN NVARCHAR2,
    p_ContactInfo IN NVARCHAR2,
    p_Specialization IN NVARCHAR2
)
AS
BEGIN
    INSERT INTO ServiceCenters (name, address, contact_info, specialization)
    VALUES (p_Name, p_Address, p_ContactInfo, p_Specialization);
    COMMIT;
END;
/
