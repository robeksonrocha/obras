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
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    setErrorMessage('');

    if (!email.trim() || !senha.trim()) {
      setErrorMessage('Por favor, preencha todos os campos');
      return;
    }

    if (!email.includes('@')) {
      setErrorMessage('Por favor, insira um email válido');
      return;
    }

    try {
      setLoading(true);
      
      const response = await authService.login({ email, senha });
      
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
        routes: [{ name: 'Home' }],
      });
      
    } catch (error) {
      console.error('Erro no login:', error);
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('inválidos')) {
          setErrorMessage('Email ou senha incorretos');
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
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
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