import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [roomCount, setRoomCount] = useState(0)

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      // if (!messageList.some((message) => message.message === messageData.message)) {
      //   setMessageList((list) => [...list, messageData]);
      // }
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("user_count", (count) => {
      setUserCount(count);
    });
    socket.on("room_count", (count) => {
      setRoomCount(count);
    });
    socket.on("receive_message", (data) => {
      setMessageList((list) => {
        // Check if the message is already present in the messageList
        const messageExists = list.some((message) => {
          return (
            message.room === data.room &&
            message.author === data.author &&
            message.message === data.message &&
            message.time === data.time
          );
        });
  
        // Add the message to the messageList only if it doesn't already exist
        if (!messageExists) {
          return [...list, data];
        } else {
          return list;
        }
      });
    });
  }, [socket]);
  

  // useEffect(() => {
  //   socket.on("receive_message", (data) => {
  //     setMessageList((list) => [...list, data]);
  //   });
  // }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat - {roomCount} / {userCount}</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => {
            return (
              <div
              key={index}
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;