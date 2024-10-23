import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Client } from "@stomp/stompjs";

const WebSocket = ({ roomId, setWsClient, receiveImg, receiveMessage }) => {
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const newClient = new Client({
      brokerURL: "ws://localhost:8080/ws-stomp",
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
    setWsClient(newClient);

    // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
    return () => {
      if (newClient) {
        newClient.deactivate(); // 연결 해제
      }
    };
  }, []);

  return <div className="hidden"></div>;
};

export default WebSocket;
