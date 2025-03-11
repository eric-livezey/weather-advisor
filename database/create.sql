CREATE DATABASE weather_advisor;
USE weather_advisor;
CREATE TABLE locations (
    id INTEGER UNSIGNED AUTO_INCREMENT NOT NULL,
    coordinates POINT NOT NULL,
    `address` VARCHAR(256) NOT NULL,
    PRIMARY KEY(id)
);
CREATE TABLE forecasts (
    `location` INTEGER UNSIGNED NOT NULL,
    `provider` TINYINT UNSIGNED NOT NULL,
    `timestamp` DATETIME NOT NULL,
    `hour` SMALLINT NOT NULL,
    temperature DECIMAL(5, 2) DEFAULT NULL,
    precipitation TINYINT UNSIGNED DEFAULT NULL,
    wind_speed TINYINT UNSIGNED DEFAULT NULL,
    PRIMARY KEY(`location`, `provider`, `timestamp`, `hour`),
    FOREIGN KEY (`location`) REFERENCES locations(id)
);
/* 
 * Coordinates of the 10 most populous cities in the northeastern U.S.
 * according to https://en.wikipedia.org/wiki/Northeast_megalopolis.
 * 
 * Coordinates sourced from the Google Maps Geocoding API.
 */
INSERT INTO locations (coordinates, address)
    VALUES ROW(ST_GeomFromText('POINT(40.7127753 -74.0059728)'), 'New York City, New York'),
        ROW(ST_GeomFromText('POINT(39.9525839 -75.1652215)'), 'Philadelphia, Pennsylvania'),
        ROW(ST_GeomFromText('POINT(40.7060923 -73.61876149999999)'), 'Hempstead, New York'),
        ROW(ST_GeomFromText('POINT(38.9071923 -77.0368707)'), 'Washington, District of Columbia'),
        ROW(ST_GeomFromText('POINT(42.3555076 -71.0565364)'), 'Boston, Massachusetts'),
        ROW(ST_GeomFromText('POINT(39.2905023 -76.6104072)'), 'Baltimore, Maryland'),
        ROW(ST_GeomFromText('POINT(40.7792653 -72.9153827)'), 'Brookhaven, New York'),
        ROW(ST_GeomFromText('POINT(36.8516437 -75.97921939999999)'), 'Virginia Beach, Virginia'),
        ROW(ST_GeomFromText('POINT(40.7297786 -73.2105665)'), 'Islip, New York'),
        ROW(ST_GeomFromText('POINT(40.7315293 -74.1744671)'), 'Newark, New Jersey');