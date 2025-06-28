CREATE OR REPLACE TYPE Client_Type AS OBJECT
(
    id           NUMBER,
    name         NVARCHAR2(255),
    contact_info NVARCHAR2(255),

    CONSTRUCTOR FUNCTION Client_Type(
        p_name NVARCHAR2,
        p_contact_info NVARCHAR2
    ) RETURN SELF AS RESULT,

    ORDER MEMBER FUNCTION compare_clients(other Client_Type) RETURN INTEGER,

    MEMBER FUNCTION is_valid_contact RETURN NUMBER,

    MEMBER PROCEDURE display_info
);
/

CREATE OR REPLACE TYPE BODY Client_Type AS

    CONSTRUCTOR FUNCTION Client_Type(
        p_name NVARCHAR2,
        p_contact_info NVARCHAR2
    ) RETURN SELF AS RESULT IS
    BEGIN
        id := NULL;
        name := p_name;
        contact_info := p_contact_info;
        RETURN;
    END;

    -- Реализация метода сравнения
    ORDER MEMBER FUNCTION compare_clients(other Client_Type) RETURN INTEGER IS
    BEGIN
        IF name < other.name THEN
            RETURN -1;
        ELSIF name > other.name THEN
            RETURN 1;
        ELSE
            RETURN 0;
        END IF;
    END;

    -- Реализация метода is_valid_contact (возвращает NUMBER: 1 для TRUE, 0 для FALSE)
    MEMBER FUNCTION is_valid_contact RETURN NUMBER IS
    BEGIN
        IF contact_info IS NOT NULL AND LENGTH(TRIM(contact_info)) > 0 THEN
            RETURN 1;
        ELSE
            RETURN 0;
        END IF;
    END;

    -- Реализация процедуры display_info
    MEMBER PROCEDURE display_info IS
    BEGIN
        DBMS_OUTPUT.PUT_LINE('ID: ' || id || ', Name: ' || name || ', Contact: ' || contact_info);
    END;
END;
/

CREATE OR REPLACE TYPE Task_Type AS OBJECT
(
    id                   NUMBER,
    client_ref           REF Client_Type,
    equipment_id         NUMBER,
    assigned_employee_id NUMBER,
    request_date         DATE,
    problem_description  CLOB,
    status               NVARCHAR2(50),
    completion_date      DATE,

    CONSTRUCTOR FUNCTION Task_Type(
        p_client_ref REF Client_Type,
        p_equipment_id NUMBER,
        p_problem_description CLOB
    ) RETURN SELF AS RESULT,

    MAP MEMBER FUNCTION get_priority RETURN NUMBER,

    MEMBER FUNCTION get_task_age RETURN NUMBER,

    MEMBER PROCEDURE change_status(p_new_status NVARCHAR2)
);
/

CREATE OR REPLACE TYPE BODY Task_Type AS
    CONSTRUCTOR FUNCTION Task_Type(
        p_client_ref REF Client_Type,
        p_equipment_id NUMBER,
        p_problem_description CLOB
    ) RETURN SELF AS RESULT IS
    BEGIN
        self.id := NULL;
        self.client_ref := p_client_ref;
        self.equipment_id := p_equipment_id;
        self.assigned_employee_id := NULL;
        self.request_date := SYSDATE;
        self.problem_description := p_problem_description;
        self.status := 'Ожидает';
        self.completion_date := NULL;
        RETURN;
    END;

    -- Метод сравнения MAP
    MAP MEMBER FUNCTION get_priority RETURN NUMBER IS
        v_age NUMBER;
    BEGIN
        v_age := get_task_age();

        IF status = 'Ожидает' THEN
            RETURN v_age * 2;
        ELSIF status = 'В работе' THEN
            RETURN v_age;
        ELSE
            RETURN 0;
        END IF;
    END;

    -- Функция как метод экземпляра
    MEMBER FUNCTION get_task_age RETURN NUMBER IS
    BEGIN
        IF completion_date IS NOT NULL THEN
            RETURN completion_date - request_date;
        ELSE
            RETURN SYSDATE - request_date;
        END IF;
    END;

    -- Процедура как метод экземпляра
    MEMBER PROCEDURE change_status(p_new_status NVARCHAR2) IS
    BEGIN
        -- Обновить статус задачи
        IF p_new_status IN ('Ожидает', 'В работе', 'Выполнено') THEN
            status := p_new_status;

            -- Если задача завершена, установить дату завершения
            IF p_new_status = 'Выполнено' AND completion_date IS NULL THEN
                completion_date := SYSDATE;
            ELSIF p_new_status != 'Выполнено' THEN
                completion_date := NULL;
            END IF;

            DBMS_OUTPUT.PUT_LINE('Статус задачи изменен на: ' || p_new_status);
        ELSE
            DBMS_OUTPUT.PUT_LINE('Неверный статус. Допустимые значения: Ожидает, В работе, Выполнено');
        END IF;
    END;
END;
/