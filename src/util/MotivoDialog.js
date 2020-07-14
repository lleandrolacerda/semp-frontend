import React, {useState} from 'react';
import { createStyles, withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const styles = (theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

const useStyles = makeStyles((theme) =>
  createStyles({
    fieldClass: {
        minWidth: '600px'
    }
  }),
);


const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function MotivoDialog(props) {
    
  const {open, setOpen, acao} = props;
  const [txt, setTxt] = useState('');

  const handleClose = () => {
    setOpen(false);
  };
  const handleClick = () => {
    acao(txt);
  };
  const handleChange=(e)=>{
      setTxt( e.target.value);
  }
  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth='md'>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Motivo da Reprovação
        </DialogTitle>
        <DialogContent dividers>
            <TextField
            id="outlined-multiline-static"
            multiline
            style = {{width: '600px'}}
            onChange={ handleChange}
            rows={10}
            variant="outlined"
            />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClick} color="primary" disabled={ txt.length === 0}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
