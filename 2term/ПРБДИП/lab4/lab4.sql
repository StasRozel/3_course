SELECT postgis_version();

-- task 7
SELECT Find_SRID('public', 'minerals', 'wkb_geometry');
-- 4326 - WGS 84 - долгота и широта(GPS)

-- task 8

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'minerals';

-- task 9

SELECT ogc_fid, ST_AsText(wkb_geometry) AS wkt_representation
FROM minerals;

-- task 10

-- 10.1.Нахождение пересечения пространственных объектов;

SELECT a.ogc_fid, b.ogc_fid, ST_AsText(ST_Intersection(a.wkb_geometry, b.wkb_geometry)) AS intersection_geom
FROM minerals a,
     minerals b
WHERE a.ogc_fid < b.ogc_fid
  AND ST_Intersects(a.wkb_geometry, b.wkb_geometry);

-- 10.2.Нахождение координат вершин пространственного объектов;

SELECT ogc_fid, ST_AsText((dp).geom) AS vertex
FROM (SELECT ogc_fid, ST_DumpPoints(wkb_geometry) AS dp FROM minerals) AS subquery;

-- 10.3. Нахождение площади пространственных объектов

SELECT ogc_fid, ST_Area(ST_Transform(wkb_geometry, 3857)) AS area_m2
FROM minerals;

-- 11.Создайте пространственный объект в виде точки (1) /линии (2) /полигона (3).

ALTER TABLE minerals
    ALTER COLUMN wkb_geometry TYPE geometry(GEOMETRY, 4326);

INSERT INTO minerals (wkb_geometry, site_name)
VALUES (ST_SetSRID(ST_Point(30.5, 50.4), 4326), 'New Point'); -- точка

INSERT INTO minerals (wkb_geometry, site_name)
VALUES (ST_SetSRID(
                ST_GeomFromText('LINESTRING(30 50, 32 53, 35 55, 40 58, 45 60, 50 62, 55 63)'),
                4326
        ),
        'Big Line'); -- линия

INSERT INTO minerals (wkb_geometry, site_name)
VALUES (ST_SetSRID(ST_GeomFromText('POLYGON((30 50, 32 52, 34 50, 30 50))'), 4326), 'New Polygon'); -- треугольник


SELECT site_name, GeometryType(wkb_geometry)
FROM minerals;

-- 12.Найдите, в какие пространственные объекты попадают созданные вами объекты

SELECT a.site_name AS point_site, b.site_name AS intersected_site
FROM minerals a
         JOIN minerals b
              ON ST_Intersects(a.wkb_geometry, b.wkb_geometry) -- Проверяем пересечение точки с другими геометриями
WHERE a.site_name = 'New Point'
  AND GeometryType(a.wkb_geometry) = 'POINT';

-- 13.Продемонстрируйте индексирование пространственных объектов.

CREATE INDEX minerals_wkb_geometry_gist
    ON minerals USING gist (wkb_geometry);

SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'minerals';

EXPLAIN ANALYZE
SELECT a.site_name AS line_site, b.site_name AS intersected_site
FROM minerals a
         JOIN minerals b
              ON ST_Intersects(a.wkb_geometry, b.wkb_geometry)
WHERE a.site_name = 'Big Line';

-- 14.Разработайте хранимую процедуру, которая принимает координаты точки и возвращает пространственный объект, в который эта точка попадает.

CREATE OR REPLACE FUNCTION find_containing_geometry(lat DOUBLE PRECISION, lon DOUBLE PRECISION)
    RETURNS TABLE
            (
                site_name TEXT,
                geom_type TEXT
            )
AS
$$
DECLARE
    point GEOMETRY;
BEGIN
    point := ST_SetSRID(ST_MakePoint(lon, lat), 4326);

    RETURN QUERY
        SELECT m.site_name::text, GeometryType(m.wkb_geometry)
        FROM minerals m
        WHERE ST_Contains(m.wkb_geometry, point);
END;
$$ LANGUAGE plpgsql;

SELECT *
FROM find_containing_geometry(50.4, 30.5);
