import React, { useState, useEffect } from 'react';
import {
  Stack,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import { getDashboardData, DashboardData } from '../../services/dashboardService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar dados do dashboard');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 2, bgcolor: '#fff3f3' }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              flex: 1
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total de Funcionários
            </Typography>
            <Typography component="p" variant="h4">
              {dashboardData.totalFuncionarios}
            </Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              flex: 1
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Obras em Andamento
            </Typography>
            <Typography component="p" variant="h4">
              {dashboardData.obrasAtivas}
            </Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              flex: 1
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Registros de Ponto Hoje
            </Typography>
            <Typography component="p" variant="h4">
              {dashboardData.registrosHoje}
            </Typography>
          </Paper>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              flex: 1
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Alertas
            </Typography>
            <Typography component="p" variant="h4">
              {dashboardData.totalAlertas}
            </Typography>
          </Paper>
        </Stack>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Últimos Registros de Ponto
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Funcionário</TableCell>
                  <TableCell>Obra</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Data/Hora</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(Array.isArray(dashboardData.ultimosRegistros) ? dashboardData.ultimosRegistros : []).map((registro) => (
                  <TableRow key={registro.id}>
                    <TableCell>{registro.funcionarioNome}</TableCell>
                    <TableCell>{registro.obra}</TableCell>
                    <TableCell>{registro.tipo}</TableCell>
                    <TableCell>
                      {format(new Date(registro.dataHora), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>
    </div>
  );
};

export default Dashboard; 