import React, { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    TextField,
    Button,
    FormControl,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    FormHelperText,
    CircularProgress,
    MenuItem,
    Select,
    InputLabel,
    SelectChangeEvent,
    Stack,
    Container
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    FileDownload as FileDownloadIcon,
    LocationOn as LocationOnIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { registroPontoService } from '../../services/registroPontoService';
import { funcionarioService, Funcionario } from '../../services/funcionarioService';
import { obraService, Obra } from '../../services/obraService';
import { calcularHorasTrabalhadas } from '../../utils/timeUtils';
import { 
    DataGrid, 
    GridColDef,
    GridRenderCellParams
} from '@mui/x-data-grid';
import { RegistroPonto, RegistroPontoForm, FiltroRegistroPonto, REGISTRO_INICIAL } from '../../types/RegistroPonto';
import { useSnackbar } from 'notistack';

export default function ListaRegistrosPonto() {
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState<FiltroRegistroPonto>({
        dataInicio: format(new Date(), 'yyyy-MM-dd'),
        dataFim: format(new Date(), 'yyyy-MM-dd')
    });
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [obras, setObras] = useState<Obra[]>([]);
    const [registros, setRegistros] = useState<RegistroPonto[]>([]);
    const [dataInicio, setDataInicio] = useState<Date | null>(new Date());
    const [dataFim, setDataFim] = useState<Date | null>(new Date());
    const [openDialog, setOpenDialog] = useState(false);
    const [registroEdit, setRegistroEdit] = useState<RegistroPontoForm | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const { enqueueSnackbar } = useSnackbar();

    const handleFiltroChange = (campo: keyof FiltroRegistroPonto, valor: Date | null | number) => {
        if (valor instanceof Date) {
            setFiltros(prev => ({
                ...prev,
                [campo]: format(valor, 'yyyy-MM-dd')
            }));
        } else {
            setFiltros(prev => ({
                ...prev,
                [campo]: valor
            }));
        }
    };

    const handleDateChange = (campo: 'dataInicio' | 'dataFim', date: Date | null) => {
        setFiltros(prev => ({
            ...prev,
            [campo]: date ? format(date, 'yyyy-MM-dd') : null
        }));
    };

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const [funcionariosData, obrasData] = await Promise.all([
                funcionarioService.listarTodos(),
                obraService.listarTodas()
            ]);
            setFuncionarios(funcionariosData);
            setObras(obrasData);
            await carregarRegistros();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            enqueueSnackbar('Erro ao carregar dados iniciais. Tente novamente.', { 
                variant: 'error',
                autoHideDuration: 3000
            });
        }
    };

    const carregarRegistros = async () => {
        try {
            setLoading(true);
            console.log('[RegistrosPonto] Buscando registros com filtros:', filtros);
            const data = await registroPontoService.buscarRegistros(filtros);
            console.log('[RegistrosPonto] Resposta recebida:', data);
            setRegistros(Array.isArray(data) ? data : []);
            if (!data || (Array.isArray(data) && data.length === 0)) {
                enqueueSnackbar('Nenhum registro encontrado para os filtros selecionados.', { 
                    variant: 'info',
                    autoHideDuration: 3000
                });
            }
        } catch (error) {
            console.error('[RegistrosPonto] Erro ao carregar registros:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                // AxiosError
                const err = error as any;
                console.error('[RegistrosPonto] Detalhes do erro:', err.response);
                enqueueSnackbar(`Erro ao carregar registros: ${err.response?.status} ${err.response?.statusText}`, { 
                    variant: 'error',
                    autoHideDuration: 4000
                });
            } else {
                enqueueSnackbar('Erro ao carregar registros. Tente novamente.', { 
                    variant: 'error',
                    autoHideDuration: 4000
                });
            }
            setRegistros([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFiltrar = () => {
        const novosFiltros: FiltroRegistroPonto = {
            ...filtros,
            dataInicio: dataInicio ? format(dataInicio, 'yyyy-MM-dd') : undefined,
            dataFim: dataFim ? format(dataFim, 'yyyy-MM-dd') : undefined
        };
        setFiltros(novosFiltros);
        carregarDados();
    };

    const handleExportar = async () => {
        try {
            await registroPontoService.exportarRegistros(filtros);
            setSnackbar({ open: true, message: 'Relatório exportado com sucesso', severity: 'success' });
        } catch (error) {
            console.error('Erro ao exportar registros:', error);
            setSnackbar({ open: true, message: 'Erro ao exportar registros', severity: 'error' });
        }
    };

    const handleOpenDialog = (registro: RegistroPontoForm | null) => {
        if (registro) {
            handleEditRegistro(registro);
        } else {
            handleNovoRegistro();
        }
        setOpenDialog(true);
        setErrors({});
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setRegistroEdit(null);
        setErrors({});
    };

    const handleEditRegistro = (registro: RegistroPonto) => {
        const { id, ...registroSemId } = registro;
        setRegistroEdit({ ...registroSemId, id });
    };

    const handleNovoRegistro = () => {
        setRegistroEdit({
            ...REGISTRO_INICIAL,
            data: format(new Date(), 'yyyy-MM-dd')
        });
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        
        if (!registroEdit?.funcionarioId) {
            newErrors.funcionarioId = 'Funcionário é obrigatório';
        }
        if (!registroEdit?.obraId) {
            newErrors.obraId = 'Obra é obrigatória';
        }
        if (!registroEdit?.data) {
            newErrors.data = 'Data é obrigatória';
        }
        if (!registroEdit?.horarioEntrada) {
            newErrors.horarioEntrada = 'Horário de entrada é obrigatório';
        }
        if (!registroEdit?.horarioSaidaAlmoco) {
            newErrors.horarioSaidaAlmoco = 'Horário de saída para almoço é obrigatório';
        }
        if (!registroEdit?.horarioRetornoAlmoco) {
            newErrors.horarioRetornoAlmoco = 'Horário de retorno do almoço é obrigatório';
        }
        if (!registroEdit?.horarioSaida) {
            newErrors.horarioSaida = 'Horário de saída é obrigatório';
        }

        // Validação dos horários
        if (registroEdit?.horarioEntrada && registroEdit?.horarioSaidaAlmoco && 
            registroEdit?.horarioRetornoAlmoco && registroEdit?.horarioSaida) {
            
            const entrada = registroEdit.horarioEntrada;
            const saidaAlmoco = registroEdit.horarioSaidaAlmoco;
            const retornoAlmoco = registroEdit.horarioRetornoAlmoco;
            const saida = registroEdit.horarioSaida;

            if (saidaAlmoco <= entrada) {
                newErrors.horarios = 'Horário de saída para almoço deve ser posterior ao horário de entrada';
            }
            if (retornoAlmoco <= saidaAlmoco) {
                newErrors.horarios = 'Horário de retorno do almoço deve ser posterior ao horário de saída para almoço';
            }
            if (saida <= retornoAlmoco) {
                newErrors.horarios = 'Horário de saída deve ser posterior ao horário de retorno do almoço';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!registroEdit) return;
        if (!validateForm()) return;

        try {
            const registroToSave: RegistroPonto = {
                id: registroEdit.id,
                funcionarioId: registroEdit.funcionarioId,
                obraId: registroEdit.obraId,
                data: registroEdit.data,
                horarioEntrada: registroEdit.horarioEntrada,
                horarioSaidaAlmoco: registroEdit.horarioSaidaAlmoco,
                horarioRetornoAlmoco: registroEdit.horarioRetornoAlmoco,
                horarioSaida: registroEdit.horarioSaida,
                latitude: registroEdit.latitude,
                longitude: registroEdit.longitude,
                distanciaObra: registroEdit.distanciaObra
            };

            if (registroToSave.id) {
                await registroPontoService.atualizar(registroToSave.id, registroToSave);
            } else {
                await registroPontoService.criar(registroToSave);
            }

            handleCloseDialog();
            carregarRegistros();
        } catch (error) {
            console.error('Erro ao salvar registro:', error);
            enqueueSnackbar('Erro ao salvar registro. Tente novamente.', { 
                variant: 'error',
                autoHideDuration: 3000
            });
        }
    };

    const formatarData = (data: string) => {
        return format(parse(data, 'yyyy-MM-dd', new Date()), "dd/MM/yyyy", { locale: ptBR });
    };

    const getFuncionarioSelecionado = (): Funcionario | null => {
        if (!filtros.funcionarioId) return null;
        const funcionario = funcionarios.find(f => f.id === filtros.funcionarioId);
        return funcionario || null;
    };

    const handleFuncionarioChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        if (!registroEdit) return;
        
        const novoRegistro: RegistroPontoForm = {
            ...registroEdit,
            funcionarioId: value === '' ? 0 : Number(value)
        };
        
        setRegistroEdit(novoRegistro);
    };

    const handleObraChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        if (!registroEdit) return;
        
        const novoRegistro: RegistroPontoForm = {
            ...registroEdit,
            obraId: value === '' ? 0 : Number(value)
        };
        
        setRegistroEdit(novoRegistro);
    };

    const handleTimeChange = (field: keyof RegistroPontoForm, value: string) => {
        if (!registroEdit) return;
        
        const novoRegistro: RegistroPontoForm = {
            ...registroEdit,
            [field]: value
        };
        
        setRegistroEdit(novoRegistro);
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'funcionarioNome', headerName: 'Funcionário', width: 200 },
        { field: 'obraNome', headerName: 'Obra', width: 200 },
        { 
            field: 'data', 
            headerName: 'Data', 
            width: 120,
            valueFormatter: ({ value }) => formatarData(value as string)
        },
        { field: 'horarioEntrada', headerName: 'Entrada', width: 100 },
        { field: 'horarioSaidaAlmoco', headerName: 'Saída Almoço', width: 120 },
        { field: 'horarioRetornoAlmoco', headerName: 'Retorno Almoço', width: 120 },
        { field: 'horarioSaida', headerName: 'Saída', width: 100 },
        {
            field: 'horasTrabalhadas',
            headerName: 'Total Horas',
            width: 120,
            valueGetter: ({ row }) => {
                const registro = row as RegistroPonto;
                if (registro.horarioEntrada && registro.horarioSaidaAlmoco &&
                    registro.horarioRetornoAlmoco && registro.horarioSaida) {
                    return calcularHorasTrabalhadas(
                        registro.horarioEntrada,
                        registro.horarioSaidaAlmoco,
                        registro.horarioRetornoAlmoco,
                        registro.horarioSaida
                    );
                }
                return '-';
            }
        },
        {
            field: 'acoes',
            headerName: 'Ações',
            width: 120,
            renderCell: (params) => {
                const registro = params.row as RegistroPonto;
                return (
                    <>
                        <IconButton onClick={() => handleOpenDialog(registro as RegistroPontoForm)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(registro.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </>
                );
            }
        }
    ];

    const handleDelete = async (id: number | undefined) => {
        if (typeof id === 'undefined' || id === null) {
            setSnackbar({ open: true, message: 'ID inválido', severity: 'error' });
            return;
        }

        if (window.confirm('Tem certeza que deseja excluir este registro?')) {
            try {
                await registroPontoService.excluir(id);
                await carregarRegistros();
                setSnackbar({ open: true, message: 'Registro excluído com sucesso', severity: 'success' });
            } catch (error) {
                console.error('Erro ao excluir registro:', error);
                setSnackbar({ open: true, message: 'Erro ao excluir registro', severity: 'error' });
            }
        }
    };

    const handleRegistroChange = (campo: keyof RegistroPontoForm, valor: any) => {
        if (!registroEdit) return;
        
        const novoRegistro: RegistroPontoForm = {
            ...registroEdit,
            [campo]: valor instanceof Date ? format(valor, 'yyyy-MM-dd') : valor
        };
        
        setRegistroEdit(novoRegistro);
    };

    return (
        <Container maxWidth="lg">
            <Stack spacing={2}>
                <Typography variant="h4" component="h1">
                    Registros de Ponto
                </Typography>
                
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog(null)}
                >
                    Novo Registro
                </Button>

                <DataGrid
                    rows={Array.isArray(registros) ? registros : []}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[10, 20, 50]}
                    autoHeight
                />

                <Paper sx={{ p: 3, mb: 2 }}>
                    <Stack spacing={2}>
                        <Stack
                            direction="row"
                            columnGap={2}
                            rowGap={5}
                            flexWrap="wrap"
                        >
                            <FormControl sx={{ width: { xs: '100%', sm: '48%', md: '23%' } }}>
                                <InputLabel>Funcionário</InputLabel>
                                <Select
                                    label="Funcionário"
                                    value={filtros.funcionarioId?.toString() || ''}
                                    onChange={handleFuncionarioChange}
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    {(Array.isArray(funcionarios) ? funcionarios : []).map((funcionario) => (
                                        <MenuItem key={funcionario.id} value={funcionario.id?.toString()}>
                                            {funcionario.nome}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ width: { xs: '100%', sm: '48%', md: '23%' } }}>
                                <InputLabel>Obra</InputLabel>
                                <Select
                                    label="Obra"
                                    value={filtros.obraId?.toString() || ''}
                                    onChange={(e) => setFiltros({ ...filtros, obraId: e.target.value ? Number(e.target.value) : undefined })}
                                >
                                    <MenuItem value="">Todas</MenuItem>
                                    {(Array.isArray(obras) ? obras : []).map((obra) => (
                                        <MenuItem key={obra.id} value={obra.id?.toString()}>
                                            {obra.nome}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box sx={{ width: { xs: '100%', sm: '48%', md: '23%' } }}>
                                <DatePicker
                                    label="Data Início"
                                    value={dataInicio}
                                    onChange={(date) => {
                                        setDataInicio(date);
                                        if (date) {
                                            setFiltros({ ...filtros, dataInicio: format(date, 'yyyy-MM-dd') });
                                        }
                                    }}
                                    format="dd/MM/yyyy"
                                />
                            </Box>
                            <Box sx={{ width: { xs: '100%', sm: '48%', md: '23%' } }}>
                                <DatePicker
                                    label="Data Fim"
                                    value={dataFim}
                                    onChange={(date) => {
                                        setDataFim(date);
                                        if (date) {
                                            setFiltros({ ...filtros, dataFim: format(date, 'yyyy-MM-dd') });
                                        }
                                    }}
                                    format="dd/MM/yyyy"
                                />
                            </Box>
                            <Box sx={{ width: { xs: '100%', sm: '48%', md: '23%' } }}>
                                <Button
                                    variant="contained"
                                    onClick={handleFiltrar}
                                >
                                    Filtrar
                                </Button>
                            </Box>
                        </Stack>
                    </Stack>
                </Paper>

                <Paper sx={{ p: 2, mb: 2 }}>
                    <Stack spacing={2}>
                        <Button
                            variant="contained"
                            startIcon={<FileDownloadIcon />}
                            onClick={handleExportar}
                        >
                            Exportar
                        </Button>
                    </Stack>
                </Paper>

                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>
                        {registroEdit?.id ? 'Editar Registro de Ponto' : 'Novo Registro de Ponto'}
                    </DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <FormControl fullWidth error={!!errors.funcionarioId}>
                                    <InputLabel>Funcionário</InputLabel>
                                    <Select
                                        required
                                        value={registroEdit?.funcionarioId?.toString() || ''}
                                        onChange={handleFuncionarioChange}
                                        label="Funcionário"
                                    >
                                        {(Array.isArray(funcionarios) ? funcionarios : []).map((funcionario) => (
                                            <MenuItem key={funcionario.id} value={funcionario.id?.toString()}>
                                                {funcionario.nome}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.funcionarioId && <FormHelperText>{errors.funcionarioId}</FormHelperText>}
                                </FormControl>
                                <FormControl fullWidth error={!!errors.obraId}>
                                    <InputLabel>Obra</InputLabel>
                                    <Select
                                        required
                                        value={registroEdit?.obraId?.toString() || ''}
                                        onChange={handleObraChange}
                                        label="Obra"
                                    >
                                        {(Array.isArray(obras) ? obras : []).map((obra) => (
                                            <MenuItem key={obra.id} value={obra.id?.toString()}>
                                                {obra.nome}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.obraId && <FormHelperText>{errors.obraId}</FormHelperText>}
                                </FormControl>
                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <DatePicker
                                    label="Data"
                                    value={registroEdit?.data ? parse(registroEdit.data, 'yyyy-MM-dd', new Date()) : null}
                                    onChange={(date) => handleRegistroChange('data', date)}
                                    format="dd/MM/yyyy"
                                    slotProps={{
                                        textField: {
                                            required: true,
                                            error: !!errors.data,
                                            helperText: errors.data
                                        }
                                    }}
                                />
                                <TextField
                                    required
                                    label="Horário de Entrada"
                                    type="time"
                                    value={registroEdit?.horarioEntrada || ''}
                                    onChange={(e) => handleTimeChange('horarioEntrada', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.horarioEntrada}
                                    helperText={errors.horarioEntrada}
                                />
                                <TextField
                                    required
                                    label="Saída para Almoço"
                                    type="time"
                                    value={registroEdit?.horarioSaidaAlmoco || ''}
                                    onChange={(e) => handleTimeChange('horarioSaidaAlmoco', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.horarioSaidaAlmoco}
                                    helperText={errors.horarioSaidaAlmoco}
                                />
                                <TextField
                                    required
                                    label="Retorno do Almoço"
                                    type="time"
                                    value={registroEdit?.horarioRetornoAlmoco || ''}
                                    onChange={(e) => handleTimeChange('horarioRetornoAlmoco', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.horarioRetornoAlmoco}
                                    helperText={errors.horarioRetornoAlmoco}
                                />
                                <TextField
                                    required
                                    label="Horário de Saída"
                                    type="time"
                                    value={registroEdit?.horarioSaida || ''}
                                    onChange={(e) => handleTimeChange('horarioSaida', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.horarioSaida}
                                    helperText={errors.horarioSaida}
                                />
                            </Stack>
                            {registroEdit?.horarioEntrada && registroEdit?.horarioSaidaAlmoco && 
                             registroEdit?.horarioRetornoAlmoco && registroEdit?.horarioSaida && (
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <TextField
                                        label="Total de Horas Trabalhadas"
                                        value={calcularHorasTrabalhadas(
                                            registroEdit.horarioEntrada,
                                            registroEdit.horarioSaidaAlmoco,
                                            registroEdit.horarioRetornoAlmoco,
                                            registroEdit.horarioSaida
                                        )}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        fullWidth
                                    />
                                </Stack>
                            )}
                            {errors.horarios && (
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Alert severity="error">{errors.horarios}</Alert>
                                </Stack>
                            )}
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button onClick={handleSave} variant="contained">
                            {'Salvar'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Stack>
        </Container>
    );
} 