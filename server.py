#!/usr/bin/env python

import os
from flask import Flask, render_template
from flask import request
from flask_cors import CORS
import ast
import json

app = Flask(__name__)

CORS(app)








@app.route("/")
def index():
    return render_template('index.html')


@app.route("/table-data-save", methods = ['GET', 'POST'])
def saveTableData():
    table_data = request.data
    return "Hello World!"

@app.route("/save-slider", methods = ['GET', 'POST'])
def saveSliderData():
    slider_data = request.data
    return "Hello World!"

@app.route("/save-other-data", methods = ['GET', 'POST'])
def saveOtherData():
    data = request.data
    print("is file", request.files)
    # state_name = ast.literal_eval(data)
    dic = json.loads(data)
    print("dic", dic)
    state_name = dic['state_name']
    input_data = dic['input']
    output_data = dic['output']
    const_data = dic['constraint']
    dropdown_1 = dic['dropdown']['selectedDropdown']['1']
    dropdown_2 = dic['dropdown']['selectedDropdown']['2']

    

    
    return "Hello World!"


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 3000), debug=True)



#open postgresql terminal
#psql postgres


#create database
#create database mogadb;

# list all the databses
# \l


#create user
#create user moga_user with encrypted password 'password';


#grant permission on databse to user
#grant all privileges on database mogadb to moga_user;