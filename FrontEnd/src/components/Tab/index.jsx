import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import PropTypes from "prop-types";

const CustomTabPanel = ({ children, value, index, ...other }) => {
  const now = new Date();
  now.setDate(now.getDate() - 1);

  const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      <p id="chart-time">{formattedDate.toLocaleString()} 기준</p>
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
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

const CustomTabs = ({ value, handleChange, labels }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs value={value} onChange={handleChange}>
        {labels.map((label, index) => (
          <Tab
            key={index}
            label={label}
            {...a11yProps(index)}
            sx={{ fontWeight: value === index ? 600 : 400 }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

CustomTabs.propTypes = {
  value: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  labels: PropTypes.array.isRequired,
};

export { CustomTabs, CustomTabPanel };
