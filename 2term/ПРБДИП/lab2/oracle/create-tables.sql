-- Таблица сотрудников
CREATE TABLE Employees
(
    id           NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name         NVARCHAR2(255),
    position     NVARCHAR2(100),
    contact_info NVARCHAR2(255),
    hire_date    DATE,
    is_blocked   NUMBER(1) DEFAULT 0
);

-- Таблица сервисных центров
CREATE TABLE ServiceCenters
(
    id             NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name           NVARCHAR2(255),
    address        NVARCHAR2(255),
    contact_info   NVARCHAR2(255),
    specialization NVARCHAR2(255)
);

-- Таблица оборудования
CREATE TABLE Equipment
(
    id                    NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    service_center_id     NUMBER,
    name                  NVARCHAR2(255),
    type                  NVARCHAR2(100),
    serial_number         NVARCHAR2(100) UNIQUE,
    purchase_date         DATE,
    current_location_id   NUMBER,
    mileage               NUMBER,
    fuel_consumption_rate NUMBER(10, 2),
    CONSTRAINT fk_equipment_service_center FOREIGN KEY (service_center_id) REFERENCES ServiceCenters (id)
);

-- Таблица заявок на ремонт
CREATE TABLE RepairRequests
(
    id                   NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    equipment_id         NUMBER,
    assigned_employee_id NUMBER,
    request_date         DATE,
    problem_description  CLOB,
    status               NVARCHAR2(50),
    completion_date      DATE,
    CONSTRAINT fk_repair_equipment FOREIGN KEY (equipment_id) REFERENCES Equipment (id),
    CONSTRAINT fk_repair_employee FOREIGN KEY (assigned_employee_id) REFERENCES Employees (id),
    CONSTRAINT chk_repair_status CHECK (status IN ('Ожидает', N'B работе', N'Готов'))
);

-- Таблица технического обслуживания
CREATE TABLE Maintenance
(
    id               NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    equipment_id     NUMBER,
    maintenance_type NVARCHAR2(100),
    date_performed   DATE,
    next_due_date    DATE,
    cost             NUMBER(10, 2),
    notes            CLOB,
    CONSTRAINT fk_maintenance_equipment FOREIGN KEY (equipment_id) REFERENCES Equipment (id)
);

-- Таблица запчастей
CREATE TABLE Parts
(
    id                NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    equipment_id      NUMBER,
    name              NVARCHAR2(255),
    part_number       NVARCHAR2(100),
    quantity          NUMBER,
    price             NUMBER(10, 2),
    supplier          NVARCHAR2(255),
    last_restock_date DATE,
    CONSTRAINT fk_parts_equipment FOREIGN KEY (equipment_id) REFERENCES Equipment (id)
);

CREATE TABLE Clients
(
    id                NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name              NVARCHAR2(255) NOT NULL,
    contact_info      NVARCHAR2(255),
    registration_date DATE           NOT NULL,
    loyalty_points    NUMBER(10, 2) DEFAULT 0.0
);

CREATE TABLE Tasks
(
    id                   NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    repair_request_id    NUMBER,
    assigned_employee_id NUMBER,
    task_description     CLOB,
    task_date            DATE NOT NULL,
    estimated_hours      NUMBER(5, 1),
    status               NVARCHAR2(50),
    CONSTRAINT fk_tasks_repair FOREIGN KEY (repair_request_id) REFERENCES RepairRequests (id),
    CONSTRAINT fk_tasks_employee FOREIGN KEY (assigned_employee_id) REFERENCES Employees (id),
    CONSTRAINT chk_task_status CHECK (status IN ('Ожидает', N'B работе', N'Готов'))
);