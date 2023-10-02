/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
  ContentHeader,
  AucAddItem,
  SubscriberAddItem,
  ImsSubscriberAddItem
} from '@components';
import {
  AucApi,
  SubscriberApi,
  ImsSubscriberApi,
} from "../services/pyhss";

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const steps = ['Add AUC', 'Add Subscriber', 'Add IMS Subscriber', 'Validate'];
const subscriberTemplate = {
  "imsi": "",
  "enabled": true,
  "auc_id": 0,
  "default_apn": 1,
  "apn_list": "1",
  "msisdn": "",
  "ue_ambr_dl": 1566720,
  "ue_ambr_ul": 1566720,
  "nam": 0,
  "subscribed_rau_tau_timer": 600,
  "serving_mme": "",
  "serving_mme_realm": "",
  "serving_mme_peer": ""
}
const aucTemplate = {
  "ki": "",
  "opc": "",
  "amf": "",
  "iccid": "",
  "imsi": "",
  "batch_name": "",
  "sim_vendor": "",
  "esim": false,
  "lpa": "",
  "pin1": "",
  "pin2": "",
  "puk1": "",
  "puk2": "",
  "kid": "",
  "psk": "",
  "des": "",
  "adm1": "",
  "misc1": "",
  "misc2": "",
  "misc3": "",
  "misc4": ""
}
const imsSubscriberTemplate = {
  "msisdn": "",
  "msisdn_list": "",
  "imsi": "",
  "ifc_path": "default_ifc.xml",
  "sh_profile": "default_sh_user_data.xml",
  "pcscf": "",
  "pcscf_realm": "",
  "pcscf_peer": "",
  "scscf": "",
  "scscf_realm": "",
  "scscf_peer": ""
}

const AddWizard = () => {
  const [auc, setAuc] = React.useState(aucTemplate);
  const [subscriber, setSubscriber] = React.useState(subscriberTemplate);
  const [imsSubscriber, setImsSubscriber] = React.useState(imsSubscriberTemplate);
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [aucState, setAucState] = React.useState(false);
  const [subscriberState, setSubscriberState] = React.useState(false);
  const [imsSubscriberState, setImsSubscriberState] = React.useState(false);

  const isStepOptional = (step: number) => {
    return step === 2;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep === 0) {
      setSubscriber((prev) => ({
        ...prev,['imsi']: auc.imsi
      }));
      setImsSubscriber((prev) => ({
        ...prev,['imsi']: auc.imsi
      }));
    }
    if (activeStep === 1) {
      setImsSubscriber((prev) => ({
        ...prev,['msisdn']: subscriber.msisdn,['msisdn_list']: subscriber.msisdn 
      }));
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);

    if (activeStep === steps.length - 1) {
      handleAdding();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
    setAuc(aucTemplate);
    setSubscriber(subscriberTemplate);
    setImsSubscriber(imsSubscriberTemplate);
  };

  const handleChangeAuc = e => {
    const { name, value } = e.target;
    setAuc(prevState => ({
        ...prevState,
        [name]: value
    }));
  };
  const handleChangeSubscriber = e => {
    const { name, value } = e.target;
    setSubscriber(prevState => ({
        ...prevState,
        [name]: value
    }));
  };
  const handleChangeImsSubscriber = e => {
    const { name, value } = e.target;
    setImsSubscriber(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  const handleAdding = () => {
    console.log("Start Adding");
    AucApi.create(auc).then((data) => {
      setAucState(true);
      const subscriberData = {
        "imsi": subscriber.imsi,
        "enabled": subscriber.enabled,
        "auc_id": data.data.auc_id,
        "default_apn": subscriber.default_apn,
        "apn_list": subscriber.apn_list,
        "msisdn": subscriber.msisdn, 
        "ue_ambr_dl": subscriber.ue_ambr_dl,
        "ue_ambr_ul": subscriber.ue_ambr_ul,
        "nam": subscriber.nam,
        "subscribed_rau_tau_timer": subscriber.subscribed_rau_tau_timer,
      }
      console.log(data);
      SubscriberApi.create(subscriberData).then((data) => {
        setSubscriberState(true);
        console.log(data);
      }) 
      ImsSubscriberApi.create(imsSubscriber).then((data) => {
        setImsSubscriberState(true);
        console.log(data);
      }) 
    });
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            <ul>
              <li>AUC {(!aucState)?<CircularProgress />:'Done'}</li>
              <li>Subscriber {(!subscriberState)?<CircularProgress />:'Done'}</li>
              <li>IMS Subscriber {(!imsSubscriberState)?<CircularProgress />:'Done'}</li>
            </ul>
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            {aucState && subscriberState && imsSubscriberState && <Button onClick={handleReset}>Reset</Button>}
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          {activeStep === 0 && <AucAddItem forceKeys={true} edit={false} state={auc} onChange={handleChangeAuc} />} 
          {activeStep === 1 && <SubscriberAddItem state={subscriber} onChange={handleChangeSubscriber} />} 
          {activeStep === 2 && <ImsSubscriberAddItem state={imsSubscriber} onChange={handleChangeImsSubscriber} />} 
          {activeStep === 3 && <span>Finish</span>} 
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

export default AddWizard;
