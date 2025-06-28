CREATE OR REPLACE PROCEDURE UpdateServiceCenter
(
    p_Id IN NUMBER,
    p_Name IN VARCHAR2,
    p_Address IN VARCHAR2,
    p_ContactInfo IN VARCHAR2,
    p_Specialization IN VARCHAR2
)
AS
BEGIN
    UPDATE ServiceCenters
    SET
        name = p_Name,
        address = p_Address,
        contact_info = p_ContactInfo,
        specialization = p_Specialization
    WHERE id = p_Id;
END UpdateServiceCenter;
/