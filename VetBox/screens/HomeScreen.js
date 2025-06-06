import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text } from '@rneui/themed';




export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
       <Image
  source={require('../assets/LogoVet.jpeg')} // Caminho para a imagem do logo
  style={styles.logo}
  resizeMode="contain"
/>
      <Text h4 style={{ marginBottom: 70}}>Bem-vindo à Home</Text>
      <Button
        title="Ir para Quiz"
        onPress={() => navigation.navigate('Quiz')}
        buttonStyle={styles.button}
      />
      <Button 
        title="Ir para Perfil"
        onPress={() => navigation.navigate('Perfil')}
        buttonStyle={styles.button}
      />
      <Button
        title="Voltar ao Início"
        onPress={() => navigation.navigate('Inicio')}
        buttonStyle={[styles.button, { backgroundColor: '#555' }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 25,
    
  },
  button: {
    backgroundColor: '#54B154',
    borderRadius: 30,
    marginVertical: 10,
    paddingHorizontal: 30,
  },
   logo: {
    width: 150,
    height: 150,
    marginBottom: 150,
	borderRadius: 100, // Tornar a imagem circular
  },

});
