import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import PropTypes from "prop-types";

const CustomTabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
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
