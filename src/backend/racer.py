import socketio

sio = socketio.Client()

@sio.event
def connect():
    print('Connected')
    sio.emit("setup",{'Racer Name', 'Group Number','video target'})

@sio.event
def disconnect():
    print('Disconnected')

@sio.on('message')
def on_message(data):
    print(data)

if __name__ == '__main__':
    sio.connect('http://localhost:3000')
    sio.wait()
