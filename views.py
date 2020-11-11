from flask import Blueprint, render_template, redirect,request
from models import db, User, Group, Assignment, Task, PendingTask
from init import app


@app.route('/')
def index():
    return "Hello World"

@app.route('/add',methods=['POST'])
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

@app.route('/login',methods=['POST'])
def login():
    if request.method == 'POST':
        code = request.form.get('code',None)
        return None
    
@app.route('/addTask',methods=['POST'])
def addTask():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        startTime = request.form.get('startTime',None)
        endTime = request.form.get('endTime',None)
        taskName = request.form.get('taskName',None)
        taskContent = request.form.get('taskContent',None)
        return None
    
@app.route('/queryUserTasks',methods=['POST'])
def queryUserTasks():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        return None
    
@app.route('/queryAllGroupInvitation',methods=['POST'])
def queryAllGroupInvitation():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        return None
    
@app.route('/queryAllAssignmentInvitation',methods=['POST'])
def queryAllAssignmentInvitation():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        return None
    
@app.route('/addPendingTask',methods=['POST'])
def addPendingTask():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        startTime = request.form.get('startTime',None)
        endTime = request.form.get('endTime',None)
        pendingTaskName = request.form.get('taskName',None)
        pendingTaskContent = request.form.get('taskContent',None)
        return None

@app.route('/votePendingTask',methods=['POST'])
def votePendingTask():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        pendingTaskID = request.form.get('pendingTaskID',None)
        vote = request.form.get('vote',None)
        return None
    
@app.route('/buildGroup',methods=['POST'])
def buildGroup():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupName = request.form.get('groupName',None)
        return None
    
@app.route('/inviteGroup',methods=['POST'])
def inviteGroup():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        invitedUserID = request.form.get('invitedUserID',None)
        return None
    
@app.route('/joinGroup',methods=['POST'])
def joinGroup():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        operation = request.form.get('operation',None)
        return None
    
@app.route('/quitGroup',methods=['POST'])
def quitGroup():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        return None
    
@app.route('/addManager',methods=['POST'])
def addManager():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        managerID = request.form.get('managerID',None)
        operation = request.form.get('operation',None)
        return None

@app.route('/queryAllGroups',methods=['POST'])
def queryAllGroups():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        return None
    
@app.route('/queryAllAdminGroups',methods=['POST'])
def queryAllAdminGroups():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        return None
    
@app.route('/queryAllUsers',methods=['POST'])
def queryAllUsers():
    if request.method == 'POST':
        groupID = request.form.get('groupID',None)
        return None

@app.route('/addAssignment',methods=['POST'])
def addAssignment():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        assignmentName = request.form.get('AssignmentName',None)
        category = request.form.get('category',None)
        return None
    
@app.route('/setAssignmentPrior',methods=['POST'])
def setAssignmentPrior():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        assignmentID = request.form.get('assignmentID',None)
        prior = request.form.get('prior',None)
        return None
    
@app.route('/setAssignmentExecutor',methods=['POST'])
def setAssignmentExecutor():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        assignmentID = request.form.get('assignmentID',None)
        executorID = request.form.get('executorID',None)
        operation = request.form.get('operation',None)
        return None
    
@app.route('/joinAssignment',methods=['POST'])
def joinAssignment():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        assignmentID = request.form.get('assignmentID',None)
        operation = request.form.get('operation',None)
        return None
    
@app.route('/setAssignmentTime',methods=['POST'])
def setAssignmentTime():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        startTime = request.form.get('startTime',None)
        endTime = request.form.get('endTime',None)
        assignmentID = request.form.get('assignmentID',None)
        return None
    
@app.route('/setAssignmentContent',methods=['POST'])
def setAssignmentContent():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        assignmentContent = request.form.get('assignmentContent',None)
        assignmentID = request.form.get('assignmentID',None)
        return None
    
@app.route('/queryAllTasks',methods=['POST'])
def queryAllTasks():
    if request.method == 'POST':
        groupID = request.form.get('groupID',None)
        return None
    
@app.route('/queryAllPendingTasks',methods=['POST'])
def queryAllPendingTasks():
    if request.method == 'POST':
        groupID = request.form.get('groupID',None)
        return None
    
@app.route('/queryAllAssignments',methods=['POST'])
def queryAllAssignments():
    if request.method == 'POST':
        groupID = request.form.get('groupID',None)
        return None
    
@app.route('/queryTask',methods=['POST'])
def queryTask():
    if request.method == 'POST':
        groupID = request.form.get('groupID',None)
        taskID = request.form.get('taskID',None)
        return None
    
@app.route('/queryPendingTask',methods=['POST'])
def queryPendingTask():
    if request.method == 'POST':
        groupID = request.form.get('groupID',None)
        pendingTaskID = request.form.get('pendingTaskID',None)
        return None
    
@app.route('/queryAssignment',methods=['POST'])
def queryAssignment():
    if request.method == 'POST':
        groupID = request.form.get('groupID',None)
        assignmentID = request.form.get('assignmentID',None)
        return None
    
@app.route('/deleteTask',methods=['POST'])
def deleteTask():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        taskID = request.form.get('taskID',None)
        return None
    
@app.route('/deletePendingTask',methods=['POST'])
def deletePendingTask():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        pendingTaskID = request.form.get('pendingTaskID',None)
        return None
    
@app.route('/deleteAssignment',methods=['POST'])
def deleteAssignment():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        assignmentID = request.form.get('assignmentID',None)
        return None

@app.route('/deleteGroup',methods=['POST'])
def deleteGroup():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        return None
