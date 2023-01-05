import * as React from 'react';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import Box from '@mui/material/Box';
import { Button, Card, CardActions, CardContent, FormControl, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles'
import logo from "../../../assets/logo.png";
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/visibility';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { api } from '../../../lib/axios';
import Toast from '../../../components/Toast';
import { AuthContext } from '../../../context/AuthContext';

const useStyles = makeStyles((theme) => ({
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

export default function Profile() {
    const classes = useStyles();
    const context = React.useContext(AuthContext);
    const { register, handleSubmit } = useForm();
    const [showPassword, setShowPassword] = React.useState(Boolean);

    const [user, setUser] = React.useState({} as any);
    const [msg, setMsg] = React.useState<string>("");
    const [typeToast, setTypeToast] = React.useState<string>("");
    const [openToast, setOpenToast] = React.useState(false);


    function handleClickShowPassword() {
        !showPassword ? setShowPassword(true) : setShowPassword(false)
    }

    function handleMouseDownPassword(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
    }

    // async function getData() {
    //     try {
    //         const response = await api.get('/users/' + context.user!.id);
    //         setUser(response.data.user[0]);
    //         console.log('user:  ', user); 
    //     } catch (error) { 
    //         setMsg("Não foi possível carregar os dados");
    //         setTypeToast("error"); 
    //         setOpenToast(true);
    //     }
    // }

    async function updateUser(data: any) {
        try {
            const response = await api.put('/users/' + context.user!.id, {
                email: data.email,
                password: data.password,
                name: data.name
            });
            console.log('response: ', response);
        } catch (error) {
            setMsg("Não foi possível carregar os dados");
            setTypeToast("error");
            setOpenToast(true);
        }
    }

    function changeValue(event: any) {
        setUser({
            [event.target.name]: event.target.value
        })
    }

    React.useEffect(() => { 
        // if(context.user != null) {
        //     getData();
        // }
    }, [context]) 

    return (
        <Box>
            <Header />
            <Toast msg={msg} duration={3000} type={typeToast} openToast={openToast} setOpenToast={setOpenToast} />

            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}>
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
                            {/* <Button variant="contained" component="label"  sx={{ margin: 2,
                                display: 'flex',
                                background: '#00824a',
                                '&:hover': {
                                    background: '#05b96b',
                                },
                            }}>
                                Trocar foto
                            </Button> */}

                            <Grid container spacing={2}>
                                <Grid item lg={12}>
                                    <TextField id="email" label="Email do usuário"
                                        {...register('email')}
                                        value={user.email}
                                        onChange={(e) => changeValue(e)}
                                        className={classes.textFieldFocused}
                                        variant="standard" sx={{
                                            width: '100%'
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton>
                                                        <EmailIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }} 
                                    />
                                </Grid>
                                <Grid item lg={12}>
                                    <TextField id="user" label="Nome usuário"
                                        {...register('name')}
                                        className={classes.textFieldFocused}
                                        variant="standard" sx={{
                                            width: '100%'
                                        }}
                                        value={user.name}
                                        onChange={(e) => changeValue(e)}
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
                                    <TextField id="password" label="Senha"
                                        variant="standard" sx={{
                                            width: '100%'
                                        }}
                                        {...register('password')}
                                        className={classes.textFieldFocused}
                                        value={user.password}
                                        onChange={(e) => changeValue(e)}
                                        type={showPassword ? 'text' : 'password'}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'center' }}>
                            <Button size="medium" variant='contained' className={classes.button} type="submit" onClick={handleSubmit(updateUser)}>Salvar</Button>
                        </CardActions>
                    </FormControl>
                </Card>
            </Box>
            <Footer />
        </Box>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { ['jumbo-token']: token } = parseCookies(ctx);

    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return {
        props: {}
    }
}