import Chat from "./components/Chat";
import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import { peg, rat, sheep, dog } from "./assets";

const socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const avatar = [peg, rat, sheep, dog][avatarIndex];

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="bg-black relative flex flex-col justify-center p-4 items-center multicolorGradient h-screen">
      {!showChat ? (
        <div className="flex gap-2 min-w-[400px] rounded-md bg-white py-8 px-4 bg-opacity-60 backdrop-blur-sm">
          <div className="flex flex-col gap-2 w-full">
            <h3 className="text-center text-xl font-bold">Join A Chat :</h3>
            <label htmlFor="username">Chose a name</label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="John..."
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <label htmlFor="room">Enter a room ID</label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="Room ID..."
              onChange={(event) => {
                setRoom(event.target.value);
              }}
            />
            <div>
              <h3>Chose an avatar</h3>
              <div className="avatar-images flex flex-wrap gap-4 mt-3">
                <label
                  onClick={() => setAvatarIndex(0)}
                  htmlFor="avatar1"
                  className={`relative flex flex-col justify-between items-center ${
                    avatarIndex == 0 ? "p-1" : "opacity-50 p-2"
                  } h-16 w-16 bg-white rounded-md`}
                >
                  <img src={peg} alt="Avatar 0" />
                  {avatarIndex == 0 && (
                    <div className="absolute bottom-0 right-0 bg-green-400 h-3 w-3 rounded-full"></div>
                  )}
                </label>
                <label
                  onClick={() => setAvatarIndex(1)}
                  htmlFor="avatar2"
                  className={`relative flex flex-col justify-between items-center ${
                    avatarIndex == 1 ? "p-1" : "opacity-50 p-2"
                  } h-16 w-16 bg-white rounded-md`}
                >
                  <img src={rat} alt="Avatar 1" />
                  {avatarIndex == 1 && (
                    <div className="absolute bottom-0 right-0 bg-green-400 h-3 w-3 rounded-full"></div>
                  )}
                </label>
                <label
                  onClick={() => setAvatarIndex(2)}
                  htmlFor="avatar3"
                  className={`relative flex flex-col justify-between items-center ${
                    avatarIndex == 2 ? "p-1" : "opacity-50 p-2"
                  }  h-16 w-16 bg-white rounded-md`}
                >
                  <img src={sheep} alt="Avatar 2" />
                  {avatarIndex == 2 && (
                    <div className="absolute bottom-0 right-0 bg-green-400 h-3 w-3 rounded-full"></div>
                  )}
                </label>
                <label
                  onClick={() => setAvatarIndex(3)}
                  htmlFor="avatar4"
                  className={`relative flex flex-col justify-between items-center ${
                    avatarIndex == 3 ? "p-1" : "opacity-50 p-2"
                  } h-16 w-16 bg-white rounded-md`}
                >
                  <img src={dog} alt="Avatar 3" />
                  {avatarIndex == 3 && (
                    <div className="absolute bottom-0 right-0 bg-green-400 h-3 w-3 rounded-full"></div>
                  )}
                </label>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={joinRoom}
                className="bg-blue-800 py-2 px-4 rounded-md text-white"
              >
                Join A Room
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} avatar={avatar} setShowChat={setShowChat} />
      )}
    </div>
  );
}

export default App;
