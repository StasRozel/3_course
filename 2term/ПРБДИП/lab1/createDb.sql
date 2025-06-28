-- Таблица для техники
CREATE TABLE Equipment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    type VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    purchase_date DATE,
    status VARCHAR(50),
    current_location_id INT,
    mileage INT,
    fuel_consumption_rate DECIMAL(10, 2),
    service_center_id INT,
    FOREIGN KEY (service_center_id) REFERENCES ServiceCenters(id)
);

-- Таблица для технического обслуживания
CREATE TABLE Maintenance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT,
    maintenance_type VARCHAR(100),
    date_performed DATE,
    next_due_date DATE,
    cost DECIMAL(10, 2),
    notes TEXT,
    FOREIGN KEY (equipment_id) REFERENCES Equipment(id)
);

-- Таблица для запчастей
CREATE TABLE Parts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    part_number VARCHAR(100),
    equipment_id INT,
    quantity INT,
    price DECIMAL(10, 2),
    supplier VARCHAR(255),
    last_restock_date DATE,
    FOREIGN KEY (equipment_id) REFERENCES Equipment(id)
);

-- Таблица для сотрудников
CREATE TABLE Employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    position VARCHAR(100),
    contact_info VARCHAR(255),
    assigned_equipment_id INT,
    hire_date DATE,
    FOREIGN KEY (assigned_equipment_id) REFERENCES Equipment(id)
);

-- Таблица для заявок на ремонт
CREATE TABLE RepairRequests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT,
    request_date DATE,
    problem_description TEXT,
    status VARCHAR(50),
    assigned_employee_id INT,
    completion_date DATE,
    FOREIGN KEY (equipment_id) REFERENCES Equipment(id),
    FOREIGN KEY (assigned_employee_id) REFERENCES Employees(id)
);

-- Таблица для сервисных центров
CREATE TABLE ServiceCenters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    address VARCHAR(255),
    contact_info VARCHAR(255),
    specialization VARCHAR(255)
);

-- Таблица для местоположения техники
CREATE TABLE EquipmentLocation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timestamp DATETIME,
    FOREIGN KEY (equipment_id) REFERENCES Equipment(id)
);

-- Таблица для датчиков и телеметрии
CREATE TABLE Sensors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT,
    sensor_type VARCHAR(100),
    value DECIMAL(10, 2),
    timestamp DATETIME,
    FOREIGN KEY (equipment_id) REFERENCES Equipment(id)
);
