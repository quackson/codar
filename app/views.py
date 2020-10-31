from flask import Blueprint, render_template, redirect,request
from app import db
from .models import User
user = Blueprint('user',__name__)

@user.route('/index')
def index():
    return "Hello World"

@user.route('/add/',methods=['POST'])
def add():
    if request.method == 'POST':
        p_user = request.form.get('username',None)
        if not p_user:
            return 'input error'

        newobj = User(username=p_user)
        db.session.add(newobj)
        db.session.commit()
        users = User.query.all()
        return users

@user.route('/show')
def show():
    return 'user_show'