CREATE TABLE Маршруты (
    ID_Маршрута SERIAL PRIMARY KEY,
    Место_отправления VARCHAR(100) NOT NULL,
    Место_прибытия VARCHAR(100) NOT NULL,
    Остановки JSON
);

CREATE TABLE Поезда (
    ID_Поезда SERIAL PRIMARY KEY,
    Номер_Поезда VARCHAR(10) NOT NULL,
    ID_Маршрута INT NOT NULL,
    Время_Отправления TIMESTAMP NOT NULL,
    Время_Прибытия TIMESTAMP NOT NULL,
    FOREIGN KEY (ID_Маршрута) REFERENCES Маршруты(ID_Маршрута)
);

CREATE TABLE Пассажиры (
    ID_Пассажира SERIAL PRIMARY KEY,
	ID_Пользователя INT NOT NULL,
    Логин VARCHAR(50) NOT NULL UNIQUE,
    Имя VARCHAR(50) NOT NULL,
    Отчество VARCHAR(50),
	FOREIGN KEY (ID_Пользователя) REFERENCES Пользователи(ID_Пользователя)
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
    FOREIGN KEY (ID_Поезда) REFERENCES Поезда(ID_Поезда)
);

CREATE TABLE Купленные_Билеты (
    ID_Купленного_Билета SERIAL PRIMARY KEY,
    ID_Билета INT NOT NULL,
    ID_Пассажира INT NOT NULL,
    Дата_Покупки TIMESTAMP NOT NULL,
    Status VARCHAR(20) NOT NULL,
    FOREIGN KEY (ID_Билета) REFERENCES Билеты(ID_Билета),
    FOREIGN KEY (ID_Пассажира) REFERENCES Пассажиры(ID_Пассажира)
);

CREATE TABLE Пользователи (
ID_Пользователя SERIAL PRIMARY KEY,
Логин VARCHAR(50) NOT NULL UNIQUE,
Пароль VARCHAR(100) NOT NULL,
ID_Роли INT NOT NULL,
FOREIGN KEY (ID_Роли) REFERENCES Роли(ID_Роли)
);

CREATE TABLE Роли (
ID_Роли SERIAL PRIMARY KEY,
Роль VARCHAR(50) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS Купленные_Билеты CASCADE;
DROP TABLE IF EXISTS Билеты CASCADE;
DROP TABLE IF EXISTS Вагоны CASCADE;
DROP TABLE IF EXISTS Пассажиры CASCADE;
DROP TABLE IF EXISTS Поезда CASCADE;
DROP TABLE IF EXISTS Маршруты CASCADE;
DROP TABLE IF EXISTS Пользователи CASCADE;
DROP TABLE IF EXISTS Роли CASCADE;