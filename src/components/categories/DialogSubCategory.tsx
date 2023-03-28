import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import DeleteIcon from '@mui/icons-material/Delete';

import { TransitionProps } from '@mui/material/transitions';
import { Grid, IconButton, TextField, Typography } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles'
import { Box } from '@mui/system';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/axios';
import Toast from '../Toast';

type subCategoryList = {
    id: number,
    title: string,
}

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
    },
    btn_grid: {
        display: "flex",
        justifyContent: "end",
    },
    btn_subcategory: {
        background: '#00824a',
        '&:hover': {
            background: '#05b96b',
        }
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

export default function DialogSubCategory({ category, modalSubcategory, setModalSubcategory, setCategory, categoryId }: any) {
    const classes = useStyles();
    const [msg, setMsg] = useState<string>("");
    const { register, handleSubmit, reset } = useForm();
    const [title, setTitle] = useState<string>("");
    const [openToast, setOpenToast] = useState(false);
    const [typeToast, setTypeToast] = useState<string>("");
    const [subCategoryList, setSubCategoryList] = useState<[]>([]);

    const handleClose = () => {
        setModalSubcategory(false);
        setSubCategoryList([]);
        setCategory({});
        setTitle("");
    };

    async function createSubCategory(data: any) {
        try {
            await api.post('/subcategories', { title: data.title, categoryId: category.id });
            setMsg("Subcategoria salva com sucesso");
            setTypeToast("success");
            setOpenToast(true);
            reset({ title: '' })
            getSubCategoryList();
        } catch (error) {
            setMsg("Erro ao salvar Subcategoria");
            setTypeToast("error");
            setOpenToast(true);
        }
    }

    async function deleteItem(id: number) {
        try {
            await api.delete('/subcategories/' + id);
            setMsg("Subcategoria deletada com sucesso");
            setTypeToast("success");
            setOpenToast(true);
            getSubCategoryList();
        } catch (error) {
            setMsg("Erro ao deletar Subcategoria");
            setTypeToast("error");
            setOpenToast(true);
        }
    }

    const getSubCategoryList = useCallback(async () => {
        let arr = [];
        try {
            const response = await api.get('/category/' + categoryId + '/subcategories');
            arr = response.data.subcategory;
            setSubCategoryList(arr);
        } catch (error) {
            console.log(error);
        }
    }, [categoryId])


    useEffect(() => {
        if (categoryId) {
            getSubCategoryList();
        }
    }, [categoryId]);

    return (
        <div>
            <Toast msg={msg} duration={3000} type={typeToast} openToast={openToast} setOpenToast={setOpenToast} />
            <Dialog
                open={modalSubcategory}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                fullWidth
            >
                <Box>
                    <DialogTitle>Cadastrar Subcategoria - {category.title}</DialogTitle>
                    <DialogContent >
                        <Grid container spacing={2}>
                            {subCategoryList.map((subcategory: subCategoryList) => {
                                return (
                                    <Grid item lg={4} key={subcategory.id}>
                                        <Typography component={'div'} sx={{ border: 1, borderRadius: 2, marginTop: 2, borderColor: 'gray' }}>
                                            <Box sx={{ float: 'left', marginTop: 1, marginLeft: 2 }}>
                                                {subcategory.title}
                                            </Box>
                                            <IconButton sx={{
                                                display: 'flex',
                                                alignSelf: 'end'
                                            }} color="error" aria-label="upload picture" component="label" onClick={() => deleteItem(subcategory.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Typography>
                                    </Grid>
                                );
                            })}

                            <Grid item lg={12} mt={5}>
                                <TextField id="title" label="Nome"
                                    className={classes.textFieldFocused}
                                    {...register('title')}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    variant="standard" sx={{
                                        width: '100%'
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant='contained' color="error">Fechar</Button>
                        <Button size="medium" variant='contained' type="submit" className={classes.button} onClick={handleSubmit(createSubCategory)}>Salvar</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </div >
    );
}
