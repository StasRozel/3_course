CREATE TABLE celebrities
(
    id                 INT IDENTITY(1,1) PRIMARY KEY,
    full_name          VARCHAR(255) NOT NULL,
    nationality        VARCHAR(100) NOT NULL,
    request_photo_path VARCHAR(255) NOT NULL,
);

CREATE TABLE life_events
(
    id                 INT IDENTITY(1,1) PRIMARY KEY,
    celebrity_id       INT           NOT NULL FOREIGN KEY REFERENCES celebrities(id),
    date               DATE          NOT NULL,
    description        VARCHAR(1024) NOT NULL,
    request_photo_path VARCHAR(255)  NOT NULL,
);