import { Container } from "@mui/material";
import AlarmList from "@/containers/alarm/index";

const alarm = () => {
  return (
    <Container id="alarm-page">
      <AlarmList />
    </Container>
  );
};

export default alarm;
