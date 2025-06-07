import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import UserImage from '../../assets/User.png'; // Certifique-se de que o caminho está correto

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log(`Login attempt with email: ${email}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.purpleBackground}></View>
          <Image source={UserImage} style={styles.UserImage} />
        <Text style={styles.title}>Bem vindo(a) de volta!</Text>
      </View>

      <View style={styles.container2}>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <TextInput
            placeholder="E-mail"
            placeholderTextColor="#aaa"
            style={styles.inputField}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <MaterialCommunityIcons name="email-outline" size={24} color= {primaryColor} style={styles.inputIcon} />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#aaa"
            style={styles.inputField}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconButton}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color= {primaryColor} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgot}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>

        <Text style={styles.register}>
          Ainda não tem uma conta?{' '}
          <Text style={styles.registerLink} onPress={() => navigation.navigate('Create')}>
            Cadastrar
          </Text>
        </Text>
      </View>
    </View>
    </View>
  );
}

const primaryColor = '#54B154'; // Verde base do logo

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',

  },

  container2 : {
    alignItems: 'center',
    justifyContent: 'center',
  },

 
  top: {

    alignItems: 'center',
    
  
  },
  
  UserImage: {
    width: 64,
    height: 64,
    marginBottom: 10,
   

  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 50,
    padding: 10,
    paddingHorizontal: 20,
   
   


  
  },

  form: {
   
  marginBottom: 150,
    width: '80%',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 10,
    marginBottom: 15,
  },

  inputField: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },

  inputIcon: {
    marginLeft: 8,
  },

  iconButton: {
    padding: 5,
  },

  forgot: {
    color: primaryColor,
    textAlign: 'right',
    marginBottom: 20,
  },

  loginButton: {
    backgroundColor: primaryColor,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },

  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  register: {
    textAlign: 'center',
    color: '#555',
  },

  registerLink: {
    color: primaryColor,
    fontWeight: 'bold',
  },
});
