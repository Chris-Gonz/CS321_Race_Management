import socketio

sio = socketio.Client()


@sio.event
def connect():
    print("Connected\n")

@sio.event
def disconnect():
    print("Disconnected")

def racer_setup():
    name = input("Racer name? ")
    race_number = input("Team Number? ")
    sio.emit("setup-racer", {"name": name, "number": race_number})


def main():
    sio.connect("http://localhost:3000")
    while (
        command := input("To enter a new car, type n, else type q to quit? ")
    ).lower() != "q":
        if command.lower() == "n":
            racer_setup()
        else:
            print("Invalid command, try again!")


if __name__ == "__main__":
    main()
