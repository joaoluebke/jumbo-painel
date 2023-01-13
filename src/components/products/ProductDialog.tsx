import * as React from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../../lib/axios';
import Toast from '../Toast';

import { Box } from '@mui/system';
import Slide from '@mui/material/Slide';
import AddIcon from '@mui/icons-material/Add';
import { makeStyles } from '@material-ui/core/styles'
import { TransitionProps } from '@mui/material/transitions';
import {
  Fab, FormControl, Grid, InputLabel, MenuItem, Select, TextField, SelectChangeEvent,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch
} from '@mui/material';


const useStyles = makeStyles((theme) => ({
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
    "& .MuiOutlinedInput-root ": {
      "&.Mui-focused fieldset": {
        borderColor: "#00824a",
        borderWidth: "2px"
      },
      '& .MuiInput-underline:after': {
        borderColor: '#00824a',
      },
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

type subCategoryType = {
  id: number,
  title: string
}

export default function ProductDialog({ isOpen, setIsOpen, product, setProduct, productId }: any) {
  const classes = useStyles();
  const { register, handleSubmit } = useForm();
  const [subCategoryList, setSubCategoryList] = React.useState([]);
  const [subCategory, setSubCategory] = React.useState("");

  const [promotion, setPromotion] = React.useState(Boolean);
  const [msg, setMsg] = React.useState<string>("")
  const [typeToast, setTypeToast] = React.useState<string>("")
  const [openToast, setOpenToast] = React.useState(false)

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };


  const handleChange = (event: SelectChangeEvent) => {
    setSubCategory(event.target.value as string);
  };

  async function getCategoryList() {
    try {
      const response = await api.get('/subcategories');
      const array = response.data.subcategories;
      setSubCategoryList(array);
    } catch (error) {
      console.log(error)
    }
  }

  function selectPromotion() {
    if (promotion === false) {
      return true;
    } else {
      return false;
    }
  }

  function transformPromotion(value: string) {
    if (value === 'false') {
      return false;
    } else {
      return true;
    }
  }

  const handleChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPromotion(event.target.checked);
  }

  async function createProduct(data: any) {
    let response;
    if (productId) {
      response = api.put(`/products/${productId}`, {
        title: data.title || product.title,
        description: data.description || product.description,
        promotion: transformPromotion(data.promotion) || transformPromotion(product.promotion),
        price: parseInt(data.price) || parseInt(product.price),
        promotionPrice: parseInt(data.promotionPrice) || parseInt(product.promotionPrice),
        subCategoryId: data.subCategoryId || product.subCategoryId,
      });

    } else {
      response = api.post('/products', {
        title: data.title,
        description: data.description,
        promotion: transformPromotion(data.promotion),
        price: parseInt(data.price),
        promotionPrice: parseInt(data.promotionPrice),
        subCategoryId: data.subCategoryId,
        urlImg: "",
      });

    }

    try {
      const res = await response;
      setMsg("Produto salvo com sucesso" + res.data.title);
      setTypeToast("success");
      setOpenToast(true);
      setProduct({});
      handleClose();
    } catch (error) {
      setMsg("Erro ao salvar produto");
      setTypeToast("error");
      setOpenToast(true);
    }
  }

  function changeValue(event: any) {
    setProduct({
      ...product,
      [event.target.name]: event.target.value
    })
  }

  React.useEffect(() => {
    getCategoryList();
    if (productId) {
      setSubCategory(product.subCategoryId);
      setPromotion(product.promotion);
    }
  }, [productId])

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
        <Box sx={{
        }}>

          <DialogTitle>Cadastrar Produto</DialogTitle>
          <FormControl>
            <DialogContent >
              <Grid container spacing={2} sx={{
                marginTop: '10px'
              }}>
                <Grid item lg={6}>
                  <TextField id="title" label="Nome"
                    variant="standard"
                    {...register('title')}
                    value={product.title}
                    className={classes.textFieldFocused}
                    onChange={(e) => { changeValue(e) }}
                    sx={{
                      width: '100%'
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item lg={6}>
                  <TextField id="price" label="Preço"
                    variant="standard"
                    {...register('price')}
                    value={product.price}
                    type="number"
                    onChange={(e) => { changeValue(e) }}
                    className={classes.textFieldFocused}
                    sx={{
                      width: '100%'
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item lg={6}>
                  <TextField id="promotionPrice" label="Preço promocional"
                    {...register('promotionPrice')}
                    className={classes.textFieldFocused}
                    value={product.promotionPrice}
                    variant="standard" sx={{
                      width: '100%'
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item lg={6}>
                  <FormControl sx={{
                    width: '100%'
                  }}>
                    <InputLabel id="subcategory-label"
                      shrink={true}
                    >Categoria</InputLabel>
                    <Select
                      {...register('subCategoryId')}
                      id="subCategoryId"
                      variant="standard"
                      value={subCategory}
                      labelId="subcategory-label"
                      onChange={(e) => { handleChange(e) }}
                      className={classes.textFieldFocused}
                      fullWidth
                    >
                      {
                        subCategoryList.map((subcategory: subCategoryType) => {
                          return (
                            <MenuItem key={subcategory.id} value={subcategory.id}>{subcategory.title}</MenuItem>
                          )
                        })
                      }
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item lg={12}>
                  <FormControlLabel control={
                    <Switch checked={promotion} value={promotion} {...register('promotion')} onChange={(e) => { changeValue(e), handleChangeSwitch(e) }} />
                  } label="Promoção" />
                </Grid>
                <Grid item lg={12}>
                  <TextField
                    {...register('description')}
                    id="description"
                    label="Descrição"
                    variant="standard"
                    onChange={(e) => { changeValue(e) }}
                    value={product.description}
                    className={classes.textFieldFocused}
                    rows={4}
                    multiline
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
          </FormControl>
          <DialogActions>
            <Button onClick={handleClose} variant='contained' color="error">Fechar</Button>
            <Button size="medium" variant='contained' className={classes.button} type="submit" onClick={handleSubmit(createProduct)}>Salvar</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div >
  );
}
