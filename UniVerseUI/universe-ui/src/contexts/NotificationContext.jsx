import { createContext, useState } from "react"
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [stompClient, setStompClient] = useState(null);

  const connectNotifications = (username) =>{
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);

    client.connect({}, (frame) => {
      console.log('Connected: ' + frame);
      setStompClient(client);
      client.subscribe('/topic/publicNotification', onReceived);
      client.subscribe(`/user/${username}/queue/notification`, onReceived);
    });
  }

  const disconnectNotifications = () =>{
    if(stompClient){
      stompClient.disconnect();
      setStompClient(null);
    }
  }

  const onReceived = (notification) => {
    console.log('Received: ' + notification);
    setNotifications(prevNotifications => [
      ...prevNotifications, JSON.parse(notification.body)
    ]);
  }

  const sendNotification = (message, type, source, recipientName) => {
    if (stompClient && stompClient.connected) {
      stompClient.send('/app/sendNotification', {}, JSON.stringify({ message, type, source, recipientName }));
    }
  };

  const sendPrivateNotification = (message, type, source, recipientName) => {
    if (stompClient && stompClient.connected) {
      stompClient.send('/app/sendUserNotification', {}, JSON.stringify({ message, type, source, recipientName }));
    }
  };

  const contextValue = {
    notifications, 
    sendNotification,
    sendPrivateNotification,
    connectNotifications,
    disconnectNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
