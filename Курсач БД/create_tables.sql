CREATE TABLE Поезда (
ID_Поезда SERIAL PRIMARY KEY,
Номер_Поезда VARCHAR(10) NOT NULL,
Маршрут VARCHAR(100) NOT NULL,
Время_Отправления TIMESTAMP NOT NULL,
Время_Прибытия TIMESTAMP NOT NULL
);

CREATE TABLE Пассажиры (
ID_Пассажира SERIAL PRIMARY KEY,
Логин VARCHAR(50) NOT NULL UNIQUE,
Пароль VARCHAR(100) NOT NULL,
Фамилия VARCHAR(50) NOT NULL,
Имя VARCHAR(50) NOT NULL,
Отчество VARCHAR(50),
Номер_Билета VARCHAR(20) NOT NULL,
ID_Поезда INT NOT NULL,
FOREIGN KEY (ID_Поезда) REFERENCES Поезда(ID_Поезда)
);

CREATE TABLE Вагоны (
ID_Вагона SERIAL PRIMARY KEY,
Номер_Вагона VARCHAR(10) NOT NULL,
Тип_Вагона VARCHAR(20) NOT NULL,
Количество_Мест INT NOT NULL,
ID_Поезда INT NOT NULL,
FOREIGN KEY (ID_Поезда) REFERENCES Поезда(ID_Поезда)
);

CREATE TABLE Билеты (
    ID_Билета SERIAL PRIMARY KEY,
    Стоимость DECIMAL(10, 2) NOT NULL,
    Тип_Билета VARCHAR(20) NOT NULL,
    ID_Поезда INT NOT NULL,
    FOREIGN KEY (ID_Poezda) REFERENCES Poezda(ID_Poezda)
);

CREATE TABLE Купленные_Билеты (
    ID_Купленного_Билета SERIAL PRIMARY KEY,
    ID_Билета INT NOT NULL,
    ID_Пассижира INT NOT NULL,
    Дата_Покупки TIMESTAMP NOT NULL,
    Status VARCHAR(20) NOT NULL,
    FOREIGN KEY (ID_Билета) REFERENCES Билеты(ID_Билета),
    FOREIGN KEY (ID_Пассижира) REFERENCES Пассажиры(ID_Пассижира)
);

CREATE TABLE Роли (
ID_Роли SERIAL PRIMARY KEY,
Роль VARCHAR(50) NOT NULL UNIQUE,
);