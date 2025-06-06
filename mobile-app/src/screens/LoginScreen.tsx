import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [usarPin, setUsarPin] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (loading) return;

    if (usarPin && !pin) {
      Alert.alert('Erro', 'Digite seu PIN');
      return;
    }

    if (!usarPin && (!email || !senha)) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', usarPin ? { pin } : { email, senha });
      await AsyncStorage.setItem('@token', response.data.token);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.titulo}>Ponto Eletrônico</Text>

        <TouchableOpacity
          style={styles.alternarLogin}
          onPress={() => setUsarPin(!usarPin)}
        >
          <Text style={styles.alternarLoginTexto}>
            {usarPin ? 'Usar e-mail e senha' : 'Usar PIN'}
          </Text>
        </TouchableOpacity>

        {usarPin ? (
          <TextInput
            style={styles.input}
            placeholder="Digite seu PIN"
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            maxLength={6}
            secureTextEntry
          />
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
          </>
        )}

        <TouchableOpacity
          style={styles.botao}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.botaoTexto}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  botao: {
    backgroundColor: '#0066CC',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  alternarLogin: {
    marginBottom: 20,
  },
  alternarLoginTexto: {
    color: '#0066CC',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoginScreen; 