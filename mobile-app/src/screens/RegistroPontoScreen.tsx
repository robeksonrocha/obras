import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../services/api';

const RegistroPontoScreen = () => {
  const [loading, setLoading] = useState(false);
  const [ultimoRegistro, setUltimoRegistro] = useState<any>(null);
  const navigation = useNavigation();

  useEffect(() => {
    carregarUltimoRegistro();
  }, []);

  const carregarUltimoRegistro = async () => {
    try {
      const response = await api.get('/registros/ultimo');
      setUltimoRegistro(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const registrarPonto = async (tipo: string) => {
    setLoading(true);
    try {
      Geolocation.getCurrentPosition(
        async (position) => {
          try {
            await api.post('/registros', {
              tipo,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            Alert.alert('Sucesso', 'Ponto registrado com sucesso!');
            await carregarUltimoRegistro();
          } catch (error: any) {
            Alert.alert('Erro', error.response?.data?.message || 'Erro ao registrar ponto');
          }
        },
        (error) => {
          Alert.alert('Erro', 'Não foi possível obter sua localização');
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } finally {
      setLoading(false);
    }
  };

  const renderBotaoPonto = () => {
    if (!ultimoRegistro) {
      return (
        <TouchableOpacity
          style={styles.botao}
          onPress={() => registrarPonto('ENTRADA')}
          disabled={loading}
        >
          <Icon name="login" size={24} color="#FFF" />
          <Text style={styles.botaoTexto}>Registrar Entrada</Text>
        </TouchableOpacity>
      );
    }

    switch (ultimoRegistro.tipo) {
      case 'ENTRADA':
        return (
          <TouchableOpacity
            style={styles.botao}
            onPress={() => registrarPonto('SAIDA_ALMOCO')}
            disabled={loading}
          >
            <Icon name="restaurant" size={24} color="#FFF" />
            <Text style={styles.botaoTexto}>Registrar Saída Almoço</Text>
          </TouchableOpacity>
        );
      case 'SAIDA_ALMOCO':
        return (
          <TouchableOpacity
            style={styles.botao}
            onPress={() => registrarPonto('RETORNO_ALMOCO')}
            disabled={loading}
          >
            <Icon name="restaurant" size={24} color="#FFF" />
            <Text style={styles.botaoTexto}>Registrar Retorno Almoço</Text>
          </TouchableOpacity>
        );
      case 'RETORNO_ALMOCO':
        return (
          <TouchableOpacity
            style={styles.botao}
            onPress={() => registrarPonto('SAIDA')}
            disabled={loading}
          >
            <Icon name="logout" size={24} color="#FFF" />
            <Text style={styles.botaoTexto}>Registrar Saída</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Registro de Ponto</Text>
        <Text style={styles.data}>
          {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </Text>
      </View>

      <View style={styles.content}>
        {ultimoRegistro && (
          <View style={styles.ultimoRegistro}>
            <Text style={styles.ultimoRegistroTitulo}>Último Registro:</Text>
            <Text style={styles.ultimoRegistroTexto}>
              {format(new Date(ultimoRegistro.dataHora), 'HH:mm')} -{' '}
              {ultimoRegistro.tipo.replace('_', ' ')}
            </Text>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#0066CC" />
        ) : (
          renderBotaoPonto()
        )}
      </View>
    </View>
  );
};

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
  titulo: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  data: {
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
  ultimoRegistro: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  ultimoRegistroTitulo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  ultimoRegistroTexto: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  botao: {
    backgroundColor: '#0066CC',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  botaoTexto: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default RegistroPontoScreen; 