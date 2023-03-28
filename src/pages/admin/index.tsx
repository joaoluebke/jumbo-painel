import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { makeStyles } from '@material-ui/core/styles'

import { Card, CardActions, CardContent, Button, Typography } from '@mui/material';
import { api } from '../../lib/axios';

const useStyles = makeStyles((theme) => ({
    main: {
        width: '100%',
        height: '100vh',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#05b96b'
    }
}));

export default function Index() {
    const classes = useStyles();
    const [qtdProdutos, setQtdProdutos] = useState(Number);

    async function getQtdProducts() {
        try {
            const response = await api.get('/products');
            const listProducts = response.data.products;
            setQtdProdutos(listProducts.length);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getQtdProducts();
    })

    return (
        <Box>
            <Header />
            <Grid container spacing={2} p={15} className={classes.main}>
                <Grid item>
                    <Card sx={{ minWidth: 275 }} className={classes.card}>
                        <CardContent>
                            <Typography variant="h5" component="div" sx={{
                                color: 'white'
                            }}> 
                                Produtos Cadastrados
                            </Typography>
                            <Typography variant="subtitle1" mt={1.5} color="text.secondary"
                                sx={{
                                    color: 'white'
                                }}>
                                {qtdProdutos}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Footer />
        </Box>
    );
} 