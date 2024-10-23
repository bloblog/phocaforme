import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WebSocket = ({ roomId, setWsClient, receiveImg, receiveMessage }) => {
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const newClient = new Client({
      //   brokerURL: new SockJS("https://localhost:8080/ws-stomp"),
      webSocketFactory: () => new SockJS("https://localhost:8080/ws-stomp"),
      connectHeaders: {
        Authorization: user.token,
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
    });

    newClient.onConnect = () => {
      newClient.subscribe("/sub/chat/room" + roomId, (message) => {
        const receive = JSON.parse(message.body);

        console.log(message);
        // alert(receive.imgCode);
        if (receive.imgCode !== null) {
          receiveImg(receive);
        } else {
          receiveMessage(receive);
        }
      });
    };

    newClient.activate();
    console.log("connect");
    setWsClient(newClient);
  }, []);

  return <div className="hidden"></div>;
};

export default WebSocket;
