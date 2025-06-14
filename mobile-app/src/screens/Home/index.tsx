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
import { format, parseISO, differenceInMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'Home'>['route'];

interface UltimoRegistro {
  tipo: 'ENTRADA' | 'SAIDA_ALMOCO' | 'RETORNO_ALMOCO' | 'SAIDA';
  dataHora: string;
}

interface RegistroDiario {
  entrada?: Date;
  saidaAlmoco?: Date;
  retornoAlmoco?: Date;
  saida?: Date;
}

type PointType = 'ENTRADA' | 'SAIDA_ALMOCO' | 'RETORNO_ALMOCO' | 'SAIDA';

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const { email } = route.params;
  const [loading, setLoading] = useState(false);
  const [ultimoRegistro, setUltimoRegistro] = useState<UltimoRegistro | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [registroDiario, setRegistroDiario] = useState<RegistroDiario>({});

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
      
      // Atualiza o registro diário
      const novoRegistro = { ...registroDiario };
      const horaRegistro = new Date();
      
      switch (tipo) {
        case 'ENTRADA':
          novoRegistro.entrada = horaRegistro;
          break;
        case 'SAIDA_ALMOCO':
          novoRegistro.saidaAlmoco = horaRegistro;
          break;
        case 'RETORNO_ALMOCO':
          novoRegistro.retornoAlmoco = horaRegistro;
          break;
        case 'SAIDA':
          novoRegistro.saida = horaRegistro;
          break;
      }
      
      setRegistroDiario(novoRegistro);
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

  const calcularHorasTrabalhadas = (): string => {
    if (!registroDiario.entrada) return '--:--';

    let minutosTrabalhados = 0;

    if (registroDiario.saida) {
      // Dia completo
      minutosTrabalhados = differenceInMinutes(registroDiario.saida, registroDiario.entrada);
      // Desconta 1 hora de almoço se tiver registro de almoço
      if (registroDiario.saidaAlmoco && registroDiario.retornoAlmoco) {
        minutosTrabalhados -= 60; // 1 hora em minutos
      }
    } else if (registroDiario.saidaAlmoco) {
      // Até a saída do almoço
      minutosTrabalhados = differenceInMinutes(registroDiario.saidaAlmoco, registroDiario.entrada);
    }

    const horas = Math.floor(minutosTrabalhados / 60);
    const minutos = minutosTrabalhados % 60;
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
  };

  const getButtonColor = (): string => {
    if (!ultimoRegistro) return '#007AFF';
    switch (ultimoRegistro.tipo) {
      case 'ENTRADA':
        return '#FFA500'; // Laranja para saída almoço
      case 'SAIDA_ALMOCO':
        return '#32CD32'; // Verde para retorno almoço
      case 'RETORNO_ALMOCO':
        return '#DC143C'; // Vermelho para saída
      default:
        return '#007AFF'; // Azul para entrada
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.date}>
            {format(currentTime, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </Text>
          <Text style={styles.currentTime}>
            {format(currentTime, 'HH:mm:ss', { locale: ptBR })}
          </Text>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Ponto Eletrônico</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.userName}>{email}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.registrosContainer}>
          <View style={styles.registroItem}>
            <Text style={styles.registroLabel}>Entrada:</Text>
            <Text style={styles.registroHora}>
              {registroDiario.entrada ? format(registroDiario.entrada, 'HH:mm') : '--:--'}
            </Text>
          </View>

          <View style={styles.registroItem}>
            <Text style={styles.registroLabel}>Saída Almoço:</Text>
            <Text style={styles.registroHora}>
              {registroDiario.saidaAlmoco ? format(registroDiario.saidaAlmoco, 'HH:mm') : '--:--'}
            </Text>
          </View>

          <View style={styles.registroItem}>
            <Text style={styles.registroLabel}>Retorno Almoço:</Text>
            <Text style={styles.registroHora}>
              {registroDiario.retornoAlmoco ? format(registroDiario.retornoAlmoco, 'HH:mm') : '--:--'}
            </Text>
          </View>

          <View style={styles.registroItem}>
            <Text style={styles.registroLabel}>Saída:</Text>
            <Text style={styles.registroHora}>
              {registroDiario.saida ? format(registroDiario.saida, 'HH:mm') : '--:--'}
            </Text>
          </View>

          <View style={[styles.registroItem, styles.totalHoras]}>
            <Text style={styles.registroLabel}>Total do Dia:</Text>
            <Text style={styles.registroHora}>{calcularHorasTrabalhadas()}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.registerButton, { backgroundColor: getButtonColor() }, loading && styles.buttonDisabled]}
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
  headerCenter: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userName: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  date: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 5,
  },
  currentTime: {
    fontSize: 24,
    color: '#FFF',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  registrosContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  registroItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  registroLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  registroHora: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  totalHoras: {
    marginTop: 10,
    borderBottomWidth: 0,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#F0F0F0',
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  registerButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  logoutButton: {
    backgroundColor: '#DC3545',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 