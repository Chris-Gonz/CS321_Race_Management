import socketio
import socket
import time
import subprocess


class RaceConnection:
    def __init__(self, hostname):
        try:
            subprocess.check_call(["pip", "install", "python-socketio"])  # Install dependencies
        except subprocess.CalledProcessError as e:
            print("Error installing python-socketio:", e)

        self.sio = socketio.Client()
        self.ip_address = socket.gethostbyname(hostname)
        self.RM = "http://" + self.ip_address + ":3000"

        self.sio.on("connect", self.on_connect)
        self.sio.on("disconnect", self.on_disconnect)

        self.connected = False

    def on_connect(self):
        print("Connected\n")
        self.connected = True

    def on_disconnect(self):
        print("Disconnected")
        self.connected = False

    def racer_setup(self):
        name = input("Racer name?")
        race_number = input("Team number?")
        self.sio.emit("setup-racer", {"name": name, "number": race_number})

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

    def stop(self):
        self.sio.disconnect(self.RM)

    def start(self):
        self.connect_to_RM()

        while True:
            command = input("To enter a new car, type n, else type q to quit.")
            if command.lower() == "n":
                self.racer_setup()
                break
            elif command.lower() == "q":
                print("No connection established.")
                break
            else:
                print("Invalid command, try again!")
