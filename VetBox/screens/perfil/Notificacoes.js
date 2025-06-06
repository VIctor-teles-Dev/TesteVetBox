import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

const notificacoes = [
  { id: '1', titulo: 'Bem-vindo ao VetBox!' },
  { id: '2', titulo: 'Sua conta foi atualizada com sucesso.' },
];

export default function Notificacoes({ navigation }) {
  return (
    <View style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.title}>Notificações</Text>
      <FlatList
        data={notificacoes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.notificationText}>{item.titulo}</Text>
          </View>
        )}
      />
    </View>
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Image
                    source={require('../../assets/flecha.png')} 
                    style={{  justifyContent: 'center', alignItems: 'center' }}
                    resizeMode="contain"
                  />
      </TouchableOpacity>
    </View>
    </View>
  );
}

const primaryColor = '#54B154'; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    color: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 20,
    textAlign: 'center',
    
  },
  notificationItem: {
    backgroundColor: primaryColor,
    padding: 15,
    borderRadius: 10,
    marginTop: 60,
  
  },
  notificationText: {
    color: primaryColor,
    fontSize: 16,
      color: '#fff',
  },
  button: {
    borderRadius: 100,
    alignItems: 'center',
    width: 50,
    height: 50,
    marginLeft: 'auto',
    
  },
});
