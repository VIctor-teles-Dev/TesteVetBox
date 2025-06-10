import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Inicio from "./screens/Inicio"; // Importa a tela de início
import Create from "./screens/login/Create";
import Login from "./screens/login/Login"; // Importa a tela de login
import TabRoutes from "./routes/Tab.routers"; // Importa as rotas de abas
import EditProfileScreen from "./routes/EditProfileScreen";
import ForgotPassword from "./screens/login/ForgotPassword";



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Inicio"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Inicio" component={Inicio} />
        <Stack.Screen name="Create" component={Create} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="TabRoutes" component={TabRoutes} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: "Esqueci minha senha" }} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ title: "Editar Perfil" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

