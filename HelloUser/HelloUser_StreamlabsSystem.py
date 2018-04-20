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

#---------------------------------------
# [Required] Script Information
#---------------------------------------
ScriptName = "HelloUser"
Website = ""
Description = ""
Creator = "lucarin91"
Version = "1.1.0"

#---------------------------------------
# Set Variables
#---------------------------------------
saluto = "Buonsalve"
_active_users = []

#---------------------------------------
# [Required] Intialize Data (Only called on Load)
#---------------------------------------
def Init():
    settings = 'Services/Scripts/{}/settings.json'.format(ScriptName)
    if isfile(settings):
        with io.open(settings, mode='r', encoding='utf-8-sig') as f:
            conf = json.loads(f.read())
            parse_conf(conf)
            Parent.Log(ScriptName, 'Load json: {}'.format(string))

#---------------------------------------
# [Required] Execute Data / Process Messages
#---------------------------------------
def Execute(data):
    global _active_users
    if data.IsChatMessage() and data.IsFromTwitch():
        active_now = Parent.GetActiveUsers()
        Parent.Log(ScriptName, 'active_now: {}\nactive_old: {}'.format(active_now, _active_users))
        if len(active_now) != len(_active_users)\
           and not Parent.HasPermission(data.User, 'caster', ''):
            send_saluto(data.User)
        _active_users = active_now

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
    Parent.BroadcastWsEvent('EVENT_HELLO_USER', json.dumps({"msg": msg}))

def parse_conf(conf):
    """Set the configuration variables."""
    global saluto
    saluto = conf['saluto']
    Parent.Log(ScriptName, 'Load conf: {}'.format((saluto)))
