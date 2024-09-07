import React, { useEffect, useRef, useState } from "react";
import "../App.css";


const Chat = ({ socket, username, room, avatar, setShowChat }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef(null);

  // useEffect(() => {
  //   sendFile()
  // }, [selectedFile]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    scrollToBottom();

    // console.log(messages);

    return () => {
      // Cleanup on component unmount
      socket.off("message");
    };
  }, [messages]);

  // Function to scroll to the bottom of the messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to send a message
  const sendMessage = async () => {
    if (messageInput.trim() !== "") {
      const message = {
        room: room,
        message: messageInput,
        timestamp: new Date(),
        id: username,
        avatar: avatar,
      };
      await socket.emit("message", message);
      setMessageInput("");
    }
  };
      

  // Function to exit the room
  const exitRoom = async () => {
    socket.emit("exit_room", room);
    setShowChat(false);
  };

  // Function to handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Function to send a file
  const sendFile = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      await socket.emit("file", {
        room: room,
        file: formData,
        timestamp: new Date(),
        id: username,
        avatar: avatar,
      });

      setSelectedFile(null); // Reset selected file after sending
    }
  };

  return (
    <div className="container max-w-screen-md max-h-screen pt-4 pb-8 px-4 rounded-md bg-white	bg-opacity-70 backdrop-blur-sm">
      <div className="text-white mb-4 flex justify-between ">
        <h2 className="font-bold text-black p-1 px-3 text-left rounded-md bg-gradient-to-r from-pink-400 to-orange-500">Room Id : {room}</h2>
        <button className="p-1 px-3 bg-red-500 rounded-md hover:bg-red-600 capitalize" onClick={exitRoom} >exit</button>
      </div>
      <div className="w-full flex flex-col gap-4 justify-between">
        <div className="overflow-auto h-[530px]">
          {messages.map((msg, index) => (
            <div className="grid pb-2 pr-2" key={index}>
              <div
                className={
                  msg.id !== username
                    ? "flex gap-2.5 mb-2"
                    : "flex gap-2.5 mb-2 flex-row-reverse"
                }
              >
                <img
                  src={
                    msg.id !== username
                      ? msg.avatar
                      : avatar
                  }
                  alt="Shanay image"
                  className="w-10 h-11"
                />
                <div className="grid">
                  <h5
                    className={`text-gray-900 text-sm font-semibold leading-snug pb-1 ${msg.id !== username ? "text-left" : "text-right"
                      }`}
                  >
                    {msg.id}
                  </h5>
                  <div className="w-max grid">
                    <div className="px-3.5 py-2 bg-gray-100 rounded justify-start  items-center gap-3 inline-flex">
                      <h5 className="text-gray-900 text-sm font-normal leading-snug">
                        {msg.message}
                      </h5>
                    </div>
                    <div
                      className={`${msg.id !== username ? "justify-start" : "justify-end"
                        } items-center inline-flex`}
                    >
                      <h6 className="text-gray-500 text-xs font-normal leading-4 py-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />

        </div>
        <div className="w-full pl-3 pr-1 py-1 rounded-3xl border bg-white bg-opacity-50 border-gray-200 items-center gap-2 inline-flex justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8">
              <img src={avatar} className="h-8 w-8" alt="" />
            </div>
            <input
              className="grow shrink basis-0 text-black bg-transparent w-3/4 text-xs font-medium leading-4 focus:outline-none"
              placeholder="Type here..."
              onChange={(e) => setMessageInput(e.target.value)}
              value={messageInput}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              name="file"
              id="file"
              className="hidden"
              ref={fileRef}
              onChange={handleFileChange}
            />
            <svg
              className="cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              width={22}
              height={22}
              viewBox="0 0 22 22"
              fill="none"
              onClick={() => fileRef.current.click()}
            >
              <g id="Attach 01">
                <g id="Vector">
                  <path
                    d="M14.9332 7.79175L8.77551 14.323C8.23854 14.8925 7.36794 14.8926 6.83097 14.323C6.294 13.7535 6.294 12.83 6.83097 12.2605L12.9887 5.72925M12.3423 6.41676L13.6387 5.04176C14.7126 3.90267 16.4538 3.90267 17.5277 5.04176C18.6017 6.18085 18.6017 8.02767 17.5277 9.16676L16.2314 10.5418M16.8778 9.85425L10.72 16.3855C9.10912 18.0941 6.49732 18.0941 4.88641 16.3855C3.27549 14.6769 3.27549 11.9066 4.88641 10.198L11.0441 3.66675"
                    stroke="#9CA3AF"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.9332 7.79175L8.77551 14.323C8.23854 14.8925 7.36794 14.8926 6.83097 14.323C6.294 13.7535 6.294 12.83 6.83097 12.2605L12.9887 5.72925M12.3423 6.41676L13.6387 5.04176C14.7126 3.90267 16.4538 3.90267 17.5277 5.04176C18.6017 6.18085 18.6017 8.02767 17.5277 9.16676L16.2314 10.5418M16.8778 9.85425L10.72 16.3855C9.10912 18.0941 6.49732 18.0941 4.88641 16.3855C3.27549 14.6769 3.27549 11.9066 4.88641 10.198L11.0441 3.66675"
                    stroke="black"
                    strokeOpacity="0.2"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.9332 7.79175L8.77551 14.323C8.23854 14.8925 7.36794 14.8926 6.83097 14.323C6.294 13.7535 6.294 12.83 6.83097 12.2605L12.9887 5.72925M12.3423 6.41676L13.6387 5.04176C14.7126 3.90267 16.4538 3.90267 17.5277 5.04176C18.6017 6.18085 18.6017 8.02767 17.5277 9.16676L16.2314 10.5418M16.8778 9.85425L10.72 16.3855C9.10912 18.0941 6.49732 18.0941 4.88641 16.3855C3.27549 14.6769 3.27549 11.9066 4.88641 10.198L11.0441 3.66675"
                    stroke="black"
                    strokeOpacity="0.2"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
            </svg>
            <button
              className="items-center flex px-3 py-2 bg-indigo-600 rounded-full shadow"
              onClick={sendMessage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
              >
                <g id="Send 01">
                  <path
                    id="icon"
                    d="M9.04071 6.959L6.54227 9.45744M6.89902 10.0724L7.03391 10.3054C8.31034 12.5102 8.94855 13.6125 9.80584 13.5252C10.6631 13.4379 11.0659 12.2295 11.8715 9.81261L13.0272 6.34566C13.7631 4.13794 14.1311 3.03408 13.5484 2.45139C12.9657 1.8687 11.8618 2.23666 9.65409 2.97257L6.18714 4.12822C3.77029 4.93383 2.56187 5.33664 2.47454 6.19392C2.38721 7.0512 3.48957 7.68941 5.69431 8.96584L5.92731 9.10074C6.23326 9.27786 6.38623 9.36643 6.50978 9.48998C6.63333 9.61352 6.72189 9.7665 6.89902 10.0724Z"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
              <h3 className="text-white text-xs font-semibold leading-4 px-2">
                Send
              </h3>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
