import * as React from 'react';
import Image from 'next/image';
import { parseCookies } from 'nookies';
import { api } from '../../../lib/axios';
import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import Toast from '../../../components/Toast';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import ProductDialog from '../../../components/products/ProductDialog';
import ModalUpload from '../../../components/ModalUpload';

import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';

import { IconButton, Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

type typeProduct = {
    id: number,
    urlImg: string,
}

export default function Products() {
    const [product, setProduct] = useState({});
    const [products, setProducts] = useState([])
    const [modalOpen, setModalOpen] = useState(false);
    const [modalUpload, setModalUpload] = useState(false);

    const [msg, setMsg] = useState<string>("")
    const [typeToast, setTypeToast] = useState<string>("")
    const [openToast, setOpenToast] = useState(false)

    const [productImg, setProductImg] = useState("");
    const [productId, setProductId] = useState<string>("");

    async function getProducts() {
        try {
            const response = await api.get('/products');
            const listProducts = response.data.products;
            console.log(response.data.products)
            setProducts(listProducts);
        } catch (error) {
            setMsg("Não foi possível carregar");
            setTypeToast("error");
            setOpenToast(true);
        }
    }

    function editProduct(data: any) {
        setProduct(data);
        setProductId(data.id);
        setModalOpen(true);
    }

    async function deleteProduct(item: typeProduct) {
        try {
            await api.delete('/products/' + item.id);
            setMsg("Produto deletado com sucesso");
            setTypeToast("success");
            setOpenToast(true);
            getProducts();
        } catch (error) {
            setMsg("Erro ao deletar produto");
            setTypeToast("error");
            setOpenToast(true);
        }
    }

    function photoProduct(item: typeProduct) {
        setProduct(item);
        setProductImg(item.urlImg);
        setModalUpload(true);
    }

    function transformPromotion(produto: any) {
        if (produto.promotion === true) return 'Sim'
        else return 'Não'
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', align: 'left', width: 205 },
        { field: 'title', headerName: 'Nome', align: 'left', width: 205 },
        { field: 'price', headerName: 'Preço', align: 'left', width: 205 },
        {
            field: 'promotion', headerName: 'Promoção', align: 'left', width: 205,
            renderCell(params) {
                return (<>{transformPromotion(params.row)}</>)
            },
        },
        {
            field: 'urlImg', headerName: 'Imagem', align: 'left', width: 205,
            renderCell: (params) => {
                return (
                    params.row.urlImg == "" ? <CloseIcon /> : (<><Image
                        src={`${params.row.urlImg}`}
                        width={50}
                        height={40}
                        alt={params.row.urlImg}
                        loading="lazy"
                    /></>)

                );
            },
        },
        {
            field: 'description',
            headerName: 'Descrição', align: 'left', width: 205
        },
        {
            field: 'actions',
            headerName: 'Ações', align: 'left', width: 300,
            renderCell: (params) => {
                return (
                    <Box>
                        <IconButton color="primary" aria-label="editar" component="label" onClick={() => editProduct(params.row)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton color="error" aria-label="deletar" component="label" onClick={() => deleteProduct(params.row)}>
                            <DeleteIcon />
                        </IconButton>
                        <IconButton color="inherit" aria-label="upload" component="label" onClick={() => photoProduct(params.row)}>
                            <ArchiveIcon />
                        </IconButton>
                    </Box>

                );
            },
        },
    ];

    React.useEffect(() => {
        getProducts();
    }, [productId])

    return (
        <Box>
            <Header />
            <Toast msg={msg} duration={3000} type={typeToast} openToast={openToast} setOpenToast={setOpenToast} />
            <ModalUpload modalUpload={modalUpload} setModalUpload={setModalUpload} product={product} setProduct={setProduct} productImg={productImg} setProductImg />
            <Box p={15}>
                <DataGrid
                    sx={{ minWidth: 650, minHeight: 371, mt: 15 }}
                    rows={products}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[10]}
                />
            </Box>
            <ProductDialog product={product} isOpen={modalOpen} setIsOpen={setModalOpen} setProduct={setProduct} productId={productId} setProductId={setProductId} />
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