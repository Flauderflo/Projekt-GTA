import numpy as np

# import pyproj

from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, origins=["*", "null"])  # allowing any origin as well as localhost (null)

# SOLUTION TASK 4
@app.route("/compute_mean", methods=["GET"])
def compute_mean():
    # retrieve column name from the request arguments
    col_name = str(request.args.get("column_name", "value"))

    # call backend
    result = get_mean_value_from_table(col_name)

    # save results in a suitable format to output
    result = jsonify({"mean": result})
    return result


if __name__ == "__main__":
    # run
    app.run(debug=True, host="localhost", port=8989)

import pandas as pd
import os
import json
from sqlalchemy import create_engine
import psycopg2

DBLOGIN_FILE = os.path.join("db_login.json")


# SOLUTION TASK 4
def get_mean_value_from_table(col_name):
    """Compute mean_value of column <col_name>"""

    # we laoad the dblogin from the json file
    with open("db_login.json", "r") as f:
        dblogin = json.load(f)

    # initialize database connection
    def get_con():
        return psycopg2.connect(**dblogin)

    # create engine
    engine = create_engine("postgresql+psycopg2://", creator=get_con)

    print(dblogin)

    # Read column from database
    table_one_column = pd.read_sql(f"SELECT {col_name} FROM flask_exercise.test_data", engine)
    # compute mean
    return table_one_column[col_name].mean()