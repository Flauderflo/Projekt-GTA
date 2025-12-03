import psycopg2
from psycopg2.extensions import AsIs
import pandas as pd
import geopandas as gpd

db_credentials = {
    "user": "gta25_g3",
    "password": "wbNw8q9T",
    "host": "ikgpgis.ethz.ch",
    "port": "5432",
    "dbname": "gta"
}

conn = psycopg2.connect(**db_credentials)
cur = conn.cursor()

#chat!
def get(table: str):
    get_schools = f"SELECT * FROM gta25_g3.schule;"
    get_trips = "SELECT * FROM gta25_g3.trajektorien;"
    get_routes = "SELECT * FROM gta25_g3.velovorzugslinien;"
    if table == "schools":
        cur.execute(get_schools)
    elif table == "trips":
        cur.execute(get_trips)
    elif table == "routes":
        cur.execute(get_routes)
    else:
        raise ValueError("Unknown table")
    rows = cur.fetchall()
    cols = [desc[0] for desc in cur.description]
    gdf = gpd.GeoDataFrame(rows, columns=cols)
    return gdf

#chat!
def write(table: str):
    write_schools = "UPDATE gta25_g3.schule SET score = %s WHERE id = %s;"
    write_trips = "UPDATE gta25_g3.trajektorien SET score = %s WHERE id = %s;"
    if table == "schools":
        return write_schools
    elif table == "trips":
        return write_trips
    else:
        raise ValueError("Unknown table")

