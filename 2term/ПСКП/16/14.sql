-- Active: 1743536163547@@127.0.0.1@1433@rsa
-- DROP TABLE FACULTY
CREATE TABLE FACULTY
  (
   FACULTY      NCHAR(10)      NOT NULL,
   FACULTY_NAME VARCHAR(50), 
   CONSTRAINT PK_FACULTY PRIMARY KEY(FACULTY) 
  );
     
--delete from FACULTY;
insert into FACULTY   (FACULTY,   FACULTY_NAME )
             values  ('PPP',   'Publishing and Printing');
insert into FACULTY   (FACULTY,   FACULTY_NAME )
            values  ('ChTE',   'Chemical Technology and Engineering');
insert into FACULTY   (FACULTY,   FACULTY_NAME )
            values  ('FMF',     'Forestry Management Faculty');
insert into FACULTY   (FACULTY,   FACULTY_NAME )
            values  ('EEF',     'Engineering and Economics Faculty');
insert into FACULTY   (FACULTY,   FACULTY_NAME )
            values  ('FTTI',    'Forestry Technology and Technical Industry');
insert into FACULTY   (FACULTY,   FACULTY_NAME )
            values  ('TOV',     'Technology of Organic Substances');

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
 
--delete from PULPIT;  
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                   FACULTY )
             values  ('ISaT',    'Information Systems and Technologies',                         'PPP'  );
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                   FACULTY )
             values  ('PEaIPS', 'Printing Equipment and Information Processing Systems', 'PPP'  );
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                   FACULTY)
              values  ('F',      'Forestry',                                                 'FMF') ;         
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                   FACULTY)
             values  ('H',      'Hunting',                                                 'FMF') ;   
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                   FACULTY)
             values  ('FM',      'Forest Management',                                              'FMF');           
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                   FACULTY)
             values  ('FPaWS',   'Forest Protection and Wood Science',                               'FMF');                
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                   FACULTY)
             values  ('LDaSPC',  'Landscape Design and Garden and Park Construction','FMF');                  
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                   FACULTY)
             values  ('FT',     'Forest Transport',                                              'FTTI');                        
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                   FACULTY)
             values  ('FMaLT',  'Forest Machinery and Logging Technology',                      'FTTI');                        
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                   FACULTY)
             values  ('OC',     'Organic Chemistry',                                           'TOV');            
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                              FACULTY)
             values  ('TPCSaPPM','Technology of Petrochemical Synthesis and Processing of Polymeric Materials','TOV');             
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                      FACULTY)
             values  ('TISaGCT','Technology of Inorganic Substances and General Chemical Technology','ChTE');                    
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                                         FACULTY)
             values  ('CTEPaMET','Chemistry, Technology of Electrochemical Productions and Materials of Electronic Engineering', 'ChTE');
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                      FACULTY)
             values  ('ETaM',    'Economic Theory and Marketing',                              'EEF');   
insert into PULPIT   (PULPIT,    PULPIT_NAME,                                                      FACULTY)
             values  ('MaENM',   'Management and Environmental Management',                      'EEF');    
------------------------------------------------------------------------------------------------------------------------        - DROP  TABLE TEACHER
CREATE TABLE TEACHER
 ( 
  TEACHER       NCHAR(10) NOT  NULL,
  TEACHER_NAME  VARCHAR(50), 
  PULPIT        NCHAR(10) NOT NULL, 
  CONSTRAINT PK_TEACHER  PRIMARY KEY(TEACHER), 
  CONSTRAINT FK_TEACHER_PULPIT FOREIGN   KEY(PULPIT)   REFERENCES PULPIT(PULPIT) ON DELETE CASCADE
 ) ;
 
 
delete from TEACHER;
insert into  TEACHER    (TEACHER,   TEACHER_NAME, PULPIT )
                       values  ('SMLV',    'Smelov Vladimir Vladislavovich',  'ISaT');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('AKNVC',    'Akunovich Stanislav Ivanovich',  'ISaT');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('KLSNV',    'Kolesnikov Leonid Valerievich',  'ISaT');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('GRMN',    'German Oleg Vitoldovich',  'ISaT');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('LSCNK',    'Lashchenko Anatoly Pavlovich',  'ISaT');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('BRKVCH',    'Brakovich Andrey Igorevich',  'ISaT');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('DDK',     'Dedko Alexander Arkadievich',  'ISaT');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('KBL',     'Kabaylo Alexander Serafimovich',  'ISaT');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('URB',     'Urbanovich Pavel Pavlovich',  'ISaT');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('RMNK',     'Romanenko Dmitry Mikhailovich',  'ISaT');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('PSTVLV',  'Pustovalova Natalia Nikolaevna', 'ISaT' );
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('?',     'Unknown',  'ISaT');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                      values  ('GRN',     'Gurin Nikolai Ivanovich',  'ISaT');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('ZLK',     'Zhilyak Nadezhda Alexandrovna',  'ISaT');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('BRTSHVC',   'Bartashevich Svyatoslav Alexandrovich',  'PEaIPS');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('YDNKV',   'Yudenkov Viktor Stepanovich',  'PEaIPS');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('BRNVSK',   'Baranovsky Stanislav Ivanovich',  'ETaM');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('NVRV',   'Neverov Alexander Vasilievich',  'MaENM');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('RVKCH',   'Rovkach Andrey Ivanovich',  'H');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('DMDK', 'Demidko Marina Nikolaevna',  'LDaSPC');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('MSHKVSK',   'Mashkovsky Vladimir Petrovich',  'FM');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('LBKh',   'Labokha Konstantin Valentinovich',  'F');
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('ZVGCV',   'Zvyagintsev Vyacheslav Borisovich',  'FPaWS'); 
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('BZBRDV',   'Bezborodov Vladimir Stepanovich',  'OC'); 
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('PRKPCHK',   'Prokopchuk Nikolai Romanovich',  'TPCSaPPM'); 
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('NSKVTS',   'Naskovets Mikhail Trofimovich',  'FT'); 
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('MKhV',   'Mokhov Sergey Petrovich',  'FMaLT'); 
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('ESCHNK',   'Eshchenko Lyudmila Semenovna',  'TISaGCT'); 
insert into  TEACHER    (TEACHER,  TEACHER_NAME, PULPIT )
                       values  ('ZHRSK',   'Zharsky Ivan Mikhailovich',  'CTEPaMET'); 
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

delete from SUBJECT;
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('DBMS',   'Database Management Systems',                   'ISaT');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT)
                       values ('DB',     'Databases',                                        'ISaT');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('INF',    'Information Technologies',                          'ISaT');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('BAaP',  'Basics of Algorithmization and Programming',            'ISaT');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('KR',     'Knowledge Representation in Computer Systems',       'ISaT');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('NP',    'Network Programming',                 'ISaT');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('MISP',     'Modeling of Information Processing Systems',        'ISaT');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('DIS',     'Design of Information Systems',              'ISaT');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('CG',      'Computer Geometry',                           'ISaT');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('PMAL',   'Printing Machines, Automatic Machines and Production Lines', 'PEaIPS');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('CMS',     'Computer Multimedia Systems',               'ISaT');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('PPO',     'Organization of Printing Production',         'PEaIPS');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,                            PULPIT)
               values ('DM',   'Discrete Mathematics',                     'ISaT');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,                             PULPIT )
               values ('MP',   'Mathematical Programming',          'ISaT');  
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,                             PULPIT )
               values ('LFPC', 'Logical Foundations of Computers',                     'ISaT');                   
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,                             PULPIT )
               values ('OOP',  'Object-Oriented Programming', 'ISaT');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('EE',     'Environmental Economics',                       'MaENM');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('ET',     'Economic Theory',                               'ETaM');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('BFAaBFWFB','Biology of Forest Animals and Birds with Fundamentals of Hunting',      'H');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('BGPaFPM','Basics of Garden and Park and Forest Park Management',  'LDaSPC');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('EG',     'Engineering Geodesy',                              'FM');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('F',    'Forestry',                                        'FPaWS');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('OC',    'Organic Chemistry',                                 'OC');   
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('TRP',    'Technology of Rubber Products',                      'TPCSaPPM'); 
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('WTF',    'Water Transport of Forest',                             'FT');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('TaLE',   'Technology and Logging Equipment',           'FMaLT'); 
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('TOPM',   'Technology of Ore Processing and Minerals',        'TISaGCT');
insert into SUBJECT   (SUBJECT,   SUBJECT_NAME,        PULPIT )
                       values ('AEC',    'Applied Electrochemistry',                           'CTEPaMET');          
---------------------------------------------------------------------------------------------------------------------
-- DROP TABLE AUDITORIUM_TYPE 
create table AUDITORIUM_TYPE 
(
  AUDITORIUM_TYPE   NCHAR(10) constraint AUDITORIUM_TYPE_PK  primary key,  
  AUDITORIUM_TYPENAME  VARCHAR(30) constraint AUDITORIUM_TYPENAME_NOT_NULL not null         
);

delete from AUDITORIUM_TYPE;
insert into AUDITORIUM_TYPE   (AUDITORIUM_TYPE,   AUDITORIUM_TYPENAME )
                       values  ('LH',   'Lecture Hall');
insert into AUDITORIUM_TYPE   (AUDITORIUM_TYPE,   AUDITORIUM_TYPENAME )
                       values  ('LC-C',   'Computer Class');
insert into AUDITORIUM_TYPE   (AUDITORIUM_TYPE,   AUDITORIUM_TYPENAME )
                       values  ('LH-C', 'Lecture Hall with Computers');
insert into AUDITORIUM_TYPE   (AUDITORIUM_TYPE,   AUDITORIUM_TYPENAME )
                       values  ('LC-Ch', 'Chemical Laboratory');
insert into AUDITORIUM_TYPE   (AUDITORIUM_TYPE,   AUDITORIUM_TYPENAME )
                       values  ('LC-SC', 'Special Computer Class');
---------------------------------------------------------------------------------------------------------------------
-- DROP TABLE AUDITORIUM 
create table AUDITORIUM 
(
 AUDITORIUM           NCHAR(10) primary key,  -- auditorium code
 AUDITORIUM_NAME      VARCHAR(200),          -- auditorium 
 AUDITORIUM_CAPACITY  INTEGER,              -- capacity
 AUDITORIUM_TYPE      NCHAR(10) not null      -- auditorium type
                      references AUDITORIUM_TYPE(AUDITORIUM_TYPE) ON DELETE CASCADE 
);

delete from AUDITORIUM;
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                       values  ('206-1',   '206-1', 'LC-C', 15);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY)
                       values  ('301-1',   '301-1', 'LC-C', 15);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                       values  ('236-1',   '236-1', 'LH',   60);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                       values  ('313-1',   '313-1', 'LH',   60);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                       values  ('324-1',   '324-1', 'LH',   50);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                       values  ('413-1',   '413-1', 'LC-C', 15);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                       values  ('423-1',   '423-1', 'LC-C', 90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                       values  ('408-2',   '408-2', 'LH',  90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                       values  ('103-4',   '103-4', 'LH',  90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                       values  ('105-4',   '105-4', 'LH',  90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                       values  ('107-4',   '107-4', 'LH',  90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                       values  ('110-4',   '110-4', 'LH',  30);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                       values  ('111-4',   '111-4', 'LH',  30);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                      values  ('114-4',   '114-4', 'LH-C',  90 );
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                       values ('132-4',   '132-4', 'LH',   90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                       values ('02B-4',   '02B-4', 'LH',   90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                       values ('229-4',   '229-4', 'LH',   90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                       values  ('304-4',   '304-4','LC-C', 90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                       values  ('314-4',   '314-4', 'LH',  90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                       values  ('320-4',   '320-4', 'LH',  90);
insert into  AUDITORIUM   (AUDITORIUM,   AUDITORIUM_NAME, AUDITORIUM_TYPE, AUDITORIUM_CAPACITY )
                       values  ('429-4',   '429-4', 'LH',  90);
-----------------------------------------------------------------------------------------------------------------------