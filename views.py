from flask import Blueprint, render_template, redirect,request, jsonify
from models import db, User, Group, Assignment, Task, PendingTask
from init import app
import datetime
import requests
import json

def sameDay(day,task):
    days = day.split(':')
    startTimes = task.startTime.split(':')
    endTimes = task.endTime.split(':')
    if days[0] == startTimes[0] and days[1]== startTimes[1] and days[2]==startTimes[2]:
        return True
    if days[0] == endTimes[0] and days[1]== endTimes[1] and days[2]==endTimes[2]:
        return True
    return False
    
def earlierThan(x,y):
    xs = x.split(':')
    ys = y.split(':')
    for i in range(5):
        if int(xs[i])<int(ys[i]):
            return True
        elif int(xs[i])>int(ys[i]):
            return False
    return True
    
def compatible(task1,task2):
    if earlierThan(task1.endTime,task2.startTime) or earlierThan(task2.endTime,task1.startTime):
        return True
    return False

@app.route('/hello',methods=['GET'])
def index():
    return jsonify("Hello World")

@app.route('/test',methods=['POST'])
def test():
    open_id = request.form.get('openID',None)
    userName = request.form.get('userName',None)
    user = User(
        openID = open_id,
        name = userName
    )
    db.session.add(user)
    db.session.flush()
    userID = user.id
    db.session.commit()
    res = {
        'retCode':200,
        'userID':userID
    }
    return jsonify(res)

@app.route('/user/login',methods=['POST'])
def login():
    if request.method == 'POST':
        open_id = request.form.get('openID',None)
        userName = request.form.get('userName',None)
        user = User.query.filter_by(openID=open_id).first()
        if user:
            res = {
                'retCode':200,
                'userID':user.id,
                'userName':user.name
            }
            return jsonify(res)
        user = User(
            openID = open_id,
            name = userName
        )
        db.session.add(user)
        db.session.flush()
        userID = user.id
        db.session.commit()
        res = {
            'retCode':200,
            'userID':userID,
            'userName':userName
        }
        return jsonify(res)
    
    
@app.route('/task/add',methods=['POST'])
def addTask():
    if request.method == 'POST':
        userID = int(request.form.get('userID',None))
        groupID = int(request.form.get('groupID',None))
        startTime = request.form.get('startTime',None)
        endTime = request.form.get('endTime',None)
        taskName = request.form.get('taskName',None)
        taskContent = request.form.get('taskContent',None)
        user = User.query.get(userID)
        group = Group.query.get(groupID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not user in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'user not in this group'
            })
        taskList = user.taskList
        newTask = Task(
            startTime = startTime,
            endTime = endTime,
            content = taskContent,
            name = taskName,
            group_id = int(groupID),
            user_id = int(userID)
        )
        for task in taskList:
            if not compatible(task,newTask):
                res={
                    'retCode':400,
                    'errMsg':'time conflict'
                }
                return jsonify(res)
        db.session.add(newTask)
        db.session.flush()
        task_id = newTask.id
        user.taskList.append(newTask)
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['taskID'] = task_id
        res['startTime'] = startTime
        res['endTime'] = endTime
        res['taskName'] = taskName
        res['taskContent'] = taskContent
        return jsonify(res)

@app.route('/user/task',methods=['GET'])
def queryUserTasks():
    if request.method == 'GET':
        userID = request.args.get('userID')
        date = request.args.get('date')
        curUser = User.query.get(userID)
        if not curUser:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        taskList = curUser.taskList
        res = dict()
        res['retCode'] = 200
        tasks = []
        for task in taskList:
            if not sameDay(date,task):
                continue
            t = dict()
            t['groupID'] = task.group_id
            t['taskID'] = task.id
            t['taskName'] = task.name
            t['startTime'] = task.startTime
            t['endTime'] = task.endTime
            t['taskContent'] = task.content
            tasks.append(t)
        res['tasks'] = tasks
        return jsonify(res)
    
@app.route('/user/groupInvitation',methods=['GET'])
def queryAllGroupInvitation():
    if request.method == 'GET':
        userID = request.args.get('userID')
        curUser = User.query.get(userID)
        if not curUser:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        invitations = curUser.groupInvitationList
        res = dict()
        res['retCode'] = 200
        groups = []
        for invitation in invitations:
            t = dict()
            t['groupID'] = invitation.id
            t['groupName'] = invitation.name
            groups.append(t)
        res['groups'] = groups
        return jsonify(res)
    
@app.route('/user/assignInvitation',methods=['GET'])
def queryAllAssignmentInvitation():
    if request.method == 'GET':
        userID = request.args.get('userID')
        curUser = User.query.get(userID)
        if not curUser:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        invitations = curUser.assignInvitationList
        res = dict()
        res['retCode'] = 200
        assigns = []
        for invitation in invitations:
            t = dict()
            t['assignmentID'] = invitation.id
            t['assignmentName'] = invitation.name
            t['groupID'] = invitation.group_id
            t['groupName'] = invitation.group.name
            t['category'] = invitation.category
            t['startTime'] = invitation.startTime
            t['endTime'] = invitation.endTime
            t['assignmentContent'] = invitation.content
            t['prior'] = invitation.prior
            assigns.append(t)
        res['assignments'] = assigns
        return jsonify(res)
    
@app.route('/pendingTask/add',methods=['POST'])
def addPendingTask():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        startTime = request.form.get('startTime',None)
        endTime = request.form.get('endTime',None)
        pendingTaskName = request.form.get('pendingTaskName',None)
        pendingTaskContent = request.form.get('pendingTaskContent',None)
        user = User.query.get(userID)
        group = Group.query.get(groupID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not user in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'user not in this group'
            })
        pendingTask = PendingTask(
            startTime = startTime,
            endTime = endTime,
            content = pendingTaskContent,
            name = pendingTaskName,
            voteNum = 0,
            group_id = groupID,
            user_id = userID
        )
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

@app.route('/pendingTask/vote',methods=['POST'])
def votePendingTask():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        pendingTaskID = request.form.get('pendingTaskID',None)
        vote = request.form.get('vote',None)
        pendingTask = PendingTask.query.get(pendingTaskID)
        user = User.query.get(userID)
        group = Group.query.get(groupID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not user in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'user not in this group'
            })
        if not pendingTask in group.pendingTaskList:
            return jsonify({
                'retCode':400,
                'errMsg':'pendingTask not in this group'
            })
        if user in pendingTask.voterList:
            res = {
                'retCode':400,
                'errMsg':'already voted! can\'t vote again' 
            }
            return jsonify(res)
        pendingTask.voteNum += int(vote)
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
    
@app.route('/group/build',methods=['POST'])
def buildGroup():
    if request.method == 'POST':
        userID = int(request.form.get('userID'))
        groupName = request.form.get('groupName')
        user = User.query.get(userID)
        user = User.query.get(userID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        group = Group(
            name = groupName,
            owner_id = userID
        )
        db.session.add(group)
        db.session.flush()
        groupID = group.id
        user.adminGroupList.append(group)
        user.groupList.append(group)
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['groupID'] = groupID
        res['groupName'] = groupName
        return jsonify(res)
    
@app.route('/group/invite',methods=['POST'])
def inviteGroup():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        invitedUserID = request.form.get('invitedUserID',None)
        group = Group.query.get(groupID)
        user = User.query.get(invitedUserID)
        inviter = User.query.get(userID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'invited user not exist'
            })
        if not inviter:
            return jsonify({
                'retCode':400,
                'errMsg':'inviter not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not inviter in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'inviter not in this group'
            })
        if group in user.groupList:
            res = {
                'retCode':400,
                'errMsg':'invited user already in group! can\'t invite again'
            }
            return jsonify(res)
        if not group in user.groupInvitationList:
            user.groupInvitationList.append(group)
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['invitedUserID'] = invitedUserID
        res['invitedUserName'] = user.name
        return jsonify(res)
    
@app.route('/group/join',methods=['POST'])
def joinGroup():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        operation = request.form.get('operation',None)
        user = User.query.get(userID)
        group = Group.query.get(groupID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if group in user.groupList:
            res = {
                'retCode':400,
                'errMsg':'already in group! can\'t join again'
            }
            return jsonify(res)
        if group in user.groupInvitationList:
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
    
@app.route('/group/quit',methods=['POST'])
def quitGroup():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        user = User.query.get(userID)
        group = Group.query.get(groupID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not group in user.groupList:
            res = {
                'retCode':400,
                'errMsg':'not in group! can\'t quit'
            }
            return jsonify(res)
        if user in group.userList:
            group.userList.remove(user)
        if user in group.adminList:
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
    
@app.route('/group/manager',methods=['POST'])
def addManager():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        managerID = request.form.get('managerID',None)
        operation = request.form.get('operation',None)
        user = User.query.get(userID)
        group = Group.query.get(groupID)
        manager = User.query.get(managerID)
        user = User.query.get(userID)
        group = Group.query.get(groupID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not manager:
            return jsonify({
                'retCode':400,
                'errMsg':'set user not exist'
            })
        if not user in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'user not in this group'
            })
        if not manager in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'set user not in this group'
            })
        if not group in user.adminGroupList:
            res = {
                'retCode':400,
                'errMsg':'user is not admin, no authority to do this'
            }
            return jsonify(res)
        if int(operation)==1:
            if group in manager.adminGroupList:
                res = {
                    'retCode':400,
                    'errMsg':'already a manager! can\'t set again'
                }
                return jsonify(res)
            group.adminList.append(manager)
        elif int(operation)==-1:
            if not group in manager.adminGroupList:
                res = {
                    'retCode':400,
                    'errMsg':'not a manager! can\'t cancel him'
                }
                return jsonify(res)
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

@app.route('/user/group',methods=['GET'])
def queryAllGroups():
    if request.method == 'GET':
        userID = request.args.get('userID')
        user = User.query.get(userID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        groupList = user.groupList
        adminList = user.adminGroupList
        res = dict()
        res['retCode'] = 200
        groups = []
        for group in groupList:
            if group in adminList:
                continue
            g = dict()
            g['groupID'] = group.id
            g['groupName'] = group.name
            groups.append(g)
        res['groups'] = groups
        return jsonify(res)
    
@app.route('/user/adminGroup',methods=['GET'])
def queryAllAdminGroups():
    if request.method == 'GET':
        userID = request.args.get('userID')
        user = User.query.get(userID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        groupList = user.adminGroupList
        res = dict()
        res['retCode'] = 200
        groups = []
        for group in groupList:
            g = dict()
            g['groupID'] = group.id
            g['groupName'] = group.name
            groups.append(g)
        res['groups'] = groups
        return jsonify(res)
    
@app.route('/group/user',methods=['GET'])
def queryAllUsers():
    if request.method == 'GET':
        groupID = request.args.get('groupID')
        group = Group.query.get(groupID)
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
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

@app.route('/assign/add',methods=['POST'])
def addAssignment():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        assignmentName = request.form.get('assignmentName',None)
        category = request.form.get('category',None)
        prior = request.form.get('prior',None)
        content = request.form.get('assignmentContent',None)
        startTime = request.form.get('startTime',None)
        endTime = request.form.get('endTime',None)
        user = User.query.get(userID)
        group = Group.query.get(groupID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not user in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'user not in this group'
            })
        if not user in group.adminList:
            return jsonify({
                'retCode':400,
                'errMsg':'user is not admin, no authority to do this'
            })
        assign = Assignment(
            name = assignmentName,
            category = category,
            startTime = startTime,
            endTime = endTime,
            content = content,
            prior = prior
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
        res['assignmentName'] = assign.name
        res['category'] = assign.category
        res['prior'] = assign.prior
        res['startTime'] = assign.startTime
        res['endTime'] = assign.endTime
        res['assignmentContent'] = assign.content
        return jsonify(res)
    
@app.route('/assign/setPrior',methods=['POST'])
def setAssignmentPrior():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        assignmentID = request.form.get('assignmentID',None)
        prior = request.form.get('prior',None)
        group = Group.query.get(groupID)
        user = User.query.get(userID)
        assign = Assignment.query.get(assignmentID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        if not assign:
            return jsonify({
                'retCode':400,
                'errMsg':'assignment not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not assign in group.assignList:
            return jsonify({
                'retCode':400,
                'errMsg':'assignment not in this group'
            })
        if not user in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'user not in this group'
            })
        if not group in user.adminGroupList:
            res = {
                'retCode':400,
                'errMsg':'user is not admin, have no authority to do this'
            }
            return jsonify(res)
        assign.prior = prior
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['assignmentID'] = assignmentID
        res['assignmentName'] = assign.name
        res['category'] = assign.category
        res['prior'] = prior
        return jsonify(res)
    
@app.route('/assign/invite',methods=['POST'])
def setAssignmentExecutor():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        assignmentID = request.form.get('assignmentID',None)
        executorID = request.form.get('executorID',None)
        operation = request.form.get('operation',None)
        assign = Assignment.query.get(assignmentID)
        executor = User.query.get(executorID)
        group = Group.query.get(groupID)
        user = User.query.get(userID)
        user = User.query.get(userID)
        group = Group.query.get(groupID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        if not executor:
            return jsonify({
                'retCode':400,
                'errMsg':'invited user not exist'
            })
        if not assign:
            return jsonify({
                'retCode':400,
                'errMsg':'assignment not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not user in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'user not in this group'
            })
        if not executor in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'invited user not in this group'
            })
        if not assign in group.assignList:
            return jsonify({
                'retCode':400,
                'errMsg':'assignment not in this group'
            })
        if not group in user.adminGroupList:
            res = {
                'retCode':400,
                'errMsg':'you have no authority to do this'
            }
            return jsonify(res)
        if int(operation)==1:
            if assign in executor.assignList:
                return jsonify({
                    'retCode':400,
                    'errMsg':'invited user already taken this assign, can\'t invite again'
                })
            if assign.category == 1:
                taskList = executor.taskList
                for task in taskList:
                    if not compatible(task,assign):
                        res = {
                            'retCode':400,
                            'errMsg':'can\'t invite because time conflict'
                        }
                        return jsonify(res)
                assignList = executor.assignList
                for old_assign in assignList:
                    if not compatible(old_assign,assign):
                        res = {
                            'retCode':400,
                            'errMsg':'can\'t invite because time conflict'
                        }
                        return jsonify(res)
            executor.assignInvitationList.append(assign)
        elif int(operation)==-1:
            if not executor in assign.executorList:
                return jsonify({
                    'retCode':200,
                    'errMsg':'executor not taking this assign, can\'t cancel him'
                })
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
    
@app.route('/assign/join',methods=['POST'])
def joinAssignment():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        assignmentID = request.form.get('assignmentID',None)
        operation = request.form.get('operation',None)
        user = User.query.get(userID)
        assign = Assignment.query.get(assignmentID)
        group = Group.query.get(groupID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not assign:
            return jsonify({
                'retCode':400,
                'errMsg':'assignment not exist'
            })
        if not user in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'user not in this group'
            })
        if not assign in group.assignList:
            return jsonify({
                'retCode':400,
                'errMsg':'assignment not in this group'
            })
        if assign in user.assignList:
            res = {
                'retCode':400,
                'errMsg':'already in assignment, can\'t join again'
            }
            return jsonify(res)
        user.assignInvitationList.remove(assign)
        if int(operation)==1:
            user.assignList.append(assign)
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
    
@app.route('/assign/setTime',methods=['POST'])
def setAssignmentTime():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        startTime = request.form.get('startTime',None)
        endTime = request.form.get('endTime',None)
        assignmentID = request.form.get('assignmentID',None)
        group = Group.query.get(groupID)
        user = User.query.get(userID)
        assign = Assignment.query.get(assignmentID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        if not assign:
            return jsonify({
                'retCode':400,
                'errMsg':'assignment not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not assign in group.assignList:
            return jsonify({
                'retCode':400,
                'errMsg':'assignment not in this group'
            })
        if not user in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'user not in this group'
            })
        if not group in user.adminGroupList:
            res = {
                'retCode':400,
                'errMsg':'user is not admin, have no authority to do this'
            }
            return jsonify(res)
        if not group in user.adminGroupList:
            res = {
                'retCode':400,
                'errMsg':'you have no authority to do this'
            }
            return jsonify(res)
        cur_assign = Assignment(
            startTime = startTime,
            endTime = endTime
        )
        if assign.category==1:
            for executor in assign.executorList:
                for task in executor.taskList:
                    if not compatible(task,cur_assign):
                        return jsonify({
                            'retCode':400,
                            'errMsg':'can\'t change because some executor has time conflict'
                        })
                executor.assignList.remove(assign)
                for old_assign in executor.assignList:
                    if not compatible(old_assign,cur_assign):
                        executor.assignList.append(assign)
                        return jsonify({
                            'retCode':400,
                            'errMsg':'can\'t change because some executor has time conflict'
                        })
                executor.assignList.append(assign)
        assign.startTime = startTime
        assign.endTime = endTime
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['assignmentID'] = assignmentID
        res['assignmentName'] = assign.name
        res['category'] = assign.category
        res['startTime'] = startTime
        res['endTime'] = endTime
        return jsonify(res)
    
@app.route('/assign/setContent',methods=['POST'])
def setAssignmentContent():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        assignmentContent = request.form.get('assignmentContent',None)
        assignmentID = request.form.get('assignmentID',None)
        group = Group.query.get(groupID)
        user = User.query.get(userID)
        assign = Assignment.query.get(assignmentID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        if not assign:
            return jsonify({
                'retCode':400,
                'errMsg':'assignment not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not assign in group.assignList:
            return jsonify({
                'retCode':400,
                'errMsg':'assignment not in this group'
            })
        if not user in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'user not in this group'
            })
        if not group in user.adminGroupList:
            res = {
                'retCode':400,
                'errMsg':'user is not admin, have no authority to do this'
            }
            return jsonify(res)
        if not group in user.adminGroupList:
            res = {
                'retCode':400,
                'errMsg':'you have no authority to do this'
            }
            return jsonify(res)
        assign.content = assignmentContent
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['assignmentID'] = assignmentID
        res['assignmentName'] = assign.name
        res['category'] = assign.category
        res['content'] = assignmentContent
        return jsonify(res)
    
@app.route('/group/task',methods=['GET'])
def queryAllTasks():
    if request.method == 'GET':
        groupID = request.args.get('groupID')
        date = request.args.get('date')
        group = Group.query.get(groupID)
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        taskList = group.taskList
        res = dict()
        res['retCode'] = 200
        tasks = []
        for task in taskList:
            if not sameDay(date,task):
                continue
            t = dict()
            t['userID'] = task.user.id
            t['userName'] = task.user.name
            t['taskID'] = task.id
            t['taskName'] = task.name
            t['startTime'] = task.startTime
            t['endTime'] = task.endTime
            t['taskContent'] = task.content
            tasks.append(t)
        res['tasks'] = tasks
        return jsonify(res)
    
@app.route('/group/pendingTask',methods=['GET'])
def queryAllPendingTasks():
    if request.method == 'GET':
        groupID = request.args.get('groupID')
        group = Group.query.get(groupID)
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
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
            t['startTime'] = task.startTime
            t['endTime'] = task.endTime
            t['pendingTaskContent'] = task.content
            t['voteNum'] = task.voteNum
            tasks.append(t)
        res['pendingTasks'] = tasks
        return jsonify(res)
    
@app.route('/group/assign',methods=['GET'])
def queryAllAssignments():
    if request.method == 'GET':
        groupID = request.args.get('groupID')
        date = request.args.get('date')
        group = Group.query.get(groupID)
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        taskList = group.assignList
        res = dict()
        res['retCode'] = 200
        tasks = []
        for task in taskList:
            if not sameDay(date,task):
                continue
            t = dict()
            t['assignmentID'] = task.id
            t['assignmentName'] = task.name
            t['category'] = task.category
            t['startTime'] = task.startTime
            t['endTime'] = task.endTime
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
    
@app.route('/task/info',methods=['GET'])
def queryTask():
    if request.method == 'GET':
        groupID = request.args.get('groupID')
        taskID = request.args.get('taskID')
        task = Task.query.get(taskID)
        if not task:
            return jsonify({
                'retCode':400,
                'errMsg':'task not exist'
            })
        res = dict()
        res['retCode'] = 200
        res['userID'] = task.user.id
        res['userName'] = task.user.name
        res['groupID'] = task.group.id
        res['groupName'] = task.group.name
        res['taskID'] = task.id
        res['taskName']= task.name
        res['startTime'] = task.startTime
        res['endTime'] = task.endTime
        res['taskContent'] = task.content
        return jsonify(res)
    
@app.route('/pendingTask/info',methods=['GET'])
def queryPendingTask():
    if request.method == 'GET':
        groupID = request.args.get('groupID')
        pendingTaskID = request.args.get('pendingTaskID')
        task = PendingTask.query.get(pendingTaskID)
        if not task:
            return jsonify({
                'retCode':400,
                'errMsg':'pendingtask not exist'
            })
        res = dict()
        res['retCode'] = 200
        res['userID'] = task.user.id
        res['userName'] = task.user.name
        res['groupID'] = task.group.id
        res['groupName'] = task.group.name
        res['pendingTaskID'] = task.id
        res['pendingTaskName']= task.name
        res['startTime'] = task.startTime
        res['endTime'] = task.endTime
        res['pendingTaskContent'] = task.content
        res['voteNum'] = task.voteNum
        return jsonify(res)
    
@app.route('/assign/info',methods=['GET'])
def queryAssignment():
    if request.method == 'GET':
        groupID = request.args.get('groupID')
        assignmentID = request.args.get('assignmentID')
        task = Assignment.query.get(assignmentID)
        if not task:
            return jsonify({
                'retCode':400,
                'errMsg':'assignment not exist'
            })
        res = dict()
        res['retCode'] = 20
        res['groupID'] = task.group.id
        res['groupName'] = task.group.name
        res['assignmentID'] = task.id
        res['assignmentName']= task.name
        res['startTime'] = task.startTime
        res['endTime'] = task.endTime
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
    
@app.route('/task/delete',methods=['POST'])
def deleteTask():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        taskID = request.form.get('taskID',None)
        user = User.query.get(userID)
        group = Group.query.get(groupID)
        task = Task.query.get(taskID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not user in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'user not in this group'
            })
        if not task:
            return jsonify({
                'retCode':400,
                'errMsg':'task not exist'
            })
        if not task in group.taskList:
            return jsonify({
                'retCode':400,
                'errMsg':'task not in this group'
            })
        if not task in user.taskList:
            return jsonify({
                'retCode':400,
                'errMsg':'task not in user\'s taskList'
            })
        db.session.delete(task)
        db.session.commit()
        res = {
            'retCode':200
        }
        return jsonify(res)
    
@app.route('/pendingTask/delete',methods=['POST'])
def deletePendingTask():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        pendingTaskID = request.form.get('pendingTaskID',None)
        user = User.query.get(userID)
        group = Group.query.get(groupID)
        task = PendingTask.query.get(pendingTaskID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not user in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'user not in this group'
            })
        if not task:
            return jsonify({
                'retCode':400,
                'errMsg':'pendingtask not exist'
            })
        if not task in group.pendingTaskList:
            return jsonify({
                'retCode':400,
                'errMsg':'pendingtask not in this group'
            })
        if not task in user.pendingTaskList:
            return jsonify({
                'retCode':400,
                'errMsg':'task not in user\'s pendingtaskList'
            })
        db.session.delete(task)
        db.session.commit()
        res = {
            'retCode':200
        }
        return jsonify(res)
    
@app.route('/assign/delete',methods=['POST'])
def deleteAssignment():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        assignmentID = request.form.get('assignmentID',None)
        user = User.query.get(userID)
        group = Group.query.get(groupID)
        task = Assignment.query.get(assignmentID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not user in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'user not in this group'
            })
        if not task:
            return jsonify({
                'retCode':400,
                'errMsg':'assignment not exist'
            })
        if not task in group.assignList:
            return jsonify({
                'retCode':400,
                'errMsg':'assignment not in this group'
            })
        if not task in user.ownAssignList:
            return jsonify({
                'retCode':400,
                'errMsg':'user is not assignment owner, no authority to do this'
            })
        db.session.delete(task)
        db.session.commit()
        res = {
            'retCode':200
        }
        return jsonify(res)

@app.route('/group/delete',methods=['POST'])
def deleteGroup():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        user = User.query.get(userID)
        group = Group.query.get(groupID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not user in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'user not in this group'
            })
        if user.id != group.owner_id:
            return jsonify({
                'retCode':400,
                'errMsg':'user is not group owner, no authority to do this'
            })
        db.session.delete(group)
        db.session.commit()
        res = {
            'retCode':200
        }
        return jsonify(res)

@app.route('/task/changeInfo',methods=['POST'])
def changeTaskInfo():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        taskID = request.form.get('taskID',None)
        taskName = request.form.get('taskName',None)
        taskContent = request.form.get('taskContent',None)
        startTime = request.form.get('startTime',None)
        endTime = request.form.get('endTime',None)
        user = User.query.get(userID)
        task = Task.query.get(taskID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        if not task:
            return jsonify({
                'retCode':400,
                'errMsg':'task not exist'
            })
        if not task in user.taskList:
            return jsonify({
                'retCode':400,
                'errMsg':'task not in user\'s taskList'
            })
        task.name = taskName
        task.content = taskContent
        task.startTime = startTime
        task.endTime = endTime
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['taskID'] = taskID
        res['startTime'] = startTime
        res['endTime'] = endTime
        res['taskName'] = taskName
        res['taskContent'] = taskContent
        return jsonify(res)

@app.route('/group/changeName',methods=['POST'])
def changeGroupName():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        groupName = request.form.get('groupName',None)
        group = Group.query.get(groupID)
        user = User.query.get(userID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not user in group.adminList:
            return jsonify({
                'retCode':400,
                'errMsg':'user not admin, no authority to do this'
            })
        group.name = groupName
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['groupID'] = groupID
        res['groupName'] = groupName
        return jsonify(res)

@app.route('/group/deleteMember',methods=['POST'])
def deleteMember():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        memberID = request.form.get('memberID',None)
        user = User.query.get(userID)
        group = Group.query.get(groupID)
        member = User.query.get(memberID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not user in group.adminList:
            return jsonify({
                'retCode':400,
                'errMsg':'user not admin, no authority to do this'
            })
        if not member:
            return jsonify({
                'retCode':400,
                'errMsg':'deleted user not exist'
            })
        if not member in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'deleted user not in this group'
            })
        if member in group.adminList:
            return jsonify({
                'retCode':400,
                'errMsg':'you have no authority tp delete an admin'
            })
        group.userList.remove(member)
        db.session.commit()
        return jsonify({'retCode':200})

@app.route('/user/assign',methods=['GET'])
def userAssign():
    if request.method == 'GET':
        userID = request.args.get('userID')
        date = request.args.get('date')
        curUser = User.query.get(userID)
        if not curUser:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        assignList = curUser.assignList
        res = dict()
        res['retCode'] = 200
        assigns = []
        for assign in assignList:
            if not sameDay(date,assign):
                continue
            t = dict()
            t['category'] = assign.category
            t['groupID'] = assign.group_id
            t['groupName'] = assign.group.name
            t['assignmentID'] = assign.id
            t['assignmentName'] = assign.name
            t['startTime'] = assign.startTime
            t['endTime'] = assign.endTime
            t['assignmentContent'] = assign.content
            t['prior'] = assign.prior
            assigns.append(t)
        res['assignments'] = assigns
        return jsonify(res)

@app.route('/user/ownAssign',methods=['GET'])
def userOwnAssign():
    if request.method == 'GET':
        userID = request.args.get('userID')
        user = User.query.get(userID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        assignList = user.ownAssignList
        res = dict()
        res['retCode'] = 200
        assigns = []
        for assign in assignList:
            t = dict()
            t['category'] = assign.category
            t['groupID'] = assign.group_id
            t['groupName'] = assign.group.name
            t['assignmentID'] = assign.id
            t['assignmentName'] = assign.name
            t['startTime'] = assign.startTime
            t['endTime'] = assign.endTime
            t['assignmentContent'] = assign.content
            t['prior'] = assign.prior
            assigns.append(t)
        res['assignments'] = assigns
        return jsonify(res)

@app.route('/group/invitation',methods=['GET'])
def groupInvitation():
    if request.method == 'GET':
        groupID = request.args.get('groupID')
        group = Group.query.get(groupID)
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        invitingList = group.invitingList
        users = []
        for user in invitingList:
            t = dict()
            t['userID'] = user.id
            t['userName'] = user.name
            users.append(t)
        res = dict()
        res['users'] = users
        res['retCode'] = 200
        res['groupID'] = groupID
        res['groupName'] = group.name
        return jsonify(res)
    
@app.route('/user/info',methods = ['GET'])
def getUserInfo():
    if request.method == 'GET':
        userID = request.args.get('userID')
        user = User.query.get(userID)
        if not user:
            return jsonify({
                'retCode':400,
                'errMsg':'user not exist'
            })
        res = dict()
        res['retCode'] = 200
        res['userID'] = user.id
        res['userName'] = user.name
        return jsonify(res)
    
@app.route('/group/multiInvite', methods = ['POST'])
def multiInvite():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        invitedUserIDs = request.form.get('invitedUserIDs',None)
        invitedIDs = invitedUserIDs.split('#')
        group = Group.query.get(groupID)
        inviter = User.query.get(userID)
        if not inviter:
            return jsonify({
                'retCode':400,
                'errMsg':'inviter not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not inviter in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'inviter not in this group'
            })
        invitedNames = ''
        for invitedID in invitedIDs:
            user = User.query.get(invitedID)
            if not user:
                return jsonify({
                    'retCode':400,
                    'errMsg':'invited user not exist'
                })
            if group in user.groupList:
                res = {
                    'retCode':400,
                    'errMsg':'invited user already in group! can\'t invite again'
                }
                return jsonify(res)
            if not group in user.groupInvitationList:
                user.groupInvitationList.append(group)
            invitedNames = invitedNames + '#' + user.name
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['invitedUserIDs'] = invitedUserIDs
        res['invitedUserNames'] = invitedNames[1:]
        return jsonify(res)
    
@app.route('/assign/multiInvite', methods = ['POST'])
def multiInviteAssign():
    if request.method == 'POST':
        userID = request.form.get('userID',None)
        groupID = request.form.get('groupID',None)
        assignID = request.form.get('assignmentID',None)
        invitedUserIDs = request.form.get('invitedUserIDs',None)
        invitedIDs = invitedUserIDs.split('#')
        group = Group.query.get(groupID)
        inviter = User.query.get(userID)
        assign = Assignment.query.get(assignID)
        if not inviter:
            return jsonify({
                'retCode':400,
                'errMsg':'inviter not exist'
            })
        if not group:
            return jsonify({
                'retCode':400,
                'errMsg':'group not exist'
            })
        if not assign:
            return jsonify({
                'retCode':400,
                'errMsg':'assign not exist'
            })
        if not inviter in group.userList:
            return jsonify({
                'retCode':400,
                'errMsg':'inviter not in this group'
            })
        if not assign in group.assignList:
            return jsonify({
                'retCode':400,
                'errMsg':'assignment not in this group'
            })
        if not group in inviter.adminGroupList:
            res = {
                'retCode':400,
                'errMsg':'you have no authority to do this'
            }
            return jsonify(res)
        invitedNames = ''
        for invitedID in invitedIDs:
            user = User.query.get(invitedID)
            if not user:
                return jsonify({
                    'retCode':400,
                    'errMsg':'invited user not exist'
                })
            if not group in user.groupList:
                res = {
                    'retCode':400,
                    'errMsg':'invited user not in group'
                }
                return jsonify(res)
            if assign.category == 1:
                taskList = user.taskList
                for task in taskList:
                    if not compatible(task,assign):
                        res = {
                            'retCode':400,
                            'errMsg':'can\'t invite because time conflict'
                        }
                        return jsonify(res)
                assignList = user.assignList
                for old_assign in assignList:
                    if not compatible(old_assign,assign):
                        res = {
                            'retCode':400,
                            'errMsg':'can\'t invite because time conflict'
                        }
                        return jsonify(res)
            user.assignInvitationList.append(assign)
            invitedNames = invitedNames + '#' + user.name
        db.session.commit()
        res = dict()
        res['retCode'] = 200
        res['invitedUserIDs'] = invitedUserIDs
        res['invitedUserNames'] = invitedNames[1:]
        return jsonify(res)

if __name__ == '__main__':
    app.run()