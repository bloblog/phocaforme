import "./index.css";
import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import ChartBoy from "./boytab";
import ChartGirl from "./girltab";

import { getIdolMemberInfo, getIdolRank } from "@/api/idolinfo";
import { CustomTabs, CustomTabPanel } from "@/components/Tab";

const ChartTab = () => {
  const [value, setValue] = useState(0);
  const [isNull, setIsNull] = useState(false);
  const [rankBoy, setRankBoy] = useState([]);
  const [rankGirl, setRankGirl] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const newRankGirl = [null, null, null];
    const newRankBoy = [null, null, null];

    const fetchRankData = async () => {
      getIdolRank(
        async (data) => {
          const order = [
            { prefix: "first", idx: 1 },
            { prefix: "second", idx: 2 },
            { prefix: "third", idx: 3 },
          ];

          const girlPromises = [];
          const boyPromises = [];

          // Promise로 콜백을 감싸는 함수
          const getIdolInfo = (idolId) => {
            return new Promise((resolve, reject) => {
              getIdolMemberInfo(
                idolId,
                (data) => resolve(data.data),
                (error) => reject(error)
              );
            });
          };

          for (const key in data.data) {
            for (const { prefix, idx } of order) {
              if (key.includes(`${prefix}FemaleIdolId`)) {
                girlPromises.push(
                  getIdolInfo(data.data[key]).then((idolData) => {
                    newRankGirl[idx - 1] = idolData;
                  })
                );
              } else if (key.includes(`${prefix}MaleIdolId`)) {
                boyPromises.push(
                  getIdolInfo(data.data[key]).then((idolData) => {
                    newRankBoy[idx - 1] = idolData;
                  })
                );
              }
            }
          }

          // 모든 비동기 작업이 완료되면 상태 업데이트
          await Promise.all([...girlPromises, ...boyPromises]);
          setRankGirl([...newRankGirl]);
          setRankBoy([...newRankBoy]);
        },
        (error) => {
          console.error("Error get Idol Rank : ", error);
          setIsNull(null);
        }
      );
    };

    fetchRankData();
  }, []);

  const now = new Date();
  now.setDate(now.getDate() - 1);

  const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

  return (
    <Container sx={{ width: "100%" }}>
      <h2 className="main-title">오늘의 포포차트 📊</h2>
      <CustomTabs
        value={value}
        handleChange={handleChange}
        labels={["남자아이돌", "여자아이돌"]}
      />
      <p id="chart-time">{formattedDate.toLocaleString()} 기준</p>

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
