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
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'Home'>['route'];

interface UltimoRegistro {
  tipo: 'ENTRADA' | 'SAIDA_ALMOCO' | 'RETORNO_ALMOCO' | 'SAIDA';
  dataHora: string;
}

type PointType = 'ENTRADA' | 'SAIDA_ALMOCO' | 'RETORNO_ALMOCO' | 'SAIDA';

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const { email } = route.params;
  const [loading, setLoading] = useState(false);
  const [ultimoRegistro, setUltimoRegistro] = useState<UltimoRegistro | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    carregarUltimoRegistro();

    // Atualiza o horário a cada segundo
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(timer);
  }, []);

  const carregarUltimoRegistro = async () => {
    try {
      const response = await pointService.getLastPoint();
      console.log('Último registro carregado:', response);
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
      console.log('Ponto registrado:', response);
      await carregarUltimoRegistro();
      Alert.alert('Sucesso', `Ponto registrado com sucesso!\nTipo: ${formatTipo(tipo)}`);
    } catch (error) {
      Alert.alert(
        'Erro',
        error instanceof Error ? error.message : 'Erro ao registrar ponto'
      );
    } finally {
      setLoading(false);
    }
  };

  const getNextPointType = (): PointType => {
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
    const tipos = {
      'ENTRADA': 'Entrada',
      'SAIDA_ALMOCO': 'Saída Almoço',
      'RETORNO_ALMOCO': 'Retorno Almoço',
      'SAIDA': 'Saída'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
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

  const formatDataHora = (dataHora: string | undefined): string => {
    try {
      if (!dataHora) {
        console.error('Data/hora indefinida');
        return '--:--';
      }
      
      // Verifica se a string está no formato ISO
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(dataHora)) {
        console.error('Formato de data inválido:', dataHora);
        return '--:--';
      }

      const data = parseISO(dataHora);
      return format(data, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '--:--';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Ponto Eletrônico</Text>
          <Text style={styles.date}>
            {format(currentTime, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </Text>
          <Text style={styles.currentTime}>
            {format(currentTime, 'HH:mm:ss', { locale: ptBR })}
          </Text>
        </View>
        <Text style={styles.userName}>{email}</Text>
      </View>

      <View style={styles.content}>
        {ultimoRegistro && (
          <View style={styles.lastRecord}>
            <Text style={styles.lastRecordTitle}>Último Registro:</Text>
            <Text style={styles.lastRecordType}>
              {formatTipo(ultimoRegistro.tipo)}
            </Text>
            <Text style={styles.lastRecordTime}>
              {formatDataHora(ultimoRegistro.dataHora)}
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
    textAlign: 'right',
  },
  date: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 5,
  },
  currentTime: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 10,
    fontFamily: 'monospace',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  lastRecord: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lastRecordTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  lastRecordType: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  lastRecordTime: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#DC3545',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
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