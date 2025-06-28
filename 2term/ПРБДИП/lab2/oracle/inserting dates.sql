-- Insert into Employees
INSERT INTO Employees (name, position, contact_info, hire_date, is_blocked) VALUES
    (N'Ivan Petrov', N'Mechanic', N'+7-912-345-67-89', TO_DATE('2022-03-15', 'YYYY-MM-DD'), 0);
INSERT INTO Employees (name, position, contact_info, hire_date, is_blocked) VALUES
    (N'Anna Smirnova', N'Manager', N'+7-923-456-78-90', TO_DATE('2021-11-01', 'YYYY-MM-DD'), 0);
INSERT INTO Employees (name, position, contact_info, hire_date, is_blocked) VALUES
    (N'Sergey Ivanov', N'Technician', N'+7-934-567-89-01', TO_DATE('2023-01-20', 'YYYY-MM-DD'), 0);
INSERT INTO Employees (name, position, contact_info, hire_date, is_blocked) VALUES
    (N'Elena Kuznetsova', N'Engineer', N'+7-945-678-90-12', TO_DATE('2020-06-10', 'YYYY-MM-DD'), 0);
INSERT INTO Employees (name, position, contact_info, hire_date, is_blocked) VALUES
    (N'Dmitry Sokolov', N'Mechanic', N'+7-956-789-01-23', TO_DATE('2022-09-05', 'YYYY-MM-DD'), 1);

-- Insert into ServiceCenters
INSERT INTO ServiceCenters (name, address, contact_info, specialization) VALUES
    (N'Center #1', N'Lenina St, 10, Moscow', N'+7-495-123-45-67', N'Heavy machinery repair');
INSERT INTO ServiceCenters (name, address, contact_info, specialization) VALUES
    (N'Center #2', N'Mira Ave, 25, St. Petersburg', N'+7-812-234-56-78', N'Equipment diagnostics');
INSERT INTO ServiceCenters (name, address, contact_info, specialization) VALUES
    (N'Center #3', N'Sovetskaya St, 5, Yekaterinburg', N'+7-343-345-67-89', N'Electronics maintenance');
INSERT INTO ServiceCenters (name, address, contact_info, specialization) VALUES
    (N'Center #4', N'Gagarina St, 15, Novosibirsk', N'+7-383-456-78-90', N'Engine repair');
INSERT INTO ServiceCenters (name, address, contact_info, specialization) VALUES
    (N'Center #5', N'Pobedy St, 30, Kazan', N'+7-843-567-89-01', N'General maintenance');

-- Insert into Equipment
INSERT INTO Equipment (service_center_id, name, type, serial_number, purchase_date, current_location_id, mileage, fuel_consumption_rate) VALUES
    (1, N'Bulldozer D10', N'Heavy machinery', N'SN12345', TO_DATE('2021-05-12', 'YYYY-MM-DD'), 1, 1500, 25.5);
INSERT INTO Equipment (service_center_id, name, type, serial_number, purchase_date, current_location_id, mileage, fuel_consumption_rate) VALUES
    (2, N'Diagnostic Scanner', N'Electronics', N'SN67890', TO_DATE('2022-08-20', 'YYYY-MM-DD'), 2, 0, 0.0);
INSERT INTO Equipment (service_center_id, name, type, serial_number, purchase_date, current_location_id, mileage, fuel_consumption_rate) VALUES
    (3, N'Generator G500', N'Power equipment', N'SN54321', TO_DATE('2020-11-30', 'YYYY-MM-DD'), 3, 200, 15.0);
INSERT INTO Equipment (service_center_id, name, type, serial_number, purchase_date, current_location_id, mileage, fuel_consumption_rate) VALUES
    (4, N'Engine V8', N'Engine', N'SN98765', TO_DATE('2023-02-15', 'YYYY-MM-DD'), 4, 0, 0.0);
INSERT INTO Equipment (service_center_id, name, type, serial_number, purchase_date, current_location_id, mileage, fuel_consumption_rate) VALUES
    (5, N'Excavator E200', N'Heavy machinery', N'SN11223', TO_DATE('2021-09-10', 'YYYY-MM-DD'), 5, 1200, 20.8);

-- Insert into RepairRequests
INSERT INTO RepairRequests (equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date) VALUES
    (1, 1, TO_DATE('2025-03-01', 'YYYY-MM-DD'), N'Hydraulic failure', N'B работе', NULL);
INSERT INTO RepairRequests (equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date) VALUES
    (2, 3, TO_DATE('2025-02-15', 'YYYY-MM-DD'), N'Scanner software error', N'Готов', TO_DATE('2025-03-10', 'YYYY-MM-DD'));
INSERT INTO RepairRequests (equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date) VALUES
    (3, 4, TO_DATE('2025-01-20', 'YYYY-MM-DD'), N'Generator overheating', N'Okugaar', NULL);
INSERT INTO RepairRequests (equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date) VALUES
    (4, 5, TO_DATE('2025-03-05', 'YYYY-MM-DD'), N'Engine oil leak', N'B работе', NULL);
INSERT INTO RepairRequests (equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date) VALUES
    (5, 2, TO_DATE('2025-02-28', 'YYYY-MM-DD'), N'Bucket wear', N'Готов', TO_DATE('2025-03-25', 'YYYY-MM-DD'));

-- Insert into Maintenance
INSERT INTO Maintenance (equipment_id, maintenance_type, date_performed, next_due_date, cost, notes) VALUES
    (1, N'Oil change', TO_DATE('2024-12-10', 'YYYY-MM-DD'), TO_DATE('2025-06-10', 'YYYY-MM-DD'), 15000.50, N'Used synthetic oil');
INSERT INTO Maintenance (equipment_id, maintenance_type, date_performed, next_due_date, cost, notes) VALUES
    (2, N'Software update', TO_DATE('2025-01-15', 'YYYY-MM-DD'), TO_DATE('2026-01-15', 'YYYY-MM-DD'), 5000.00, N'Installed version 2.3');
INSERT INTO Maintenance (equipment_id, maintenance_type, date_performed, next_due_date, cost, notes) VALUES
    (3, N'Filter cleaning', TO_DATE('2024-11-20', 'YYYY-MM-DD'), TO_DATE('2025-05-20', 'YYYY-MM-DD'), 3000.75, N'Filters replaced');
INSERT INTO Maintenance (equipment_id, maintenance_type, date_performed, next_due_date, cost, notes) VALUES
    (4, N'Valve check', TO_DATE('2025-02-01', 'YYYY-MM-DD'), TO_DATE('2025-08-01', 'YYYY-MM-DD'), 12000.00, N'All normal');
INSERT INTO Maintenance (equipment_id, maintenance_type, date_performed, next_due_date, cost, notes) VALUES
    (5, N'Node lubrication', TO_DATE('2025-03-10', 'YYYY-MM-DD'), TO_DATE('2025-09-10', 'YYYY-MM-DD'), 8000.25, N'High-temperature grease applied');

-- Insert into Parts
INSERT INTO Parts (equipment_id, name, part_number, quantity, price, supplier, last_restock_date) VALUES
    (1, N'Hydraulic pump', N'PN123', 2, 45000.00, N'TechnoImport', TO_DATE('2025-01-10', 'YYYY-MM-DD'));
INSERT INTO Parts (equipment_id, name, part_number, quantity, price, supplier, last_restock_date) VALUES
    (2, N'USB-C cable', N'PN456', 10, 500.50, N'ElectroTorg', TO_DATE('2024-12-20', 'YYYY-MM-DD'));
INSERT INTO Parts (equipment_id, name, part_number, quantity, price, supplier, last_restock_date) VALUES
    (3, N'Voltage relay', N'PN789', 5, 2000.75, N'EnergoSnab', TO_DATE('2025-02-15', 'YYYY-MM-DD'));
INSERT INTO Parts (equipment_id, name, part_number, quantity, price, supplier, last_restock_date) VALUES
    (4, N'Oil filter', N'PN101', 8, 1500.00, N'AutoParts', TO_DATE('2025-03-01', 'YYYY-MM-DD'));
INSERT INTO Parts (equipment_id, name, part_number, quantity, price, supplier, last_restock_date) VALUES
    (5, N'Bucket tooth', N'PN202', 3, 30000.00, N'StroyTech', TO_DATE('2025-02-25', 'YYYY-MM-DD'));

SELECT * FROM PARTS;
SELECT * FROM EQUIPMENT;

