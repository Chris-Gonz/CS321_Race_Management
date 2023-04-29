import socketio
import socket
import time
import subprocess
import os
import signal


# IMPORTANT:
# ENSURE YOU HAVE INSTALLED SOCKETIO. pip install "python-socketio[client]" is the command to do so.
# READ THROUGH THIS CODE TO UNDERSTAND HOW YOU WILL RECEIVE THE UDP LINK WHERE THE BBB SHOULD STREAM TO!

# There is an example at the very end of this file to show you how to connect to RM.
# This file should be running on wherever the controller is plugged in to. If controller is plugged directly into
# BBB, then this should be running on the BBB. If controller is plugged in to a laptop, it should be running on the
# laptop. Please see code at end of file.


class RaceConnection:
    sio = socketio.Client()

    def __init__(self, hostname):
        try:  # We will try and install socketio if you don't already have it.
            subprocess.check_call(["pip", "install", "python-socketio[client]"])
        except subprocess.CalledProcessError as e:
            print("Error installing python-socketio:", e)
            print("Stopping execution...")
            os.kill(os.getpid(), signal.SIGTERM)

        self.ip_address = socket.gethostbyname(hostname)  # Race Management's IP Address. Determined by hostname,
        self.RM = "http://" + self.ip_address + ":3000"   # which will be "G17". Be sure to load that value
        self.sio.on("connect", self.on_connect)           # into hostname when creating an instance of this class.
        self.sio.on("disconnect-racer", self.on_disconnect)
        self.sio.on("get-rtsp-server", self.on_get_rtsp)
        self.connected = False
        self.team_number = 0
        self.name = ""
        self.race_number = 0
        self.sendFeed = ""  # This is where the UDP link to stream to will be stored.

    @sio.on("server-msg")
    def on_server_mg(msg):  # On sio events, self actually refers to the message sent by the server, not the object.
        print("Server message:", msg)
        if "Max" in msg:  # Kill program if max racers reached.
            print("Stopping execution...")
            os.kill(os.getpid(), signal.SIGTERM)

    # Retrieve which UDP link to stream to, store it in sendFeed.
    def on_get_rtsp(self, msg):
        self.race_number = msg
        print("Server to connect to:", msg)
        if len(self.sendFeed) == 0 and len(self.ip_address) != 0:
            if msg == 1:
                self.sendFeed = "udp://" + self.ip_address + ":33113"
                print(f"\nStream BBB camera to this endpoint: {self.sendFeed}")
            elif msg == 2:
                self.sendFeed = "udp://" + self.ip_address + ":44775"
                print(f"\nStream BBB camera to this endpoint: {self.sendFeed}")
            print("The UDP link where you should stream your camera has been loaded into RaceConnection.sendFeed.\n" +
                  f"Here is the value now stored in RaceConnection.sendFeed: {self.sendFeed}\n" +
                  "Feel free to use this variable to send the link to your BeagleBone.")
        else:
            print("Could not retrieve UDP link.")
            print("Stopping execution...")
            os.kill(os.getpid(), signal.SIGTERM)

    def on_connect(self):
        print("Connected\n")
        self.connected = True

    def on_disconnect(self, index):
        if index == self.race_number:
            print("Disconnected\n")
            self.connected = False
            self.sio.disconnect()
        else:
            print("Disconnected from another racer. Ignoring.")

    def racer_setup(self):
        self.name = input("Racer name? ")
        self.team_number = input("Team number? ")
        self.sio.emit("setup-racer", {"name": self.name, "number": self.team_number})

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
        if self.connected:
            self.sio.emit("send-throttle", {"teamNum": self.team_number, "throttle": throttle})

    def start(self):
        self.connect_to_RM()
        while True:
            command = input("To enter a new car, type n, else type q to quit. ")
            if command.lower() == "n":
                self.racer_setup()
                while True:
                    if len(self.ip_address) != 0 and len(self.sendFeed) != 0:
                        break  # Wait until the server sends UDP link and stores IP address. Once loaded, break.
                break
            elif command.lower() == "q":
                self.on_disconnect(0)
                print("No connection established.")
                break
            else:
                print("Invalid command, try again!")

# import racer
# def main():
#     RMName = "G17"
#     RaceManagement = racer.RaceConnection(RMName)  # Establish connection to Race Management
#     RaceManagement.start()  # Will prompt for name, number, and send an integer indicating what stream to record to.

# After executing these lines and connecting your racer, you should see messages which tell you the value of sendFeed.
