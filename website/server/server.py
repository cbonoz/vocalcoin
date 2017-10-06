"""
ToastCoin Web Server (Flask)
Async web server that responds to incoming text messages for creating new accounts and performing transactions on the blockchain.

Primary dependencies:
* twilio: https://www.twilio.com/docs/guides/how-to-receive-and-reply-in-python
* socketio: https://github.com/miguelgrinberg/python-socketio
* web3py

Author: Chris Buonocore
"""
import socketio
import eventlet
import eventlet.wsgi
from flask import Flask, request, redirect
from twilio.twiml.messaging_response import MessagingResponse

# User libraries:
from vocal import Vocal

sio = socketio.Server()
app = Flask(__name__)

# create the web3 object instance (pointing to the deployed token contract)
CONTRACT_ADDR = "1" # TODO: add real address
vocal = Vocal(CONTRACT_ADDR)

@app.route("/sms", methods=['GET', 'POST'])
def sms_reply():
    """Respond to incoming calls with a simple text message."""
    # Start our TwiML response
    resp = MessagingResponse()

    # Add a message
    resp.message("The Robots are coming! Head for the hills!")

    return str(resp)

# TODO: replace these socket io handlers with handlers to respond to request to feed the blockchain 
# and new transactions back to connected clients.
@sio.on('connect', namespace='/chat')
def connect(sid, environ):
    print("connect ", sid)

@sio.on('chat message', namespace='/chat')
def message(sid, data):
    print("message ", data)
    sio.emit('reply', room=sid)

@sio.on('disconnect', namespace='/chat')
def disconnect(sid):
    print('disconnect ', sid)

if __name__ == '__main__':
    # wrap Flask application with engineio's middleware
    app = socketio.Middleware(sio, app)

    # deploy as an eventlet WSGI server
    eventlet.wsgi.server(eventlet.listen(('', 8000)), app)
