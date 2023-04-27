import socketio
import socket
import time
import subprocess

# IMPORTANT:
# ENSURE YOU HAVE INSTALLED SOCKETIO. pip install "python-socketio[client]" is the command to do so.
# READ THROUGH THIS CODE TO UNDERSTAND HOW YOU WILL RECEIVE THE UDP LINK WHERE THE BBB SHOULD STREAM TO!

# one way to retrieve UDP link is to have a while loop that checks if sendFeed is empty until UDP link is received from RM.
sendFeed = (
    # This is where the UDP link where your BBB needs to stream to will be stored.
    ""
)

RM_global_ip = ""


class RaceConnection:
    sio = socketio.Client()

    def __init__(self, hostname):
        try:  # We will try and install socketio if you don't already have it.
            subprocess.check_call(["pip", "install", "python-socketio[client]"])
        except subprocess.CalledProcessError as e:
            print("Error installing python-socketio:", e)
            exit(-1)

        self.ip_address = socket.gethostbyname(
            hostname
        )  # Race Management's IP Address. Determined by hostname,
        global RM_global_ip
        RM_global_ip = self.ip_address
        self.RM = (
            "http://" + self.ip_address + ":3000"
        )  # which will be "G17". Be sure to load that value

        self.sio.on(
            "connect", self.on_connect
        )  # into hostname when creating an instance of this class.
        self.sio.on("disconnect-racer", self.on_disconnect)
        self.sio.on("get-rtsp-server", self.on_get_rtsp)
        self.connected = False
        self.team_number = 0
        self.name = ""
        self.race_number = 0

    @sio.on("server-msg")
    def on_server_mg(
        msg,
    ):  # On sio events, self actually refers to the message sent by the server, not the object.
        print("Server message:", msg)

    # Retrieve which UDP link to stream to, store it in sendFeed. msg is the racer number given to you (connection 1 or 2)
    def on_get_rtsp(self, msg):
        global sendFeed
        global RM_global_ip
        self.race_number = msg
        print("Server to connect to:", msg)
        if len(sendFeed) == 0 and len(RM_global_ip) != 0:
            if msg == 1:
                sendFeed = "udp://" + RM_global_ip + ":33113"
                self.stream_link = sendFeed
                print(f"Stream BBB camera to this endpoint: {sendFeed}")
            elif msg == 2:
                sendFeed = "udp://" + RM_global_ip + ":44775"
                self.stream_link = sendFeed
                print(f"Stream BBB camera to this endpoint: {sendFeed}")
            print(
                "The UDP link where you should stream your camera has been loaded into RaceConnection.sendFeed. "
                "Feel free to use this variable, you can send this to your BBB."
            )
        else:
            print("Could not retrieve UDP link. Please stop execution and run again.")
            exit(-1)

    def on_connect(self):
        print("Connected\n")
        self.connected = True

    def on_disconnect(self, index):
        if index == self.race_number:
            print("Disconnected")
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
            self.sio.emit(
                "send-throttle", {"teamNum": self.team_number, "throttle": throttle}
            )

    def start(self):
        self.connect_to_RM()
        while True:
            command = input("To enter a new car, type n, else type q to quit. ")
            if command.lower() == "n":
                self.racer_setup()
                time.sleep(
                    3
                )  # Need a little buffer for the RM server to send messages.
                break
            elif command.lower() == "q":
                print("No connection established.")
                break
            else:
                print("Invalid command, try again!")
