-- DROP TABLE FACULTY
CREATE TABLE FACULTY
  (
   FACULTY      NCHAR(10)      NOT NULL,
   FACULTY_NAME VARCHAR(50), 
   CONSTRAINT PK_FACULTY PRIMARY KEY(FACULTY) 
  );
     
--------------------------------------------------------------------------------------------
-- DROP TABLE PULPIT
CREATE TABLE PULPIT 
(
 PULPIT       NCHAR(10)      NOT NULL,
 PULPIT_NAME  VARCHAR(100), 
 FACULTY      NCHAR(10)      NOT NULL, 
 CONSTRAINT FK_PULPIT_FACULTY FOREIGN KEY(FACULTY)   REFERENCES FACULTY(FACULTY) ON DELETE CASCADE, 
 CONSTRAINT PK_PULPIT PRIMARY KEY(PULPIT) 
 ); 
 

------------------------------------------------------------------------------------------------------------------------        - DROP  TABLE TEACHER
CREATE TABLE TEACHER
 ( 
  TEACHER       NCHAR(10) NOT  NULL,
  TEACHER_NAME  VARCHAR(50), 
  PULPIT        NCHAR(10) NOT NULL, 
  CONSTRAINT PK_TEACHER  PRIMARY KEY(TEACHER), 
  CONSTRAINT FK_TEACHER_PULPIT FOREIGN   KEY(PULPIT)   REFERENCES PULPIT(PULPIT) ON DELETE CASCADE
 ) ;
 
 
---------------------------------------------------------------------------------------------------------------------
-- DROP TABLE SUBJECT 
CREATE TABLE SUBJECT
    (
     SUBJECT      NCHAR(10)     NOT NULL, 
     SUBJECT_NAME VARCHAR(50)  NOT NULL,
     PULPIT       NCHAR(10)     NOT NULL,  
     CONSTRAINT PK_SUBJECT PRIMARY KEY(SUBJECT),
     CONSTRAINT FK_SUBJECT_PULPIT FOREIGN  KEY(PULPIT)  REFERENCES PULPIT(PULPIT) ON DELETE CASCADE
    );


---------------------------------------------------------------------------------------------------------------------
-- DROP TABLE AUDITORIUM_TYPE 
create table AUDITORIUM_TYPE 
(
  AUDITORIUM_TYPE   NCHAR(10) constraint AUDITORIUM_TYPE_PK  primary key,  
  AUDITORIUM_TYPENAME  VARCHAR(30) constraint AUDITORIUM_TYPENAME_NOT_NULL not null         
);


---------------------------------------------------------------------------------------------------------------------
-- DROP TABLE AUDITORIUM 
create table AUDITORIUM 
(
 AUDITORIUM           NCHAR(10) primary key,  -- код аудитории
 AUDITORIUM_NAME      VARCHAR(200),          -- аудитория 
 AUDITORIUM_CAPACITY  INTEGER,              -- вместимость
 AUDITORIUM_TYPE      NCHAR(10) not null      -- тип аудитории
                      references AUDITORIUM_TYPE(AUDITORIUM_TYPE) ON DELETE CASCADE 
);

--------------------------------------------------
