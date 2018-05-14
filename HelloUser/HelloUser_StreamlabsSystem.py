# -*- coding: utf-8 -*-
#---------------------------------------
# Import Libraries
#---------------------------------------
import sys
import io
import json
import clr
clr.AddReference("IronPython.SQLite.dll")
clr.AddReference("IronPython.Modules.dll")
from os.path import isfile
from datetime import datetime, timedelta

#---------------------------------------
# [Required] Script Information
#---------------------------------------
ScriptName = "HelloUser"
Website = "https://github.com/lucarin91/hellouser-streamlabs"
Description = "Greet user that write on the twitch chat."
Creator = "lucarin91"
Version = "2.0.0"

#---------------------------------------
# Set Variables
#---------------------------------------
saluto = "Buonsalve"
delta_minutes = timedelta(minutes=20)
_active_users = {}

#---------------------------------------
# [Required] Intialize Data (Only called on Load)
#---------------------------------------
def Init():
    Parent.Log(ScriptName, "Init!")
    settings = 'Services/Scripts/{}/settings.json'.format(ScriptName)
    if isfile(settings):
        with io.open(settings, mode='r', encoding='utf-8-sig') as f:
            conf = json.loads(f.read())
            parse_conf(conf)

#---------------------------------------
# [Required] Execute Data / Process Messages
#---------------------------------------
def Execute(data):
    global _active_users
    if data.IsChatMessage() and data.IsFromTwitch()\
       and not Parent.HasPermission(data.User, 'caster', ''):
        user = data.User
        now = datetime.now()
        if user not in _active_users\
           or now - _active_users[user] > delta_minutes:
            send_saluto(user)
        _active_users[user] = now
        # Parent.Log(ScriptName, 'Update deltatime user {}'.format(user)
        
#---------------------------------------
# [Required] Tick Function
#---------------------------------------
def Tick():
    pass

def Unload():
    pass
    
def ReloadSettings(jsonData):
    parse_conf(json.loads(jsonData))

#---------------------------------------
# My functions
#---------------------------------------
def TryMessage():
    """Try the message on OBS."""
    Parent.Log(ScriptName, 'Try message!')
    send_saluto('Funzeca?!')

def send_saluto(user):
    """Broadcast the event with the greating message."""
    msg = '{} {}'.format(saluto, Parent.GetDisplayName(user))
    Parent.Log(ScriptName, 'Greet {}'.format(user))    
    Parent.BroadcastWsEvent('EVENT_HELLO_USER', json.dumps({"msg": msg}))

def parse_conf(conf):
    """Set the configuration variables."""
    global saluto, delta_minutes
    saluto = conf['saluto']
    delta_minutes = timedelta(minutes=conf['delta_time'])
    Parent.Log(ScriptName, 'Load conf: {}'.format((saluto, delta_minutes)))
