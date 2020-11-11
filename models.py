from init import app
from flask import Flask, request, json, Response
from flask_sqlalchemy import SQLAlchemy
import config

db = SQLAlchemy(app)

user_in_group = db.Table('user_in_group',
    db.Column('user_id',db.Integer,db.ForeignKey('user.id'),primary_key=True),
    db.Column('group_id',db.Integer,db.ForeignKey('group.id'),primary_key=True) 
)

user_admin_group = db.Table('user_admin_group',
    db.Column('user_id',db.Integer,db.ForeignKey('user.id'),primary_key=True),
    db.Column('group_id',db.Integer,db.ForeignKey('group.id'),primary_key=True) 
)

user_with_group_invitation = db.Table('user_with_group_invitation',
    db.Column('user_id',db.Integer,db.ForeignKey('user.id'),primary_key=True),
    db.Column('group_id',db.Integer,db.ForeignKey('group.id'),primary_key=True) 
)

user_with_assign_invitation = db.Table('user_with_assign_invitation',
    db.Column('user_id',db.Integer,db.ForeignKey('user.id'),primary_key=True),
    db.Column('assign_id',db.Integer,db.ForeignKey('assignment.id'),primary_key=True) 
)

user_vote_pendingTask = db.Table('user_vote_pendingTask',
    db.Column('user_id',db.Integer,db.ForeignKey('user.id'),primary_key=True),
    db.Column('pending_id',db.Integer,db.ForeignKey('pendingtask.id'),primary_key=True) 
)

user_take_assign = db.Table('user_take_assign',
    db.Column('user_id',db.Integer,db.ForeignKey('user.id'),primary_key=True),
    db.Column('assign_id',db.Integer,db.ForeignKey('assignment.id'),primary_key=True) 
)

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(20))
    
    groupList = db.relationship('Group',secondary= user_in_group,backref = db.backref('userList'))
    adminGroupList = db.relationship('Group',secondary= user_admin_group,backref = db.backref('adminList'))
    assignList = db.relationship('Assignment',secondary= user_take_assign,backref = db.backref('executorList'))
    groupInvitationList = db.relationship('Group',secondary= user_with_group_invitation,backref = db.backref('invitingList'))
    assignInvitationList = db.relationship('Assignment',secondary= user_with_assign_invitation,backref = db.backref('invitingList'))

class Group(db.Model):
    __tablename__ = 'group'
    id = db.Column(db.Integer, primary_key=True)
    groupName = db.Column(db.String(20))
    owner_id = db.Column(db.Integer)
    
class Task(db.Model):
    __tablename__ = 'task'
    id = db.Column(db.Integer, primary_key=True)
    startTime = db.Column(db.DateTime)
    endTime = db.Column(db.DateTime)
    content = db.Column(db.Text)
    name = db.Column(db.String(20))
    group_id = db.Column(db.Integer,db.ForeignKey('group.id'),nullable = False)
    group = db.relationship('Group',backref = db.backref('taskList'))
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'),nullable = False)
    user = db.relationship('User',backref = db.backref('taskList'))
    
class PendingTask(db.Model):
    __tablename__ = 'pendingtask'
    id = db.Column(db.Integer, primary_key=True)
    startTime = db.Column(db.DateTime)
    endTime = db.Column(db.DateTime)
    content = db.Column(db.Text)
    name = db.Column(db.String(20))
    voteNum = db.Column(db.Integer)
    group_id = db.Column(db.Integer,db.ForeignKey('group.id'),nullable = False)
    group = db.relationship('Group',backref = db.backref('pendingTaskList'))
    user_id = db.Column(db.Integer)
    
    voterList = db.relationship('User',secondary= user_vote_pendingTask,backref = db.backref('voteList'))
    
class Assignment(db.Model):
    __tablename__ = 'assignment'
    id = db.Column(db.Integer, primary_key=True)
    startTime = db.Column(db.DateTime)
    endTime = db.Column(db.DateTime)
    content = db.Column(db.Text)
    name = db.Column(db.String(20))
    category = db.Column(db.Integer)
    prior = db.Column(db.Integer)
    group_id = db.Column(db.Integer,db.ForeignKey('group.id'),nullable = False)
    group = db.relationship('Group',backref = db.backref('assignList'))
    publisher_id = db.Column(db.Integer)
    
db.create_all()