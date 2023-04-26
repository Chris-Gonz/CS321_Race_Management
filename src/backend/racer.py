import socketio
import socket
import time
import subprocess


class RaceConnection:
    sio = socketio.Client()

    def __init__(self, hostname):
        try:
            subprocess.check_call(
                ["pip", "install", "python-socketio"]
            )  # Install dependencies
        except subprocess.CalledProcessError as e:
            print("Error installing python-socketio:", e)

        self.ip_address = socket.gethostbyname(hostname)
        self.RM = "http://" + self.ip_address + ":3000"

        self.sio.on("connect", self.on_connect)
        self.sio.on("disconnect", self.on_disconnect)
        self.connected = False
        self.race_number = 0
        self.name = ""

    @sio.on("server-msg")
    def on_server_mg(msg):
        print("Server message:", msg)

    # Listen to which rtsp server to connect to
    @sio.on("get-rtsp-server")
    def on_get_rtsp(number):
        print("Server to connect to:", number)

    def on_connect(self):
        print("Connected\n")
        self.connected = True

    def on_disconnect(self):
        print("Disconnected")
        self.connected = False

    def racer_setup(self):
        self.name = input("Racer name? ")
        self.race_number = input("Team number? ")
        self.sio.emit("setup-racer", {"name": self.name, "number": self.race_number})

    def connect_to_RM(self):
        while not self.connected:
            try:
                self.sio.connect(self.RM)
            except socketio.exceptions.ConnectionError as e:
                print("Failed to connect. Retrying...")
                if str(e) == "Already connected":
                    break
                else:
                    time.sleep(1)

    def send_throttle(self, throttle):
        self.sio.emit(
            "send-throttle", {"teamNum": self.race_number, "throttle": throttle}
        )
        time.sleep(0.1)

    def stop(self):
        self.sio.disconnect(self.RM)

    def start(self):
        self.connect_to_RM()

        while True:
            command = input("To enter a new car, type n, else type q to quit. ")
            if command.lower() == "n":
                self.racer_setup()
                break
            elif command.lower() == "q":
                print("No connection established.")
                break
            else:
                print("Invalid command, try again!")


# racer = RaceConnection("localhost")
# racer.start()
# num = 0
# while True:
#     racer.send_throttle(num)
#     num+=1
