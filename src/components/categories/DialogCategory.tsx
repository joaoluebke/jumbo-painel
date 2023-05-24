import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Fab, Grid, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { makeStyles } from '@material-ui/core/styles'
import { Box } from '@mui/system';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/axios';
import Toast from '../Toast';

const useStyles = makeStyles(() => ({
    button: {
        background: '#00824a',
        '&:hover': {
            background: '#05b96b',
        }
    },
    dialog: {
        width: '600px',
        height: '400px'
    },
    logo: {
        padding: '1rem',
    },
    textFieldFocused: {
        '& label.Mui-focused': {
            color: '#00824a',
        },
        '& .MuiInput-underline:after': {
            borderColor: '#00824a',
        },
    }
}));


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogCategory({ isOpen, setIsOpen, category, setCategory, categoryId, setCategoryId, ruleId }: any) {
    const classes = useStyles();
    const { register, handleSubmit, reset } = useForm();
    const [msg, setMsg] = React.useState<string>("")
    const [typeToast, setTypeToast] = React.useState<string>("")
    const [openToast, setOpenToast] = React.useState(false)

    const handleClickOpen = () => {
        setCategory({ title: '' });
        setIsOpen(true);
    };

    const handleClose = () => {
        setCategoryId("");
        setIsOpen(false);
    };

    async function createCategory(data: any) {
        if (ruleId !== 1) {
            setMsg("Usuário sem permissão");
            setTypeToast("error");
            setOpenToast(true);
            return;
        }

        let response;
        if (categoryId) {
            response = api.put('/categories/' + categoryId, { title: data.title });
        } else {
            response = api.post('/categories', { title: data.title });
        }
        try {
            const res = await response;
            setCategory(res.data as any);
            setMsg("Categoria cadastrada com sucesso");
            setTypeToast("success");
            setOpenToast(true);
            setCategoryId("");
            handleClose();
        } catch (error) {
            setMsg("Erro ao editar categoria");
            setTypeToast("error");
            setOpenToast(true);
        }
    }

    function changeValue(event: any) {
        setCategory({
            [event.target.name]: event.target.value
        })
    }

    return (
        <div>
            <Toast msg={msg} duration={3000} type={typeToast} openToast={openToast} setOpenToast={setOpenToast} />
            <Fab color="primary" aria-label="add" onClick={handleClickOpen} sx={{
                position: 'absolute',
                width: '50px',
                height: '50px',
                background: '#00824a',
                '&:hover': {
                    background: '#05b96b',
                },
                right: '25px',
                bottom: '50px'
            }}>
                <AddIcon />
            </Fab>
            <Dialog
                open={isOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <Box>
                    <DialogTitle>Cadastrar Categoria</DialogTitle>
                    <DialogContent >
                        <Grid container spacing={2} sx={{
                            marginTop: '10px'
                        }}>
                            <Grid item lg={12}>
                                <TextField id="title" label="Nome"
                                    value={category.title ? category.title : ""}
                                    className={classes.textFieldFocused}
                                    {...register('title')}
                                    onChange={(e) => { changeValue(e) }}
                                    variant="standard" sx={{
                                        width: '100%'
                                    }} InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant='contained' color="error">Fechar</Button>
                        <Button size="medium" variant='contained' className={classes.button} type="submit" onClick={handleSubmit(createCategory)}>Cadastrar</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </div>
    );
}
