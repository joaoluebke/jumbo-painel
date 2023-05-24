import * as React from 'react';
import Image from 'next/image';
import { parseCookies } from 'nookies';
import { api } from '../../../lib/axios';
import { GetServerSideProps } from 'next';
import { useState, useEffect, useContext } from 'react';
import Toast from '../../../components/Toast';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import BannerDialog from '../../../components/banners/BannerDialog';
import BannerUpload from '../../../components/banners/BannerUpload';

import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';

import { IconButton, Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { AuthContext, AuthProvider } from '../../../context/AuthContext';

type typeBanner = {
    id: number,
    urlImg: string,
}

export default function Banners() {

    const [ruleId, setRuleId] = useState();

    const [banner, setBanner] = useState({});
    const [banners, setBanners] = useState([])
    const [modalOpen, setModalOpen] = useState(false);
    const [modalUpload, setModalUpload] = useState(false);

    const [msg, setMsg] = useState<string>("")
    const [typeToast, setTypeToast] = useState<string>("")
    const [openToast, setOpenToast] = useState(false)

    const [bannerImg, setBannerImg] = useState("");
    const [bannerId, setBannerId] = useState<string>("");

    async function getMe() {
        try {
            const response = await api.get('/me');
            setRuleId(response.data.userRestruturado.ruleId);
            console.log(ruleId)
        } catch (error) {
            console.log(error);
        }
    }

    async function getBanners() {
        try {
            const response = await api.get('/banners');
            const listBanners = response.data.banners;
            console.log(response.data.banners)
            setBanners(listBanners);
        } catch (error) {
            setMsg("Não foi possível carregar");
            setTypeToast("error");
            setOpenToast(true);
        }
    }

    function editBanner(data: any) {
        setBanner(data);
        setBannerId(data.id);
        setModalOpen(true);
    }

    async function deleteBanner(item: typeBanner) {

        if (ruleId !== 1) {
            setMsg("Usuário sem permissão");
            setTypeToast("error");
            setOpenToast(true);
            return;
        }

        try {
            await api.delete('/banners/' + item.id);
            setMsg("Banner deletado com sucesso");
            setTypeToast("success");
            setOpenToast(true);
            getBanners();
        } catch (error) {
            setMsg("Erro ao deletar banner");
            setTypeToast("error");
            setOpenToast(true);
        }
    }

    function photoBanner(item: typeBanner): void {
        setBanner(item);
        setBannerImg(item.urlImg);
        setModalUpload(true);
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', align: 'left', width: 350 },
        { field: 'title', headerName: 'Nome', align: 'left', width: 350 },
        {
            field: 'urlImg', headerName: 'Imagem', align: 'left', width: 350,
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
            field: 'actions',
            headerName: 'Ações', align: 'left', width: 300,
            renderCell: (params) => {
                return (
                    <Box>
                        <IconButton color="primary" aria-label="editar" component="label" onClick={() => editBanner(params.row)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton color="error" aria-label="deletar" component="label" onClick={() => deleteBanner(params.row)}>
                            <DeleteIcon />
                        </IconButton>
                        <IconButton color="inherit" aria-label="upload" component="label" onClick={() => photoBanner(params.row)}>
                            <ArchiveIcon />
                        </IconButton>
                    </Box>

                );
            },
        },
    ];

    React.useEffect(() => {
        getBanners();
        getMe();
    }, [bannerId, ruleId, banner])

    return (
        <Box>
            <Header />
            <Toast msg={msg} duration={3000} type={typeToast} openToast={openToast} setOpenToast={setOpenToast} />
            <BannerUpload ruleId={ruleId} modalUpload={modalUpload} setModalUpload={setModalUpload} banner={banner} setBanner={setBanner} bannerImg={bannerImg} setBannerImg />
            <Box p={15}>
                <DataGrid
                    sx={{ minWidth: 650, minHeight: 371, mt: 15 }}
                    rows={banners}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[10]}
                />
            </Box>
            <BannerDialog ruleId={ruleId} banner={banner} isOpen={modalOpen} setIsOpen={setModalOpen} setBanner={setBanner} bannerId={bannerId} setBannerId={setBannerId} />
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