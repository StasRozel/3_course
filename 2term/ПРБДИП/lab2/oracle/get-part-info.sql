CREATE OR REPLACE FUNCTION GetPartInfo (
    p_PartId IN NUMBER
) RETURN NUMBER
AS
    v_PartInfo NUMBER;
BEGIN
    SELECT p.quantity -- Или другое числовое поле
    INTO v_PartInfo
    FROM Parts p
             JOIN Equipment e ON p.equipment_id = e.id
    WHERE p.id = p_PartId;

    RETURN v_PartInfo;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20001, 'Деталь с ID ' || p_PartId || ' не найдена');
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20002, 'Ошибка при получении информации о детали: ' || SQLERRM);
END GetPartInfo;
/