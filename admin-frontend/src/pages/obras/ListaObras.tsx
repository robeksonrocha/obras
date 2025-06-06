import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { obraService, Obra } from '../../services/obraService';
import { format } from 'date-fns';
import MapPicker from '../../components/MapPicker';

export default function ListaObras() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [obraEdit, setObraEdit] = useState<Obra | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [mapError, setMapError] = useState<string | null>(null);

  const obraVazia: Obra = {
    nome: '',
    endereco: '',
    cliente: '',
    dataInicio: format(new Date(), 'yyyy-MM-dd'),
    dataPrevisaoFim: format(new Date(), 'yyyy-MM-dd'),
    status: 'EM_ANDAMENTO',
    latitude: 0,
    longitude: 0,
    raioPermitido: 100
  };

  useEffect(() => {
    carregarObras();
  }, []);

  const carregarObras = async () => {
    setLoading(true);
    try {
      const data = await obraService.listarTodas();
      setObras(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar obras:', error);
      setSnackbar({ open: true, message: 'Erro ao carregar obras', severity: 'error' });
      setObras([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (obra?: Obra) => {
    setObraEdit(obra || obraVazia);
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setObraEdit(null);
    setErrors({});
  };

  const handleLocationChange = (lat: number, lng: number) => {
    if (obraEdit) {
      setObraEdit({
        ...obraEdit,
        latitude: lat,
        longitude: lng
      });
      setMapError(null);
    }
  };

  const validarFormulario = (): boolean => {
    const novosErros: {[key: string]: string} = {};
    
    if (!obraEdit?.nome?.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    }
    if (!obraEdit?.endereco?.trim()) {
      novosErros.endereco = 'Endereço é obrigatório';
    }

    setErrors(novosErros);
    setMapError(null);
    return Object.keys(novosErros).length === 0;
  };

  const handleSave = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      if (!obraEdit) return;

      const obraToSave = {
        ...obraEdit,
        latitude: obraEdit.latitude || 0,
        longitude: obraEdit.longitude || 0
      };

      if (obraToSave.id) {
        await obraService.atualizar(obraToSave.id, obraToSave);
        setSnackbar({ open: true, message: 'Obra atualizada com sucesso', severity: 'success' });
      } else {
        await obraService.criar(obraToSave);
        setSnackbar({ open: true, message: 'Obra criada com sucesso', severity: 'success' });
      }

      handleCloseDialog();
      carregarObras();
    } catch (error) {
      console.error('Erro ao salvar obra:', error);
      setSnackbar({ open: true, message: 'Erro ao salvar obra', severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await obraService.deletar(id);
      setSnackbar({ open: true, message: 'Obra excluída com sucesso', severity: 'success' });
      carregarObras();
    } catch (error) {
      console.error('Erro ao excluir obra:', error);
      setSnackbar({ open: true, message: 'Erro ao excluir obra', severity: 'error' });
    }
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Obras</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nova Obra
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Endereço</TableCell>
                  <TableCell>Data Início</TableCell>
                  <TableCell>Previsão Fim</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(Array.isArray(obras) ? obras : []).map((obra) => (
                  <TableRow key={obra.id}>
                    <TableCell>{obra.nome}</TableCell>
                    <TableCell>{obra.cliente}</TableCell>
                    <TableCell>{obra.endereco}</TableCell>
                    <TableCell>
                      {format(new Date(obra.dataInicio), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(obra.dataPrevisaoFim), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{obra.status}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(obra)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => obra.id && handleDelete(obra.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {obraEdit?.id ? 'Editar Obra' : 'Nova Obra'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Nome"
                    value={obraEdit?.nome || ''}
                    onChange={(e) => setObraEdit(prev => prev ? { ...prev, nome: e.target.value } : null)}
                    error={!!errors.nome}
                    helperText={errors.nome}
                  />
                  <TextField
                    fullWidth
                    label="Cliente"
                    value={obraEdit?.cliente || ''}
                    onChange={(e) => setObraEdit(prev => prev ? { ...prev, cliente: e.target.value } : null)}
                  />
                </Stack>
                <TextField
                  fullWidth
                  label="Endereço"
                  value={obraEdit?.endereco || ''}
                  onChange={(e) => setObraEdit(prev => prev ? { ...prev, endereco: e.target.value } : null)}
                  error={!!errors.endereco}
                  helperText={errors.endereco}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Data Início"
                    value={obraEdit?.dataInicio || ''}
                    onChange={(e) => setObraEdit(prev => prev ? { ...prev, dataInicio: e.target.value } : null)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="Previsão de Término"
                    value={obraEdit?.dataPrevisaoFim || ''}
                    onChange={(e) => setObraEdit(prev => prev ? { ...prev, dataPrevisaoFim: e.target.value } : null)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={obraEdit?.status || 'EM_ANDAMENTO'}
                    onChange={(e) => setObraEdit(prev => prev ? { ...prev, status: e.target.value as 'EM_ANDAMENTO' | 'CONCLUIDA' | 'PAUSADA' } : null)}
                    label="Status"
                  >
                    <MenuItem value="EM_ANDAMENTO">Em Andamento</MenuItem>
                    <MenuItem value="CONCLUIDA">Concluída</MenuItem>
                    <MenuItem value="PAUSADA">Pausada</MenuItem>
                  </Select>
                </FormControl>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Raio Permitido (metros)"
                    value={obraEdit?.raioPermitido || ''}
                    onChange={(e) => setObraEdit(prev => prev ? { ...prev, raioPermitido: Number(e.target.value) } : null)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>
                <Box sx={{ height: '400px' }}>
                  <MapPicker
                    latitude={obraEdit?.latitude || 0}
                    longitude={obraEdit?.longitude || 0}
                    onChange={(lat, lng) => setObraEdit(prev => prev ? { ...prev, latitude: lat, longitude: lng } : null)}
                  />
                  {mapError && (
                    <Typography color="error" sx={{ mt: 1 }}>
                      {mapError}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSave} variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Salvar'}
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
      </Box>
    </>
  );
} 