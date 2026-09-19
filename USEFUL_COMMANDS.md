Delete everything:
DELETE FROM Observations;
DELETE FROM Species;

ALTER TABLE observations ADD COLUMN life_stage VARCHAR;
sqlite3 app/backend/database/ecotrax.db