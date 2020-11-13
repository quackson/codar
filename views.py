from flask import Blueprint, render_template, redirect,request, jsonify
from models import db, User, Group, Assignment, Task, PendingTask
from init import app
import datetime


def time2str(x):
    return x.strftime('%Y:%m:%d:%H:%M')

def str2time(x):
    return datetime.datetime.strptime(x+':00', "%Y:%m:%d:%H:%M:%S")
@app.route('/')
def index():
    return "Hello World"

@app.route('/login',methods=['POST'])
def login():
    if request.method == 'POST':
        code = request.form.get('code',None)
        return None
    
    
#Todo: time conflict
@app.route('/addTask',methods=['POST'])
def addTask():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        startTime = request.form.get('startTime',None)
        endTime = request.form.get('endTime',None)
        taskName = request.form.get('taskName',None)
        taskContent = request.form.get('taskContent',None)
        new_startTime = str2time(startTime)
        new_endTime = str2time(endTime)
        newTask = Task(
            startTime = new_startTime,
            endTime = new_endTime,
            content = taskContent,
            name = taskName,
            group_id = int(groupID),
            user_id = int(userID)
        )
        db.session.add(newTask)
        db.session.flush()
        task_id = newTask.id
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['taskID'] = task_id
        res['startTime'] = startTime
        res['endTime'] = endTime
        res['taskName'] = taskName
        res['taskContent'] = taskContent
        return jsonify(res)

@app.route('/queryUserTasks',methods=['POST'])
def queryUserTasks():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        curUser = User.query.get(userID)
        taskList = curUser.taskList
        res = dict()
        res['retCode'] = 200
        tasks = []
        for task in taskList:
            t = set()
            t['groupID'] = task.group_id
            t['taskID'] = task.id
            t['taskName'] = task.name
            t['startTime'] = time2str(task.startTime)
            t['endTime'] = time2str(task.endTime)
            t['taskContent'] = task.content
            tasks.append(t)
        res['tasks'] = tasks
        return jsonify(res)
    
@app.route('/queryAllGroupInvitation',methods=['POST'])
def queryAllGroupInvitation():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        curUser = User.query.get(userID)
        invitations = curUser.groupInvitationList
        res = set()
        res['retCode'] = 200
        groups = []
        for invitation in invitations:
            t = set()
            t['groupID'] = invitation.id
            t['groupName'] = invitation.name
            groups.append(t)
        res['groups'] = groups
        return jsonify(res)
    
@app.route('/queryAllAssignmentInvitation',methods=['POST'])
def queryAllAssignmentInvitation():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        curUser = User.query.get(userID)
        invitations = curUser.assignInvitationList
        res = set()
        res['retCode'] = 200
        assigns = []
        for invitation in invitations:
            t = set()
            t['assignmentID'] = invitation.id
            t['assignmentName'] = invitation.name
            t['groupID'] = invitation.group_id
            t['category'] = invitation.category
            t['startTime'] = time2str(invitation.startTime)
            t['endTime'] = time2str(invitation.endTime)
            t['assignmentContent'] = invitation.content
            t['prior'] = invitation.prior
            assigns.append(t)
        res['assignments'] = assigns
        return jsonify(res)
    
@app.route('/addPendingTask',methods=['POST'])
def addPendingTask():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        startTime = request.form.get('startTime',None)
        endTime = request.form.get('endTime',None)
        pendingTaskName = request.form.get('taskName',None)
        pendingTaskContent = request.form.get('taskContent',None)
        pendingTask = PendingTask(
            startTime = str2time(startTime),
            endTime = str2time(endTime),
            content = pendingTaskContent,
            name = pendingTaskName,
            voteNum = 0,
            group_id = groupID,
            user_id = userID
        )
        pendingTask.group = Group.query.get(groupID)
        pendingTask.user = Group.query.get(userID)
        pendinTask.voterList = []
        db.session.add(pendingTask)
        db.session.flush()
        pendingTaskID = pendingTask.id
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['pendingTaskID'] = pendingTaskID
        res['startTime'] = startTime
        res['endTime'] = endTime
        res['pendingTaskName'] = pendingTaskName
        res['pendingTaskContent'] = pendingTaskContent
        res['voteNum'] = 0
        res['userID'] = userID
        res['userName'] = User.query.get(userID).name
        return jsonify(res)

#Todo: repeated vote
@app.route('/votePendingTask',methods=['POST'])
def votePendingTask():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        pendingTaskID = request.form.get('pendingTaskID',None)
        vote = request.form.get('vote',None)
        pendingTask = PendingTask.query.get(pendingTaskID)
        user = User.query.get(userID)
        group = Group.query.get(groupID)
        pendingTask.voteNum += vote
        pendingTask.voterList.append(user)
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['pendingTaskID'] = pendingTaskID
        res['startTime'] = pendingTask.startTime
        res['endTime'] = pendingTask.endTime
        res['pendingTaskName'] = pendingTask.name
        res['pendingTaskContent'] = pendingTask.content
        res['voteNum'] = pendingTask.voteNum
        res['userID'] = pendingTask.user.id
        res['userName'] = pendingTask.user.name
        return jsonify(res)
    
@app.route('/buildGroup',methods=['POST'])
def buildGroup():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupName = request.form.get('groupName',None)
        user = User.query.get(userID)
        group = Group(
            groupName = groupName,
            owner_id = userID
        )
        group.taskList = []
        group.pendingTaskList = []
        group.assignList = []
        db.session.add(group)
        db.session.flush()
        groupID = group.id
        user.adminGroupList.append(group)
        user.groupList.appeng(group)
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['groupID'] = groupID
        res['groupName'] = groupName
        return jsonify(res)
    
#todo: check if these two users are in group or not
@app.route('/inviteGroup',methods=['POST'])
def inviteGroup():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        invitedUserID = request.form.get('invitedUserID',None)
        group = Group.query.get(groupID)
        user = User.query.get(invitedUserID)
        if not group in user.groupInvitationList:
            user.groupInvitationList.append(group)
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['invitedUserID'] = invitedUserID
        res['invitedUserName'] = user.name
        return jsonify(res)
    
#todo: check if the user is in group
@app.route('/joinGroup',methods=['POST'])
def joinGroup():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        operation = request.form.get('operation',None)
        user = User.query.get(userID)
        group = Group.query.get(groupID)
        user.groupInvitationList.remove(group)
        if int(operation) == 1:
            user.groupList.append(group)
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['groupID'] = groupID
        res['groupName'] = group.name
        userList = group.userList
        adminList = group.adminList
        owner_id = group.owner_id
        users = []
        for us in userList:
            u = dict()
            u['userID'] = us.id
            u['userName'] = us.name
            if us.id==owner_id:
                u['role'] = 2
            elif us in adminList:
                u['role'] = 1
            else:
                u['role'] = 0
            users.append(u)
        res['users'] = users
        return jsonify(res)
    
#todo: check if the user is in group
@app.route('/quitGroup',methods=['POST'])
def quitGroup():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        user = User.query.get(userID)
        group = Group.query.get(groupID)
        group.userList.remove(user)
        group.adminList.remove(user)
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['groupID'] = groupID
        res['groupName'] = group.name
        userList = group.userList
        adminList = group.adminList
        owner_id = group.owner_id
        users = []
        for us in userList:
            u = dict()
            u['userID'] = us.id
            u['userName'] = us.name
            if us.id==owner_id:
                u['role'] = 2
            elif us in adminList:
                u['role'] = 1
            else:
                u['role'] = 0
            users.append(u)
        res['users'] = users
        return jsonify(res)
    
#todo: check if the two users are admin or not 
@app.route('/addManager',methods=['POST'])
def addManager():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        managerID = request.form.get('managerID',None)
        operation = request.form.get('operation',None)
        user = User.query.get(userID)
        group = Group.query.get(groupID)
        manager = User.query.get(managerID)
        if int(operation)==1:
            group.adminList.append(manager)
        elif int(operation)==-1:
            group.adminList.remove(manager)
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['groupID'] = groupID
        res['groupName'] = group.name
        userList = group.userList
        adminList = group.adminList
        owner_id = group.owner_id
        users = []
        for us in userList:
            u = dict()
            u['userID'] = us.id
            u['userName'] = us.name
            if us.id==owner_id:
                u['role'] = 2
            elif us in adminList:
                u['role'] = 1
            else:
                u['role'] = 0
            users.append(u)
        res['users'] = users
        return jsonify(res)

@app.route('/queryAllGroups',methods=['POST'])
def queryAllGroups():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        user = User.query.get(userID)
        groupList = user.groupList
        res = dict()
        res['retCode'] = 200
        groups = []
        for group in groupList:
            g = dict()
            g['groupID'] = group.id
            g['groupName'] = group.name
            groups.append(group)
        res['groups'] = groups
        return jsonify(res)
    
@app.route('/queryAllAdminGroups',methods=['POST'])
def queryAllAdminGroups():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        user = User.query.get(userID)
        groupList = user.adminGroupList
        res = dict()
        res['retCode'] = 200
        groups = []
        for group in groupList:
            g = dict()
            g['groupID'] = group.id
            g['groupName'] = group.name
            groups.append(group)
        res['groups'] = groups
        return jsonify(res)
    
@app.route('/queryAllUsers',methods=['POST'])
def queryAllUsers():
    if request.method == 'POST':
        groupID = request.form.get('groupID',None)
        group = Group.query.get(groupID)
        res = dict()
        res['retCode'] = 200
        userList = group.userList
        adminList = group.adminList
        owner_id = group.owner_id
        users = []
        for us in userList:
            u = dict()
            u['userID'] = us.id
            u['userName'] = us.name
            if us.id==owner_id:
                u['role'] = 2
            elif us in adminList:
                u['role'] = 1
            else:
                u['role'] = 0
            users.append(u)
        res['users'] = users
        return jsonify(res)

#todo: check 1-type assign time conflict
@app.route('/addAssignment',methods=['POST'])
def addAssignment():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        assignmentName = request.form.get('AssignmentName',None)
        category = request.form.get('category',None)
        user = User.query.get(userID)
        group = Group.query.get(groupID)
        assign = Assignment(
            name = assignmentName,
            category = category
        )
        assign.user = user
        assign.group = group
        db.session.add(assign)
        db.session.flush()
        assignID = assign.id
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['assignmentID'] = assignID
        res['assignmentName'] = assignmentName
        res['category'] = category
        return jsonify(res)
    
#todo: check user is admin
@app.route('/setAssignmentPrior',methods=['POST'])
def setAssignmentPrior():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        assignmentID = request.form.get('assignmentID',None)
        prior = request.form.get('prior',None)
        assign = Assignment.query.get(assignmentID)
        assign.prior = prior
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['assignmentID'] = assignmentID
        res['assignmentName'] = assign.name
        res['category'] = assign.category
        res['prior'] = prior
        return jsonify(res)
    
#todo: check user is admin
@app.route('/setAssignmentExecutor',methods=['POST'])
def setAssignmentExecutor():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        assignmentID = request.form.get('assignmentID',None)
        executorID = request.form.get('executorID',None)
        operation = request.form.get('operation',None)
        assign = Assignment.query.get(assignmentID)
        executor = User.query.get(executorID)
        if int(operation)==1:
            executor.assignInvitationList.append(assign)
        elif int(operation)==-1:
            assign.executorList.remove(executor)
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['assignmentID'] = assignmentID
        res['assignmentName'] = assign.name
        res['category'] = assign.category
        executorList = assign.executorList
        executors = []
        for executor in executorList:
            e = dict()
            e['userID'] = executor.id
            e['userName'] = executor.name
            executors.append(e)
        res['executors'] = executors
        return jsonify(res)
    
#todo: check if in assign
@app.route('/joinAssignment',methods=['POST'])
def joinAssignment():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        assignmentID = request.form.get('assignmentID',None)
        operation = request.form.get('operation',None)
        user = User.query.get(userID)
        assign = Assignment.query.get(assignmentID)
        user.assignInvitationList.remove(assign)
        if int(operation)==1:
            user.assignmentList.append(assign)
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['assignmentID'] = assignmentID
        res['assignmentName'] = assign.name
        res['category'] = assign.category
        executorList = assign.executorList
        executors = []
        for executor in executorList:
            e = dict()
            e['userID'] = executor.id
            e['userName'] = executor.name
            executors.append(e)
        res['executors'] = executors
        return jsonify(res)
    
#todo: check user is admin
@app.route('/setAssignmentTime',methods=['POST'])
def setAssignmentTime():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        startTime = request.form.get('startTime',None)
        endTime = request.form.get('endTime',None)
        assignmentID = request.form.get('assignmentID',None)
        assign = Assignment.query.get(assignmentID)
        assign.startTime = str2time(startTime)
        assign.endTime = str2time(endTime)
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['assignmentID'] = assignmentID
        res['assignmentName'] = assign.name
        res['category'] = assign.category
        res['startTime'] = startTime
        res['endTime'] = endTime
        return jsonify(res)
    
#todo: check user is admin
@app.route('/setAssignmentContent',methods=['POST'])
def setAssignmentContent():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        assignmentContent = request.form.get('assignmentContent',None)
        assignmentID = request.form.get('assignmentID',None)
        assign = Assignment.query.get(assignmentID)
        assign.content = assignmentContent
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['assignmentID'] = assignID
        res['assignmentName'] = assign.name
        res['category'] = assign.category
        res['content'] = assignmentContent
        return jsonify(res)
    
@app.route('/queryAllTasks',methods=['POST'])
def queryAllTasks():
    if request.method == 'POST':
        groupID = request.form.get('groupID',None)
        group = Group.query.get(groupID)
        taskList = group.taskList
        res = dict()
        res['retCode'] = 200
        tasks = []
        for task in taskList:
            t = dict()
            t['userID'] = task.user.id
            t['userName'] = task.user.name
            t['taskID'] = task.id
            t['taskName'] = task.name
            t['startTime'] = time2str(task.startTime)
            t['endTime'] = time2str(task.endTime)
            t['taskContent'] = task.content
            tasks.append(t)
        res['tasks'] = tasks
        return jsonify(res)
    
@app.route('/queryAllPendingTasks',methods=['POST'])
def queryAllPendingTasks():
    if request.method == 'POST':
        groupID = request.form.get('groupID',None)
        group = Group.query.get(groupID)
        pendingTaskList = group.pendingTaskList
        res = dict()
        res['retCode'] = 200
        tasks = []
        for task in pendingTaskList:
            t = dict()
            t['userID'] = task.user.id
            t['userName'] = task.user.name
            t['pendingTaskID'] = task.id
            t['pendingTaskName'] = task.name
            t['startTime'] = time2str(task.startTime)
            t['endTime'] = time2str(task.endTime)
            t['pendingTaskContent'] = task.content
            t['voteNum'] = task.voteNum
            tasks.append(t)
        res['pendingTasks'] = tasks
        return jsonify(res)
    
@app.route('/queryAllAssignments',methods=['POST'])
def queryAllAssignments():
    if request.method == 'POST':
        groupID = request.form.get('groupID',None)
        group = Group.query.get(groupID)
        taskList = group.assignList
        res = dict()
        res['retCode'] = 200
        tasks = []
        for task in taskList:
            t = dict()
            t['assignmentID'] = task.id
            t['assignmentName'] = task.name
            t['category'] = task.category
            t['startTime'] = time2str(task.startTime)
            t['endTime'] = time2str(task.endTime)
            t['assignmentContent'] = task.content
            t['prior'] = task.prior
            executorList = task.executorList
            executors = []
            for exe in executors:
                e = dict()
                e['userID'] = exe.id
                e['userName'] = exe.name
                executors.append(e)
            t['executors'] = executors
            tasks.append(t)
        res['assignments'] = tasks
        return jsonify(res)
        return None
    
@app.route('/queryTask',methods=['POST'])
def queryTask():
    if request.method == 'POST':
        groupID = request.form.get('groupID',None)
        taskID = request.form.get('taskID',None)
        task = Task.query.get(taskID)
        res = dict()
        res['retCode'] = 200
        res['userID'] = task.user.id
        res['userName'] = task.user.name
        res['groupID'] = task.group.id
        res['groupName'] = task.group.name
        res['taskID'] = task.id
        res['taskName']= task.name
        res['startTime'] = time2str(task.startTime)
        res['endTime'] = time2str(task.endTime)
        res['taskContent'] = task.content
        return jsonify(res)
    
@app.route('/queryPendingTask',methods=['POST'])
def queryPendingTask():
    if request.method == 'POST':
        groupID = request.form.get('groupID',None)
        pendingTaskID = request.form.get('pendingTaskID',None)
        task = PendingTask.query.get(pendingTaskID)
        res = dict()
        res['retCode'] = 200
        res['userID'] = task.user.id
        res['userName'] = task.user.name
        res['groupID'] = task.group.id
        res['groupName'] = task.group.name
        res['pendingTaskID'] = task.id
        res['pendingTaskName']= task.name
        res['startTime'] = time2str(task.startTime)
        res['endTime'] = time2str(task.endTime)
        res['pendingTaskContent'] = task.content
        res['voteNum'] = task.voteNum
        return jsonify(res)
    
@app.route('/queryAssignment',methods=['POST'])
def queryAssignment():
    if request.method == 'POST':
        groupID = request.form.get('groupID',None)
        assignmentID = request.form.get('assignmentID',None)
        task = Assignment.query.get(assignmentID)
        res = dict()
        res['retCode'] = 20
        res['groupID'] = task.group.id
        res['groupName'] = task.group.name
        res['assignmentID'] = task.id
        res['assignmentName']= task.name
        res['startTime'] = time2str(task.startTime)
        res['endTime'] = time2str(task.endTime)
        res['assignmentContent'] = task.content
        res['category'] = task.category
        res['prior'] = task.prior
        executorList = task.executorList
        executors = []
        for exe in executorList:
            e = dict()
            e['userID'] = exe.id
            e['userName'] = exe.name
            executors.append(e)
        res['executors'] = executors
        return jsonify(res)
    
@app.route('/deleteTask',methods=['POST'])
def deleteTask():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        taskID = request.form.get('taskID',None)
        task = Task.query.get(taskID)
        db.session.delete(task)
        db.session.commit()
        res = {
            'retCode':200
        }
        return jsonify(res)
    
@app.route('/deletePendingTask',methods=['POST'])
def deletePendingTask():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        pendingTaskID = request.form.get('pendingTaskID',None)
        task = PendingTask.query.get(pendingTaskID)
        db.session.delete(task)
        db.session.commit()
        res = {
            'retCode':200
        }
        return jsonify(res)
    
@app.route('/deleteAssignment',methods=['POST'])
def deleteAssignment():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        assignmentID = request.form.get('assignmentID',None)
        task = Assignment.query.get(assignmentID)
        db.session.delete(task)
        db.session.commit()
        res = {
            'retCode':200
        }
        return jsonify(res)

@app.route('/deleteGroup',methods=['POST'])
def deleteGroup():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        group = Group.query.get(groupID)
        db.session.delete(group)
        db.session.commit()
        res = {
            'retCode':200
        }
        return jsonify(res)
