
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function ModificarDados({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');

  const salvarAlteracoes = () => {
    // Aqui você pode integrar com Firebase ou outro backend
    Alert.alert('Sucesso', 'Seus dados foram atualizados!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modificar Dados</Text>

      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={salvarAlteracoes}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
 
    </View>
    
    
  );
}

const primaryColor = '#54B154'; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: primaryColor,
    marginBottom: 30,
    alignSelf: 'center',
  },
  input: {
    alignSelf: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: primaryColor,
    borderRadius: 8,
    marginBottom: 20,
    width: '75%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
  },
  button: {
    backgroundColor: primaryColor,
    marginTop: 30,
    borderRadius: 70,
    height: 30,
    width: '30%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 5,
    borderWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
