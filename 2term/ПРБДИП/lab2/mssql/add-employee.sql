CREATE PROCEDURE AddEmployee
    @name NVARCHAR(255),
    @position NVARCHAR(100),
    @contact_info NVARCHAR(255),
    @hire_date DATE
AS
BEGIN
    INSERT INTO Employees (name, position, contact_info, hire_date)
    VALUES (@name, @position, @contact_info, @hire_date);
END;

