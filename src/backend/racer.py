import socketio

sio = socketio.Client()


@sio.event
def connect():
    print("Connected")
    name = input("Racer name? ")
    race_number = input("Team Number? ")
    sio.emit("setup-racer", {"name": name, "number": race_number})
    print("Sent.")


@sio.event
def disconnect():
    print("Disconnected")


@sio.on("message")
def on_message(data):
    print(data)


sio.connect("http://localhost:3000")
