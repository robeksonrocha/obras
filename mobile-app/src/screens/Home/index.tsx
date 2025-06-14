import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { authService } from '../../services/auth';
import { pointService } from '../../services/point';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface UltimoRegistro {
  tipo: 'ENTRADA' | 'SAIDA_ALMOCO' | 'RETORNO_ALMOCO' | 'SAIDA';
  dataHora: string;
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [ultimoRegistro, setUltimoRegistro] = useState<UltimoRegistro | null>(null);

  useEffect(() => {
    carregarUltimoRegistro();
  }, []);

  const carregarUltimoRegistro = async () => {
    try {
      const response = await pointService.getLastPoint();
      setUltimoRegistro(response);
    } catch (error) {
      console.error('Erro ao carregar último registro:', error);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleRegisterPoint = async () => {
    try {
      setLoading(true);
      const tipo = getNextPointType();
      const response = await pointService.register(tipo);
      await carregarUltimoRegistro();
      Alert.alert('Sucesso', `Ponto registrado com sucesso!\nTipo: ${formatTipo(response.type)}`);
    } catch (error) {
      Alert.alert(
        'Erro',
        error instanceof Error ? error.message : 'Erro ao registrar ponto'
      );
    } finally {
      setLoading(false);
    }
  };

  const getNextPointType = (): string => {
    if (!ultimoRegistro) return 'ENTRADA';
    
    switch (ultimoRegistro.tipo) {
      case 'ENTRADA':
        return 'SAIDA_ALMOCO';
      case 'SAIDA_ALMOCO':
        return 'RETORNO_ALMOCO';
      case 'RETORNO_ALMOCO':
        return 'SAIDA';
      default:
        return 'ENTRADA';
    }
  };

  const formatTipo = (tipo: string): string => {
    return tipo.replace('_', ' ');
  };

  const getButtonText = (): string => {
    if (!ultimoRegistro) return 'Registrar Entrada';
    
    switch (ultimoRegistro.tipo) {
      case 'ENTRADA':
        return 'Registrar Saída Almoço';
      case 'SAIDA_ALMOCO':
        return 'Registrar Retorno Almoço';
      case 'RETORNO_ALMOCO':
        return 'Registrar Saída';
      default:
        return 'Registrar Entrada';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ponto Eletrônico</Text>
        <Text style={styles.date}>
          {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </Text>
      </View>

      <View style={styles.content}>
        {ultimoRegistro && (
          <View style={styles.lastRecord}>
            <Text style={styles.lastRecordTitle}>Último Registro:</Text>
            <Text style={styles.lastRecordText}>
              {format(new Date(ultimoRegistro.dataHora), 'HH:mm')} -{' '}
              {formatTipo(ultimoRegistro.tipo)}
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.registerButton, loading && styles.buttonDisabled]}
          onPress={handleRegisterPoint}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>{getButtonText()}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#0066CC',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lastRecord: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  lastRecordTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  lastRecordText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#DC3545',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 