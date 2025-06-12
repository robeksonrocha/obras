import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { funcionarioService } from '../../services/funcionarioService';

const FuncionarioForm: React.FC = () => {
  const navigate = useNavigate();

  const [funcionario, setFuncionario] = useState({
    id: '',
    nome: '',
    obraId: '',
    usuarioId: '1',
    cpf: '',
    cargo: '',
    telefone: '',
    ativo: true,
    email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[FormularioFuncionario] Objeto obraId:", funcionario.obraId);
    console.log("[FormularioFuncionario] ID da obra:", funcionario.obraId);
    try {
      const funcionarioData = {
        id: funcionario.id ? Number(funcionario.id) : undefined,
        nome: funcionario.nome,
        cpf: funcionario.cpf,
        cargo: funcionario.cargo,
        telefone: funcionario.telefone,
        ativo: true,
        dataAdmissao: new Date().toISOString(),
        email: funcionario.email || '',
        obraId: Number(funcionario.obraId),
        obra: { id: Number(funcionario.obraId) },
        usuario: { id: Number(funcionario.usuarioId) }
      };
      console.log("[FormularioFuncionario] JSON enviado ao backend:", JSON.stringify(funcionarioData, null, 2));
      if (funcionario.id) {
        await funcionarioService.atualizar(Number(funcionario.id), funcionarioData);
      } else {
        await funcionarioService.criar(funcionarioData);
      }
      navigate('/funcionarios');
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
    }
  };

  return (
    <div>
      {/* Renderização do formulário */}
    </div>
  );
};

export default FuncionarioForm; 