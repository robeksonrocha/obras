import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Limpe outros dados se necessário
    console.log('Logout realizado: token removido e redirecionando para login');
    navigate('/login');
  };

  return (
    <Tooltip title="Sair">
      <IconButton color="inherit" onClick={handleLogout}>
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  );
};

export default LogoutButton; 