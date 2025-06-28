CREATE TABLE Employees
(
    id           INT IDENTITY (1,1) PRIMARY KEY,
    name         NVARCHAR(255),
    position     NVARCHAR(100),
    contact_info NVARCHAR(255),
    hire_date    DATE,
    is_blocked   BIT DEFAULT 0
);

CREATE TABLE ServiceCenters
(
    id             INT IDENTITY (1,1) PRIMARY KEY,
    name           NVARCHAR(255),
    address        NVARCHAR(255),
    contact_info   NVARCHAR(255),
    specialization NVARCHAR(255)
);

CREATE TABLE Equipment
(
    id                    INT IDENTITY (1,1) PRIMARY KEY,
    service_center_id     INT,
    name                  NVARCHAR(255),
    type                  NVARCHAR(100),
    serial_number         NVARCHAR(100) UNIQUE,
    purchase_date         DATE,
    current_location_id   INT,
    mileage               INT,
    fuel_consumption_rate DECIMAL(10, 2),
    FOREIGN KEY (service_center_id) REFERENCES ServiceCenters (id)
);

CREATE TABLE RepairRequests
(
    id                   INT IDENTITY (1,1) PRIMARY KEY,
    equipment_id         INT,
    assigned_employee_id INT,
    request_date         DATE,
    problem_description  TEXT,
    status               NVARCHAR(50) CHECK (status IN ('Okugaar', 'B работе', 'Готов')),
    completion_date      DATE,
    FOREIGN KEY (equipment_id) REFERENCES Equipment (id),
    FOREIGN KEY (assigned_employee_id) REFERENCES Employees (id)
);

CREATE TABLE Maintenance
(
    id               INT IDENTITY (1,1) PRIMARY KEY,
    equipment_id     INT,
    maintenance_type NVARCHAR(100),
    date_performed   DATE,
    next_due_date    DATE,
    cost             DECIMAL(10, 2),
    notes            TEXT,
    FOREIGN KEY (equipment_id) REFERENCES Equipment (id)
);

CREATE TABLE Parts
(
    id                INT IDENTITY (1,1) PRIMARY KEY,
    equipment_id      INT,
    name              NVARCHAR(255),
    part_number       NVARCHAR(100),
    quantity          INT,
    price             DECIMAL(10, 2),
    supplier          NVARCHAR(255),
    last_restock_date DATE,
    FOREIGN KEY (equipment_id) REFERENCES Equipment (id)
);

CREATE TABLE Clients
(
    id                INT IDENTITY (1,1) PRIMARY KEY,
    name              NVARCHAR(255) NOT NULL,
    contact_info      NVARCHAR(255),
    registration_date DATE          NOT NULL,
    loyalty_points    DECIMAL(10, 2) DEFAULT 0.0
);

CREATE TABLE Tasks
(
    id                   INT IDENTITY (1,1) PRIMARY KEY,
    repair_request_id    INT,
    assigned_employee_id INT,
    task_description     NVARCHAR(MAX),
    task_date            DATE NOT NULL,
    estimated_hours      DECIMAL(5, 1),
    status               NVARCHAR(50),
    CONSTRAINT fk_tasks_repair FOREIGN KEY (repair_request_id) REFERENCES RepairRequests (id),
    CONSTRAINT fk_tasks_employee FOREIGN KEY (assigned_employee_id) REFERENCES Employees (id),
    CONSTRAINT chk_task_status CHECK (status IN ('Pending', 'In Progress', 'Completed'))
);