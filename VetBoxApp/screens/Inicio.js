import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function Inicio({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.topCurve}>
        <Image
          source={require('../assets/LogoVet.jpeg')} // Altere para o caminho do seu logo
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>VetBox</Text>
        <Text style={styles.slogan}>PENSE FORA DA CAIXA</Text>
      </View>

      <View style={styles.buttonContainer}>
     

<TouchableOpacity
  style={styles.outlinedButton}
  onPress={() => navigation.navigate('Create')} //create profile screen
>
  <Text style={styles.outlinedButtonText}>Crie seu Perfil</Text>
</TouchableOpacity>

          
      

        <TouchableOpacity
          style={styles.filledButton}
          onPress={() => navigation.navigate('')} //home screen
        >
          <Text style={styles.filledButtonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const primaryColor = '#54B154'; // Verde base do logo 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  topCurve: {
    backgroundColor: primaryColor,
    height: '50%',
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    alignItems: 'center',
    paddingTop: 60, 
  },

  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
	borderRadius: 100, // Tornar a imagem circular
  },

  slogan: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 5,
  },

  buttonContainer: {
    marginTop: 60,
    alignItems: 'center',
  },

  outlinedButton: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 10,
    borderColor: primaryColor,
    borderWidth: 2,
    marginBottom: 20,
    alignItems: 'center',
  },

  outlinedButtonText: {
    color: primaryColor,
    fontSize: 16,
    fontWeight: '600',
  },

  filledButton: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: primaryColor,
    alignItems: 'center',
  },

  filledButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  title: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
