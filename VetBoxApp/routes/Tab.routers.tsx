import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedScreen from "./FeedScreen";
import ProfileScreen from "./ProfileScreen";
import Icon from "react-native-vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import DicasDeVet from "./Tips";
import Quiz from "./Quiz";
import NewPost from "./NewPost";



const Tab = createBottomTabNavigator();

export default function TabRoutes({route}) {
    const userId = route?.params?.userId;
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,

        headerTintColor: "#333",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "500",
        },
        tabBarIconStyle: {
          color: "#000",
        },
        tabBarActiveTintColor: "#54B154",
        tabBarInactiveTintColor: "#aaa",
      }}
    >
    
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        initialParams={{ userId }}
        key={userId || "feed"}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={24} color={color} />
          ),
          headerShown: true,
          headerStyle: {
            backgroundColor: "#f8f8f8",
            elevation: 0,
          },
          headerTitle: "Para Você",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#333",
          },
        }}
      />
        <Tab.Screen
        name="NewPost"
        component={NewPost}
        initialParams={{ userId }}
        key={userId || "newpost"}
        options={{
          tabBarLabel: "Novo Post",
          tabBarIcon: ({ color }) => (
            <Icon name="add-circle-outline" size={24} color={color} />
          ),
          headerShown: true,
          headerStyle: {
            backgroundColor: "#f8f8f8",
            elevation: 0,
          },
          headerTitle: "Novo Post",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#333",
          },
        }}
      />
     
      <Tab.Screen
        name="Tips"
        component={DicasDeVet}
        options={{
          tabBarLabel: "Dicas",
          tabBarIcon: ({ color }) => (
            <Icon name="lightbulb" size={24} color={color} />
          ),
          headerShown: true,
          headerStyle: {
            backgroundColor: "#f8f8f8",
            elevation: 0,
          },
          headerTitle: "Dicas",
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="Quiz"
        component={Quiz}
        options={{
          tabBarLabel: "Quiz",
          tabBarIcon: ({ color }) => (
            <Icon name="quiz" size={24} color={color} />
          ),
          headerShown: true,
          headerStyle: {
            backgroundColor: "#f8f8f8",
            elevation: 0,
          },
          headerTitle: "Quiz",
          headerTitleAlign: "center",
        }} />
       {/* Define a mock user object or retrieve it from context/store as needed */}
       {/*
         Replace the value below with your logic to get the current user's ID.
         For now, using a mock value '1'.
       */}
       <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ userId }}
        key={userId || "profile"} // força remontagem ao trocar userId
        options={{
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
