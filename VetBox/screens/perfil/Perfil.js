import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
  

export default function Perfil({ navigation }) {
 

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={require('../../assets/LogoVet.jpeg')} // Altere para o caminho do seu logo
          style={styles.profileImage}
        />
        <Text style={styles.userName}>Nome do Usuário</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('ModificarDados')}
        >
          <Text style={styles.optionText}>Modificar Dados</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('Notificacoes')}
        >
          <Text style={styles.optionText}>Notificações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => {
            // Aqui você pode adicionar a lógica de logout
            console.log('Usuário deslogado');
            navigation.navigate('Inicio'); // Redireciona para a tela de início
          }}
        >
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.Back}
          onPress={() => navigation.goBack()} 
        >
         
          <Image
            source={require('../../assets/flecha.png')} // Altere para o caminho do seu ícone de voltar
            style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const primaryColor = 'rgb(84, 177, 84)';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 50,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#54B154',
  },
  optionsContainer: {
    marginTop: 40,
    paddingHorizontal: 30,
    gap: 15,
  },
  optionButton: {
    backgroundColor: 'rgb(84, 177, 84)',
    paddingVertical: 15,
    paddingHorizontal: 20,
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
    borderWidth: 1,
    borderColor: primaryColor,
    width: '100%',
    height: 60,
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },

  logoutText: {
    color: 'primaryColor',
    textAlign: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 100, // Tornar a imagem circular
  },
  Back: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 100,
    marginTop: 30,
    alignItems: 'center',
    width: 50,
    height: 50,
    marginLeft: 'auto',
    
  },
});
