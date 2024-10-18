import * as React from "react";
import { useState, useEffect } from "react";

import { Box, TextField, Autocomplete } from "@mui/material";
import { getIdolGroup } from "@/api/idolinfo";
import { useDispatch } from "react-redux";
import Dropdown from ".";

const GroupDropdown2 = ({ isModify, isProfile, defaultGroup, onChange }) => {
  const [groupItems, setGroupItems] = useState([]);
  const [value, setValue] = useState(null);

  useEffect(() => {
    getIdolGroup(
      (data) => {
        setGroupItems(data.data);
        if (defaultGroup) {
          const group = data.data.filter(
            (item) => item.idolGroupId === defaultGroup
          );
          setValue(group[0]);
        }
      },
      (error) => console.error("그룹 세팅 오류:", error)
    );
  }, [defaultGroup]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    // <Autocomplete
    //   disabled={isModify}
    //   value={value}
    //   onChange={handleChange}
    //   size="small"
    //   id="group-dropdown"
    //   options={groupItems}
    //   getOptionLabel={(option) =>
    //     `${option.idolGroupNameKr} (${option.idolGroupNameEng})`
    //   }
    //   isOptionEqualToValue={(option, value) =>
    //     option.idolGroupNameKr === value.idolGroupNameKr
    //   }
    //   sx={{
    //     width: isProfile ? "50vw" : "100%",
    //   }}
    //   noOptionsText="해당 그룹이 없습니다"
    //   renderOption={(props, option) => {
    //     const { key, ...restProps } = props;
    //     const { idolGroupId, idolGroupNameKr, idolGroupNameEng } = option;
    //     return (
    //       <Box
    //         component="li"
    //         key={idolGroupId}
    //         sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
    //         {...restProps}
    //       >
    //         {`${idolGroupNameKr} (${idolGroupNameEng})`}
    //       </Box>
    //     );
    //   }}
    //   renderInput={(params) => (
    //     <TextField
    //       {...params}
    //       variant="outlined"
    //       fullWidth
    //       placeholder="선택하세요"
    //       InputProps={{
    //         ...params.InputProps,
    //         startAdornment: (
    //           <React.Fragment>
    //             {params.InputProps.startAdornment}
    //           </React.Fragment>
    //         ),
    //       }}
    //     />
    //   )}
    // />
    <div>
      <Dropdown
        disable={isModify}
        type={"group"}
        id={"group-dropdown"}
        value={value}
        option={groupItems}
        onChange={handleChange}
      />
    </div>
  );
};

export default GroupDropdown2;
