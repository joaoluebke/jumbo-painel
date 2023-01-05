import * as React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';

import logo from "../assets/logo.png";
import { AuthContext } from '../context/AuthContext';

import PersonIcon from '@mui/icons-material/Person';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FormControl, Grid, IconButton, InputAdornment, Card, CardActions, CardContent, Button, TextField, Typography } from '@mui/material';


const useStyles = makeStyles(() => ({
    card: {
        background: '#fff'
    },
    container: {
        background: '#00824a'
    },
    main: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    button: {
        background: '#DF2529',
        '&:hover': {
            background: '#d74649',
        }
    },
    logo: {
        padding: '1rem',
    },
    textFieldFocused: {
        '& label.Mui-focused': {
            color: '#00824a',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#00824a',
        },
    }
}));

export default function Home() {
    const classes = useStyles();
    const { register, handleSubmit } = useForm();
    const [showPassword, setShowPassword] = React.useState(Boolean);

    const { signIn } = React.useContext(AuthContext);

    function handleClickShowPassword() {
        !showPassword ? setShowPassword(true) : setShowPassword(false);
    }

    function handleMouseDownPassword(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
    }

    async function handleSignIn(data: any) {
        try {
            await signIn(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={classes.container}>
            <Head>
                <title>Login</title>
                <meta name="description" content="Login component" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={classes.main}>
                <Card sx={{ maxWidth: 375, minHeight: 250 }} >
                    <FormControl sx={{ width: '100%' }}>
                        <CardContent className={classes.card}>
                            <Typography sx={{ textAlign: 'center' }} variant="subtitle2" component="div" >
                                <Image alt="logotipo jumbo" src={logo}
                                    width={250}
                                    height={200}
                                    className={classes.logo}
                                />
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item lg={12}>
                                    <TextField id="standard" label="Email do usuário"
                                        {...register('email')}
                                        className={classes.textFieldFocused}
                                        variant="standard" sx={{
                                            width: '100%'
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton>
                                                        <PersonIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={12}>
                                    <TextField id="standard" label="Senha"
                                        variant="standard" sx={{
                                            width: '100%'
                                        }}
                                        {...register('password')}
                                        className={classes.textFieldFocused}
                                        type={showPassword ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                    >
                                                        {showPassword ? <VisibilityOff color='error'/> : <VisibilityOff/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'center' }}>
                            <Button size="medium" variant='contained' className={classes.button} type="submit" onClick={handleSubmit(handleSignIn)}>Entrar</Button>
                        </CardActions>
                    </FormControl>
                </Card>
            </main>
        </div >
    );
}
