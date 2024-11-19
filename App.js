import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function App() {
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');

  const buscarEndereco = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const data = response.data;
      if (data.erro) {
        Alert.alert('Erro', 'CEP não encontrado');
      } else {
        setEndereco(`${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar CEP');
    }
  };

  const handleSubmit = async () => {
    if (!cpf || !nome || !idade || !endereco) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/users', {
        cpf, nome, idade, endereco
      });
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao cadastrar usuário');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuário</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
      />
      <TextInput
        style={styles.input}
        placeholder="Idade"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="CEP"
        value={cep}
        onChangeText={(text) => {
          setCep(text);
          if (text.length === 8) {
            buscarEndereco(text);
          }
        }}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Endereço"
        value={endereco}
        editable={false}
      />

      <Button title="Cadastrar" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
