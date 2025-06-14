import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { authService } from '../../services/auth';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidCPF = (cpf: string): boolean => {
    // Remove caracteres não numéricos
    const numericCPF = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (numericCPF.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numericCPF)) return false;

    // Validação do dígito verificador
    let sum = 0;
    let remainder;

    // Primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(numericCPF.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numericCPF.substring(9, 10))) return false;

    // Segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(numericCPF.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numericCPF.substring(10, 11))) return false;

    return true;
  };

  const validateIdentifier = (value: string): boolean => {
    // Remove espaços em branco
    const trimmedValue = value.trim();
    
    // Verifica se está vazio
    if (!trimmedValue) {
      setErrorMessage('Por favor, insira seu email ou CPF');
      return false;
    }

    // Verifica se é um email válido ou um CPF válido
    if (!isValidEmail(trimmedValue) && !isValidCPF(trimmedValue)) {
      setErrorMessage('Por favor, insira um email ou CPF válido');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    setErrorMessage('');

    if (!identifier.trim() || !senha.trim()) {
      setErrorMessage('Por favor, preencha todos os campos');
      return;
    }

    if (!validateIdentifier(identifier)) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await authService.login({ 
        email: identifier, // O backend deve ser capaz de identificar se é email ou CPF
        senha 
      });
      
      // Verifica se a resposta contém um token válido (formato JWT)
      if (!response.token || typeof response.token !== 'string' || !response.token.includes('.')) {
        setErrorMessage('Erro de autenticação: token inválido');
        return;
      }
      
      // Verifica se o token tem o formato correto (três partes separadas por ponto)
      const tokenParts = response.token.split('.');
      if (tokenParts.length !== 3) {
        setErrorMessage('Erro de autenticação: formato de token inválido');
        return;
      }
      
      console.log('Login realizado com sucesso');
      
      // Navega para a tela Home
      navigation.reset({
        index: 0,
        routes: [{ 
          name: 'Home',
          params: { email: identifier }
        }],
      });
      
    } catch (error) {
      console.error('Erro no login:', error);
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('inválidos')) {
          setErrorMessage('Email/CPF ou senha incorretos');
        } else if (error.message.includes('conexão')) {
          setErrorMessage('Erro de conexão com o servidor. Tente novamente.');
        } else if (error.message.includes('Token')) {
          setErrorMessage('Erro de autenticação: ' + error.message);
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage('Ocorreu um erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Ponto Eletrônico</Text>
        <Text style={styles.subtitle}>Controle de Acesso</Text>
        
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}
        
        <TextInput
          style={[styles.input, errorMessage ? styles.inputError : null]}
          placeholder="Email ou CPF"
          value={identifier}
          onChangeText={(text) => {
            setIdentifier(text);
            setErrorMessage('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <TextInput
          style={[styles.input, errorMessage ? styles.inputError : null]}
          placeholder="Senha"
          value={senha}
          onChangeText={(text) => {
            setSenha(text);
            setErrorMessage('');
          }}
          secureTextEntry
        />
        
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#FFE8E8',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FFB6B6',
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default LoginScreen; 