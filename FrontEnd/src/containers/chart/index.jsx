import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";

import { Container, Tabs, Tab, Typography, Box } from "@mui/material";

import ChartBoy from "./boytab";
import ChartGirl from "./girltab";
import { getIdolMemberInfo, getIdolRank } from "../../api/idolinfo";

const CustomTabPanel = (props) => {
  const { children, value, index, ...other } = props;

  const now = new Date();
  now.setDate(now.getDate() - 1);

  const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

  return (
    <div>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        {...other}
      >
        <p id="chart-time">{formattedDate.toLocaleString()} 기준</p>
        {value === index && (
          <Box sx={{ p: 1 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    </div>
  );
};

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const ChartTab = () => {
  const [value, setValue] = React.useState(0);

  const [isNull, setIsNull] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [rankBoy, setRankBoy] = useState([]);
  const [rankGirl, setRankGirl] = useState([]);

  const getIdol = (idolMemberId) => {
    getIdolMemberInfo(
      idolMemberId,
      (data) => {
        return data.data;
      },
      (error) => {
        console.error("Error get idol:", error);
      }
    );
  };

  useEffect(() => {
    const newRankGirl = [];
    const newRankBoy = [];

    getIdolRank(
      (data) => {
        console.log(data.data);
        const order = ["first", "second", "third"];

        for (const key in data.data) {
          for (const prefix of order) {
            if (key.includes(`${prefix}FemaleIdolId`)) {
              getIdolMemberInfo(
                data.data[key],
                (data) => {
                  newRankGirl.push(data.data);
                  if (newRankGirl.length == 3) {
                    setRankGirl(newRankGirl);
                  }
                },
                (error) => {
                  console.error("Error get idol:", error);
                }
              );
            } else if (key.includes(`${prefix}MaleIdolId`)) {
              getIdolMemberInfo(
                data.data[key],
                (data) => {
                  newRankBoy.push(data.data);
                  if (newRankBoy.length == 3) {
                    setRankBoy(newRankBoy);
                  }
                },
                (error) => {
                  console.error("Error get idol:", error);
                }
              );
            }
          }
        }
      },
      (error) => {
        console.log("Error get Idol Rank : ", error);
        // 데이터 없을 때 그냥 에러 떠버림
        setIsNull(true);
      }
    );
  }, []);

  return (
    <Container sx={{ width: "100%" }}>
      <h2 className="main-title">오늘의 포포차트 🥇</h2>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab
            label="남자아이돌"
            {...a11yProps(0)}
            sx={{ fontWeight: value === 0 ? 600 : 400 }}
          />
          <Tab
            label="여자아이돌"
            {...a11yProps(1)}
            sx={{ fontWeight: value === 1 ? 600 : 400 }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <ChartBoy isNull={isNull} rankBoy={rankBoy} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ChartGirl isNull={isNull} rankGirl={rankGirl} />
      </CustomTabPanel>
    </Container>
  );
};
export default ChartTab;
