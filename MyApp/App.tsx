import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // rodando sem problemas
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // rodando sem problemas
import { UserProvider } from "./userContext"

// Telas do Lopes

import LoginScreen from './src/src/screens/auth/LoginScreen';
import AvatarScreen from './src/src/screens/auth/AvatarScreen';
import BarNavigate from './src/src/screens/afterPages/barNavigate/BarNavigate';
import WelcomeScreen from './src/src/screens/auth/WelcomeScreen';
import Study1Screen from './src/src/screens/afterPages/studies/Study1Screen';
import Study2Screen from './src/src/screens/afterPages/studies/Study2Screen';
import Study3Screen from './src/src/screens/afterPages/studies/Study3Screen';
import Study4Screen from './src/src/screens/afterPages/studies/Study4Screen';
import Study5Screen from './src/src/screens/afterPages/studies/Study5Screen';

// Telas do Lucas e JAPONES SAFADO

import Quiz from './src/src/screens/afterPages/quiz/QuizScreen';
import Resultado from './src/src/screens/afterPages/results/ResultScreen';
import QuizIntro from './src/src/screens/afterPages/play/PlayScreen';
import PasswordResetScreen from './src/src/screens/auth/PasswordResetScreen';


export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Avatar: undefined;
  Welcome: undefined;
  Navigate: undefined;
  Studies: undefined;
  Study1: undefined;
  Study2: undefined;
  Study3: undefined;
  Study4: undefined;
  Study5: undefined;
  Quiz: undefined;
  Resultado: undefined;
  QuizIntro: undefined;
  PasswordReset: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Rotas = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
          <Stack.Screen name="Avatar" component={AvatarScreen} />
          <Stack.Screen name="Navigate" component={BarNavigate} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Study1" component={Study1Screen} />
          <Stack.Screen name="Study2" component={Study2Screen} />
          <Stack.Screen name="Study3" component={Study3Screen} />
          <Stack.Screen name="Study4" component={Study4Screen} />
          <Stack.Screen name="Study5" component={Study5Screen} />
          <Stack.Screen name="Quiz" component = {Quiz} />
          <Stack.Screen name="Resultado" component ={Resultado} />
          <Stack.Screen name="QuizIntro" component ={QuizIntro} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default Rotas;

