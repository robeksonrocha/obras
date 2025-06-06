import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../services/api';
import { useSnackbar } from 'notistack';

interface Usuario {
  id: number;
  nome: string;
}

interface RegistroPonto {
  id: number;
  dataHora: string;
  tipo: string;
  usuario: Usuario;
  registroManual: boolean;
  observacao?: string;
}

const Relatorios = () => {
  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [dataFim, setDataFim] = useState<Date | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<number | ''>('');
  const [registros, setRegistros] = useState<RegistroPonto[]>([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Erro ao carregar usuários', { variant: 'error' });
    }
  };

  const buscarRelatorio = async () => {
    if (!dataInicio || !dataFim || !usuarioSelecionado) {
      enqueueSnackbar('Preencha todos os campos obrigatórios', { variant: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/registros/relatorio', {
        params: {
          dataInicio: format(dataInicio, 'yyyy-MM-dd'),
          dataFim: format(dataFim, 'yyyy-MM-dd'),
          usuarioId: usuarioSelecionado,
        },
      });
      setRegistros(response.data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Erro ao buscar relatório', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const formatarTipoRegistro = (tipo: string) => {
    return tipo.replace('_', ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Relatório de Ponto
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Funcionário</InputLabel>
            <Select
              value={usuarioSelecionado}
              label="Funcionário"
              onChange={(e) => setUsuarioSelecionado(e.target.value as number)}
            >
              {(Array.isArray(usuarios) ? usuarios : []).map((usuario) => (
                <MenuItem key={usuario.id} value={usuario.id}>
                  {usuario.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DatePicker
            label="Data Início"
            value={dataInicio}
            onChange={setDataInicio}
            format="dd/MM/yyyy"
          />

          <DatePicker
            label="Data Fim"
            value={dataFim}
            onChange={setDataFim}
            format="dd/MM/yyyy"
          />

          <Button
            variant="contained"
            onClick={buscarRelatorio}
            disabled={loading}
          >
            {'Buscar'}
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Funcionário</TableCell>
                <TableCell>Registro Manual</TableCell>
                <TableCell>Observação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(Array.isArray(registros) ? registros : []).map((registro) => (
                <TableRow key={registro.id}>
                  <TableCell>
                    {format(new Date(registro.dataHora), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(registro.dataHora), 'HH:mm')}
                  </TableCell>
                  <TableCell>{formatarTipoRegistro(registro.tipo)}</TableCell>
                  <TableCell>{registro.usuario.nome}</TableCell>
                  <TableCell>{registro.registroManual ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>{registro.observacao || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Relatorios; 