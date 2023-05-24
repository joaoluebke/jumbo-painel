import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@mui/material/Typography';
const useStyles = makeStyles(() => ({
    footer: {
        width: '100%',
        background: '#DF2529', 
        margin: 'auto',
        bottom: 0,
        position: 'fixed'  
    },
}));  
export default function Footer() {
    const classes = useStyles();
    return (
        <footer className={classes.footer}>
            <Typography sx={{ textAlign: 'center', color: '#fff', }} variant="subtitle1" component="div">
                Copyright © 2022 Zanecom - Todos direitos reservados 
            </Typography> 
        </footer>)
}