import { Autocomplete, Box, TextField } from "@mui/material";

const Dropdown = ({ disable, type, id, value, option, onChange, sx }) => {
  const isOptionEqualToValue = () => {
    if (type == "type") {
      return (option, value) => {
        if (!value) return false;
        return option === value;
      };
    }
    if (type == "group") {
      return (option, value) => {
        if (value == 0) return false;
        return option.idolGroupId == value.idolGroupId;
      };
    }
    if (type == "member") {
      return (option, value) => {
        if (!value) return false;
        return option.idolMemberId === value.idolMemberId;
      };
    }
  };

  const renderOptionFormat = (option) => {
    if (type == "type") {
      return option;
    }
    if (type == "group") {
      return `${option.idolGroupNameKr} (${option.idolGroupNameEng})`;
    }
    if (type == "member") {
      return option.idolName;
    }
  };

  const getOptionLabelFormat = (option) => {
    if (type == "type") {
      return option;
    }
    if (type == "group") {
      return `${option.idolGroupNameKr} (${option.idolGroupNameEng})`;
    }
    if (type == "member") {
      return option.idolName;
    }
  };

  return (
    <Autocomplete
      disabled={disable}
      style={sx}
      id={id}
      value={value ?? null}
      onChange={onChange}
      size="small"
      options={option}
      isOptionEqualToValue={isOptionEqualToValue}
      getOptionLabel={(option) => getOptionLabelFormat(option)}
      noOptionsText={"해당하는 값이 없습니다"}
      renderOption={(props, option) => {
        const { key, ...restProps } = props;
        return (
          <Box
            component="li"
            key={key}
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...restProps}
          >
            {renderOptionFormat(option)}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="선택하세요"
          fullWidth
          InputProps={{
            ...params.InputProps,
          }}
        />
        // 그룹 로고도 추가?
        // <TextField
        //     ~~
        //     InputProps={{
        //       ...params.InputProps,
        //       startAdornment: (
        //         <React.Fragment>
        //           {params.InputProps.startAdornment}
        //         </React.Fragment>
        //       ),
        //     }}
        //   />
      )}
    />
  );
};

export default Dropdown;
