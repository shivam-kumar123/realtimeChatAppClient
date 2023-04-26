import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Image from './Image'

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [roomCount, setRoomCount] = useState(0)
  // const [file, setFile] = useState()
  const [yourID, setYourID] = useState()
  
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

    if (socket.current) {
      socket.current.on("your_id", id => {
        setYourID(socket.id);
      });
    }

  }, [socket]);

  // const selectFile = (e) =>{
  //   setCurrentMessage(e.target.files[0].name)
  //   setFile(e.target.files[0])
  // }

  const sendMessage = async (e) => {
    e.preventDefault()
    // if(file){
    //   console.log("file: ",file);
    //   const messageObject = {
    //     id: yourID,
    //     room,
    //     type: "file",
    //     mimeType: file.type,
    //     fileName: file.name
    //   }
    //   setCurrentMessage("")
    //   setFile()
    //   console.log(`socket`,socket);
    //   // await socket.emit("send_message", messageObject)
    //   await socket.emit("send_message", messageObject)
    // }
    // else{
      if (currentMessage !== "") {
        const messageData = {
          id: yourID,
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
        setCurrentMessage("");
      }
    // }
  };

    const renderMessages = (currentMessage, index)=> {
    console.log(`currentMessage.body = ${currentMessage.body} and socket.id = ${socket.id}`)
    // if(currentMessage.type === "file"){
    //   const blob = new Blob([currentMessage.body], {type: currentMessage.type})
    //   if(currentMessage.id === yourID){
    //     return(
    //       <ScrollToBottom
    //         key={index}
    //       >
    //         <Image fileName={currentMessage.fileName} blob={blob}/>
    //       </ScrollToBottom>
    //     )
    //   }
    // }

    return (
      <div
        key={index}
        className="message"
        id={username === currentMessage.author ? "you" : "other"}
      >
        <div>
          <div className="message-content">
            <p>{currentMessage.message}</p>
          </div>
          <div className="message-meta">
            <p id="time">{currentMessage.time}</p>
            <p id="author">{currentMessage.author}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat - {roomCount} / {userCount}</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map(renderMessages)}
        </ScrollToBottom>
      </div>
      <form onSubmit={sendMessage}>
        <div className="chat-footer">
          <input
            type="text"
            value={currentMessage}
            placeholder="Hey..."
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
          />
          {/* <input 
            onChange={selectFile}
            type='file'
          /> */}
          <button 
            // onClick={sendMessage}
            >
            &#9658;
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;