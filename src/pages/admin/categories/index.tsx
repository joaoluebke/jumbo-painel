import * as React from 'react';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Grid, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DialogCategory from '../../../components/categories/DialogCategory';
import DialogSubCategory from '../../../components/categories/DialogSubCategory';
import AddIcon from '@mui/icons-material/Add';
import { api } from '../../../lib/axios';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import Toast from '../../../components/Toast';

export default function Categories() {
    const [categories, setCategories] = React.useState([])
    const [modalOpen, setModalOpen] = React.useState(false);
    const [modalSubcategory, setModalSubcategory] = React.useState(false);
    const [category, setCategory] = React.useState({});
    const [msg, setMsg] = React.useState<string>("")
    const [typeToast, setTypeToast] = React.useState<string>("")
    const [openToast, setOpenToast] = React.useState(false)
    const [categoryId, setCategoryId] = React.useState("");

    async function getCategories() {
        try {
            const response = await api.get('/categories');
            const listCategories = response.data.categories;
            setCategories(listCategories);
        } catch (error) {
            console.log('response: ', error)
        }
    }

    async function deleteItem(id: string) {
        try {
            const response = await api.delete('/categories/' + id);
            setMsg("Categoria deletada com sucesso");
            setTypeToast("success");
            setOpenToast(true);
            getCategories();
        } catch (error) {
            setMsg("Erro ao deletar categoria");
            setTypeToast("error");
            setOpenToast(true);
        }
    }

    function editCategory(item: any) {
        setCategoryId(item.id);
        setCategory(item);
        setModalOpen(true);
    }

    function openModalSubCategory(item: any) {
        setCategory(item);
        setCategoryId(item.id);
        setModalSubcategory(true);
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', align: 'left', width: 440 },
        { field: 'title', headerName: 'Nome', align: 'left', width: 440 },
        {
            field: 'actions',
            headerName: 'Ações', align: 'left', width: 440,
            renderCell: (params: any) => {
                return (
                    <Box>
                        <IconButton color="primary" aria-label="upload picture" component="label" onClick={() => editCategory(params.row)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton color="error" aria-label="upload picture" component="label" onClick={() => deleteItem(params.id)}>
                            <DeleteIcon />
                        </IconButton>
                        <IconButton color="success" aria-label="upload picture" component="label" onClick={() => openModalSubCategory(params.row)}>
                            <AddIcon />
                        </IconButton>
                    </Box>

                );
            },
        },
    ];

    React.useEffect(() => {
        getCategories();
    }, [category]) 

    return ( 
        <Box >
            <Header />
            <Toast msg={msg} duration={3000} type={typeToast} openToast={openToast} setOpenToast={setOpenToast} categoryId={categoryId}  />

            <Box p={15}>
                <DialogSubCategory category={category} modalSubcategory={modalSubcategory} setModalSubcategory={setModalSubcategory} setCategory={setCategory} categoryId={categoryId} />
                <DataGrid
                    sx={{ minWidth: 650, minHeight: 371, mt: 10 }}
                    rows={categories}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                />
            </Box>
            <DialogCategory category={category} isOpen={modalOpen} setIsOpen={setModalOpen} setCategory={setCategory} categoryId={categoryId} setCategoryId={setCategoryId}/>
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