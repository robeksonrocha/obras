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
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { funcionarioService, Funcionario } from '../../services/funcionarioService';
import { format } from 'date-fns';

const formatarTelefone = (telefone: string): string => {
  // Remove todos os caracteres não numéricos
  const numeros = telefone.replace(/\D/g, '');
  
  // Aplica a máscara conforme a quantidade de números
  if (numeros.length <= 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    return numeros
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  } else {
    // Celular: (XX) XXXXX-XXXX
    return numeros
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  }
};

export default function ListaFuncionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [funcionarioEdit, setFuncionarioEdit] = useState<Funcionario | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const funcionarioVazio: Funcionario = {
    nome: '',
    cpf: '',
    cargo: '',
    dataAdmissao: format(new Date(), 'yyyy-MM-dd'),
    telefone: '',
    email: '',
    ativo: true
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    setLoading(true);
    try {
      const data = await funcionarioService.listarTodos();
      setFuncionarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      setSnackbar({ open: true, message: 'Erro ao carregar funcionários', severity: 'error' });
      setFuncionarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (funcionario?: Funcionario) => {
    setFuncionarioEdit(funcionario || funcionarioVazio);
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFuncionarioEdit(null);
    setErrors({});
  };

  const validarFormulario = (): boolean => {
    const novosErros: {[key: string]: string} = {};
    
    if (!funcionarioEdit?.nome) {
      novosErros.nome = 'Nome é obrigatório';
    }
    if (!funcionarioEdit?.cpf) {
      novosErros.cpf = 'CPF é obrigatório';
    }
    if (!funcionarioEdit?.cargo) {
      novosErros.cargo = 'Cargo é obrigatório';
    }
    if (!funcionarioEdit?.dataAdmissao) {
      novosErros.dataAdmissao = 'Data de admissão é obrigatória';
    }
    if (!funcionarioEdit?.telefone) {
      novosErros.telefone = 'Telefone é obrigatório';
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSave = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      if (!funcionarioEdit) return;

      if (funcionarioEdit.id) {
        await funcionarioService.atualizar(funcionarioEdit.id, funcionarioEdit);
        setSnackbar({ open: true, message: 'Funcionário atualizado com sucesso', severity: 'success' });
      } else {
        await funcionarioService.criar(funcionarioEdit);
        setSnackbar({ open: true, message: 'Funcionário criado com sucesso', severity: 'success' });
      }

      handleCloseDialog();
      carregarFuncionarios();
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      setSnackbar({ open: true, message: 'Erro ao salvar funcionário', severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await funcionarioService.desativar(id);
      setSnackbar({ open: true, message: 'Funcionário desativado com sucesso', severity: 'success' });
      carregarFuncionarios();
    } catch (error) {
      console.error('Erro ao desativar funcionário:', error);
      setSnackbar({ open: true, message: 'Erro ao desativar funcionário', severity: 'error' });
    }
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const telefoneFormatado = formatarTelefone(e.target.value);
    setFuncionarioEdit(prev => prev ? {...prev, telefone: telefoneFormatado} : null);
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Funcionários</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Novo Funcionário
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
                  <TableCell>CPF</TableCell>
                  <TableCell>Cargo</TableCell>
                  <TableCell>Data Admissão</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(Array.isArray(funcionarios) ? funcionarios : []).map((funcionario) => (
                  <TableRow key={funcionario.id}>
                    <TableCell>{funcionario.nome}</TableCell>
                    <TableCell>{funcionario.cpf}</TableCell>
                    <TableCell>{funcionario.cargo}</TableCell>
                    <TableCell>
                      {format(new Date(funcionario.dataAdmissao), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{funcionario.telefone}</TableCell>
                    <TableCell>{funcionario.email}</TableCell>
                    <TableCell>{funcionario.ativo ? 'Ativo' : 'Inativo'}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(funcionario)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => funcionario.id && handleDelete(funcionario.id)}>
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
            {funcionarioEdit?.id ? 'Editar Funcionário' : 'Novo Funcionário'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Nome"
                  required
                  value={funcionarioEdit?.nome || ''}
                  onChange={(e) => setFuncionarioEdit(prev => prev ? {...prev, nome: e.target.value} : null)}
                  error={!!errors.nome}
                  helperText={errors.nome}
                />
                <TextField
                  fullWidth
                  label="CPF"
                  required
                  value={funcionarioEdit?.cpf || ''}
                  onChange={(e) => setFuncionarioEdit(prev => prev ? {...prev, cpf: e.target.value} : null)}
                  error={!!errors.cpf}
                  helperText={errors.cpf}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Cargo"
                  required
                  value={funcionarioEdit?.cargo || ''}
                  onChange={(e) => setFuncionarioEdit(prev => prev ? {...prev, cargo: e.target.value} : null)}
                  error={!!errors.cargo}
                  helperText={errors.cargo}
                />
                <TextField
                  fullWidth
                  type="date"
                  label="Data de Admissão"
                  required
                  value={funcionarioEdit?.dataAdmissao || ''}
                  onChange={(e) => setFuncionarioEdit(prev => prev ? {...prev, dataAdmissao: e.target.value} : null)}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.dataAdmissao}
                  helperText={errors.dataAdmissao}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Telefone"
                  required
                  value={funcionarioEdit?.telefone || ''}
                  onChange={handleTelefoneChange}
                  error={!!errors.telefone}
                  helperText={errors.telefone}
                  inputProps={{
                    maxLength: 15
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={funcionarioEdit?.email || ''}
                  onChange={(e) => setFuncionarioEdit(prev => prev ? {...prev, email: e.target.value} : null)}
                />
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSave} variant="contained">Salvar</Button>
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