CREATE PROCEDURE UpdateEmployee
    @id INT,
    @name NVARCHAR(255) = NULL,
    @position NVARCHAR(100) = NULL,
    @contact_info NVARCHAR(255) = NULL,
    @hire_date DATE = NULL
AS
BEGIN
    UPDATE Employees
    SET
        name = ISNULL(@name, name),
        position = ISNULL(@position, position),
        contact_info = ISNULL(@contact_info, contact_info),
        hire_date = ISNULL(@hire_date, hire_date)
    WHERE id = @id;
END;

DROP PROCEDURE UpdateEmployee