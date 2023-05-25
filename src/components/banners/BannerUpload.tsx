import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Fab, Grid } from '@mui/material';
import { api } from '../../lib/axios';
import { useForm } from 'react-hook-form';
import Toast from '../../components/Toast';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ModalUpload({ modalUpload, setModalUpload, banner, setBanner, bannerImg, setBannerImg, ruleId }: any) {
    const { register, handleSubmit } = useForm();
    const [msg, setMsg] = useState<string>("");
    const [openToast, setOpenToast] = useState(false)
    const [cardFile, setCardFile] = useState() as any;
    const [typeToast, setTypeToast] = useState<string>("");
    const [disableButton, setDisableButton] = useState(true);

    const handleUploadFile = (e: any) => {
        setCardFile(e.target.files[0]);
    }

    const handleClose = () => {
        setModalUpload(false);
        setBanner({});
        setCardFile("");
    };

    async function uploadImage() {

        if (ruleId !== 1) {
            setMsg("Usuário sem permissão");
            setTypeToast("error");
            setOpenToast(true);
            return;
        }

        const form = new FormData();
        form.append("file", cardFile);
        form.append("filename", cardFile.name);
        form.append("id", banner.id);
        form.append("type", "banner");
        try {
            await api.post('/upload-file-aws',
                form, {
                headers: {
                    "Content-Type": `multipart/form-data;`,
                },
            });
            setMsg("Imagem salva com sucesso");
            setTypeToast("success");
            setOpenToast(true);
            handleClose();
        } catch (error) {
            setMsg("Erro ao salvar imagem");
            setTypeToast("error");
            setOpenToast(true);
        }
    }

    async function deleteImg(filename: string) {
        try {
            await api.delete(`/delete-file/${banner.id}/${filename.substring(41)}`, {
                data: {
                    type: "banner"
                }
            });
            setMsg("Imagem deletada com sucesso");
            setTypeToast("success");
            setOpenToast(true);
            setBannerImg("");
            setDisableButton(false);
        } catch (error) {
            console.log(error);
            setMsg("Erro ao deletar imagem");
            setTypeToast("error");
            setOpenToast(true);
        }
    }

    function ImageShow() {
        if (bannerImg != "") {
            return (
                <div>
                    {bannerImg ? (<>
                        <Image
                            src={bannerImg}
                            alt={'img'}
                            width='530'
                            height='300'
                            loading="lazy" />
                        <Fab
                            {...register('product.urlImg')}
                            onClick={() => deleteImg(bannerImg)}
                            color="primary" aria-label="add" sx={{
                                position: 'fixed',
                                width: '40px',
                                height: '40px',
                                background: '#DF2529',
                                '&:hover': {
                                    background: '#d74649',
                                },
                                right: '10px',
                                top: '75px'
                            }}
                        >
                            <CloseIcon />
                        </Fab></>) : ""}
                </div>)
        } else {
            return (<div>Nenhuma foto cadastrada.</div>)
        }
    }

    useEffect(() => {
        if (bannerImg == "") {
            setDisableButton(false);
        }
    }, [banner])

    return (
        <div>
            <Toast msg={msg} duration={3000} type={typeToast} openToast={openToast} setOpenToast={setOpenToast} />

            <Modal
                open={modalUpload}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={5}>
                        Adicionar foto
                    </Typography>
                    <Grid>
                        <ImageShow />
                        {cardFile ? <Image
                            src={URL.createObjectURL(cardFile)}
                            alt={'img'}
                            width='530'
                            height='300'
                            loading="lazy"
                        /> : <></>
                        }
                    </Grid>
                    <form encType="multipart/form-data">
                        <Box mt={5} sx={{ display: 'flex', justifyContent: 'end' }}>
                            <Button variant="contained" component="label"
                                disabled={disableButton}
                                sx={{
                                    marginRight: 1,
                                    background: '#00824a',
                                    '&:hover': {
                                        background: '#05b96b',
                                    },
                                }}>
                                Upload
                                <input hidden accept="image/*" name="image" type="file" onChange={handleUploadFile} />
                            </Button>
                            <Button onClick={handleClose} variant='contained' color="error" sx={{ marginRight: 1 }}>Fechar</Button>
                            <Button size="medium" variant='contained' type="submit" onClick={handleSubmit(uploadImage)}>Salvar</Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </div >
    );
}
