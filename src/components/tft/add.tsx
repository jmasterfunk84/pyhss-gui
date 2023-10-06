import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';

import {SelectField, SaveButtons, InputField} from '@components';
import i18n from '@app/utils/i18n';

import {TftApi} from '../../services/pyhss';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const TftAddItem = (props: {
  open: boolean,
  handleClose: ReturnType<typeof any>,
  data: ReturnType<typeof Object>,
  edit: boolean
}) => {
  const { open, handleClose, data, edit } = props;
  const [state, setState] = React.useState(data);

  React.useEffect(() => {
    setState(data);
  }, [data])

  const handleChange = (name: string, value: string) => {
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (edit) {
      TftApi.update(data.tft_id, state).then((data) => {
        handleLocalClose();
      });
    } else {
      TftApi.create(state).then((data) => {
        handleLocalClose();
      });
    }
  }

  const handleLocalClose = () => {
    handleClose();
  }

  return (
    <React.Fragment>
     <Modal
       open={open}
       onClose={handleLocalClose}
       aria-labelledby="modal-modal-title"
       aria-describedby="modal-modal-description"
     >
       <Box sx={style}>
        <h3>{(edit?i18n.t('generic.edit'):i18n.t('generic.add'))}</h3>
        <Box
          component="form"
          noValidate
          autoComplete="off"
        >
          <Grid container rowSpacing={1} spacing={1}>
            <Grid item xs={3}>
              <InputField
                required
                label="Group"
                id="tft_group_id"
                onChange={handleChange}
                value={state.tft_group_id}
              >TFT Group</InputField>
            </Grid>
            <Grid item xs={9}>
              <InputField
                required
                label="Rule"
                id="tft_string"
                onChange={handleChange}
                value={state.tft_string}
              >Rule</InputField>
            </Grid>
            <Grid item xs={12}>
              <SelectField
                value={state.direction}
                onChange={handleChange}
                id="direction"
                label="Direction"
                helper="Defines traffic direction"
              >
                <MenuItem value={0}>Unspecified</MenuItem>
                <MenuItem value={1}>Downlink</MenuItem>
                <MenuItem value={2}>Uplink</MenuItem>
                <MenuItem value={3}>Bidirectional</MenuItem>
              </SelectField>
            </Grid>
          </Grid>
         </Box>
        <SaveButtons onClickClose={handleLocalClose} onClickSave={handleSave} />
       </Box>
     </Modal>

    </React.Fragment>
  );
}

export default TftAddItem;
