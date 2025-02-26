--------------task 1-------------
SELECT * FROM dba_data_files;

SELECT * FROM dba_temp_files;
--------------task 2-------------
alter session set "_ORACLE_SCRIPT" = true
CREATE TABLESPACE RSA_QDATA 
DATAFILE 'RSA_QDATA.dbf' SIZE 10M 
OFFLINE;

ALTER TABLESPACE RSA_QDATA OFFLINE;

ALTER USER C##RSA QUOTA 2M ON RSA_QDATA;
-----------task 11---------------
SELECT 
    GROUP#, 
    THREAD#, 
    SEQUENCE#, 
    BYTES, 
    MEMBERS, 
    STATUS 
FROM V$LOG
WHERE STATUS = 'CURRENT';

ALTER SYSTEM SWITCH LOGFILE;

SELECT TO_CHAR(SYSDATE, 'DD-MON-YYYY HH24:MI:SS') AS switch_time
FROM DUAL;

-------------task 12--------------
ALTER DATABASE ADD LOGFILE GROUP 4 
('redo04a.log',
 'redo04b.log',
 'redo04c.log')
SIZE 50M;

SELECT 
    THREAD#, 
    SEQUENCE#, 
    FIRST_CHANGE#, 
    NEXT_CHANGE#
FROM V$LOG
WHERE GROUP# = 4;
----------task 13------------
ALTER DATABASE DROP LOGFILE GROUP 4;

SELECT MEMBER FROM V$LOGFILE WHERE GROUP# = 4;
----------task 14-------------
SELECT
    *
FROM V$ARCHIVE_DEST
WHERE STATUS = 'DEFERRED';

SELECT
    *
FROM V$ARCHIVE_PROCESSES;


-----------task 15-------------
SELECT 
    MAX(SEQUENCE#) AS LAST_ARCHIVED_LOG
FROM V$ARCHIVED_LOG;
-----------task 16--------------
shutdown immediate;
startup mount exclusive;
alter database archivelog;
alter database open;
----------task 17----------------
ALTER SYSTEM ARCHIVE LOG CURRENT;

SELECT 
    MAX(SEQUENCE#) AS LAST_ARCHIVED_LOG
FROM V$ARCHIVED_LOG;

SELECT
    NAME
FROM V$ARCHIVED_LOG
WHERE SEQUENCE# = (SELECT MAX(SEQUENCE#) FROM V$ARCHIVED_LOG);

SELECT
    a.SEQUENCE#,
    a.FIRST_CHANGE#,
    a.NEXT_CHANGE#,
    l.SEQUENCE#,
    l.FIRST_CHANGE#,
    l.NEXT_CHANGE#
FROM V$ARCHIVED_LOG a
JOIN V$LOG l
ON a.SEQUENCE# = l.SEQUENCE#
ORDER BY a.SEQUENCE#;
--------------task 19--------------
SELECT 
    *
FROM V$CONTROLFILE;
---------------task 20--------------
HOST DUMP CONTROLFILE 'C:\APP\ROZEL\PRODUCT\21C\ORADATA\XE\CONTROL01.CTL';
-----------task 21---------------
SHOW PARAMETER SPFILE;
----------task 22
CREATE PFILE = 'RSA_PFILE.ORA' FROM SPFILE;
------------task 23---------------
SHOW PARAMETER PASSWORD_FILE;
-----------task 24----------------
SHOW PARAMETER USER_DUMP_DEST;

SHOW PARAMETER DIAGNOSTIC_DEST;
-----------task 25----------------
SHOW PARAMETER DIAGNOSTIC_DEST;