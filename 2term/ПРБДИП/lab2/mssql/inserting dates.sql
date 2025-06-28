-- Insert into Employees
INSERT INTO Employees (name, position, contact_info, hire_date, is_blocked) VALUES
                                                                                (N'Ivan Petrov', N'Mechanic', N'+7-912-345-67-89', '2022-03-15', 0),
                                                                                (N'Anna Smirnova', N'Manager', N'+7-923-456-78-90', '2021-11-01', 0),
                                                                                (N'Sergey Ivanov', N'Technician', N'+7-934-567-89-01', '2023-01-20', 0),
                                                                                (N'Elena Kuznetsova', N'Engineer', N'+7-945-678-90-12', '2020-06-10', 0),
                                                                                (N'Dmitry Sokolov', N'Mechanic', N'+7-956-789-01-23', '2022-09-05', 1);

-- Insert into ServiceCenters
INSERT INTO ServiceCenters (name, address, contact_info, specialization) VALUES
                                                                             (N'Center #1', N'Lenina St, 10, Moscow', N'+7-495-123-45-67', N'Heavy machinery repair'),
                                                                             (N'Center #2', N'Mira Ave, 25, St. Petersburg', N'+7-812-234-56-78', N'Equipment diagnostics'),
                                                                             (N'Center #3', N'Sovetskaya St, 5, Yekaterinburg', N'+7-343-345-67-89', N'Electronics maintenance'),
                                                                             (N'Center #4', N'Gagarina St, 15, Novosibirsk', N'+7-383-456-78-90', N'Engine repair'),
                                                                             (N'Center #5', N'Pobedy St, 30, Kazan', N'+7-843-567-89-01', N'General maintenance');

-- Insert into Equipment
INSERT INTO Equipment (service_center_id, name, type, serial_number, purchase_date, current_location_id, mileage, fuel_consumption_rate) VALUES
                                                                                                                                             (1, N'Bulldozer D10', N'Heavy machinery', N'SN12345', '2021-05-12', 1, 1500, 25.5),
                                                                                                                                             (2, N'Diagnostic Scanner', N'Electronics', N'SN67890', '2022-08-20', 2, 0, 0.0),
                                                                                                                                             (3, N'Generator G500', N'Power equipment', N'SN54321', '2020-11-30', 3, 200, 15.0),
                                                                                                                                             (4, N'Engine V8', N'Engine', N'SN98765', '2023-02-15', 4, 0, 0.0),
                                                                                                                                             (5, N'Excavator E200', N'Heavy machinery', N'SN11223', '2021-09-10', 5, 1200, 20.8);

-- Insert into RepairRequests
INSERT INTO RepairRequests (equipment_id, assigned_employee_id, request_date, problem_description, status, completion_date) VALUES
                                                                                                                                (1, 1, '2025-03-01', N'Hydraulic failure', N'In progress', NULL),
                                                                                                                                (2, 3, '2025-02-15', N'Scanner software error', N'Completed', '2025-03-10'),
                                                                                                                                (3, 4, '2025-01-20', N'Generator overheating', N'Pending', NULL),
                                                                                                                                (4, 5, '2025-03-05', N'Engine oil leak', N'In progress', NULL),
                                                                                                                                (5, 2, '2025-02-28', N'Bucket wear', N'Completed', '2025-03-25');

-- Insert into Maintenance
INSERT INTO Maintenance (equipment_id, maintenance_type, date_performed, next_due_date, cost, notes) VALUES
                                                                                                         (1, N'Oil change', '2024-12-10', '2025-06-10', 15000.50, N'Used synthetic oil'),
                                                                                                         (2, N'Software update', '2025-01-15', '2026-01-15', 5000.00, N'Installed version 2.3'),
                                                                                                         (3, N'Filter cleaning', '2024-11-20', '2025-05-20', 3000.75, N'Filters replaced'),
                                                                                                         (4, N'Valve check', '2025-02-01', '2025-08-01', 12000.00, N'All normal'),
                                                                                                         (5, N'Node lubrication', '2025-03-10', '2025-09-10', 8000.25, N'High-temperature grease applied');

-- Insert into Parts
INSERT INTO Parts (equipment_id, name, part_number, quantity, price, supplier, last_restock_date) VALUES
                                                                                                      (1, N'Hydraulic pump', N'PN123', 2, 45000.00, N'TechnoImport', '2025-01-10'),
                                                                                                      (2, N'USB-C cable', N'PN456', 10, 500.50, N'ElectroTorg', '2024-12-20'),
                                                                                                      (3, N'Voltage relay', N'PN789', 5, 2000.75, N'EnergoSnab', '2025-02-15'),
                                                                                                      (4, N'Oil filter', N'PN101', 8, 1500.00, N'AutoParts', '2025-03-01'),
                                                                                                      (5, N'Bucket tooth', N'PN202', 3, 30000.00, N'StroyTech', '2025-02-25');



