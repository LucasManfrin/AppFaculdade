import React, { useEffect, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ImageBackground,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../App';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const Welcome = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [translateY]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: "https://i.postimg.cc/TPb5pF5d/welcome.jpg" }}
        style={styles.imageBackGround}
      >
        <ScrollView
          contentContainerStyle={{ alignItems: "center", paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Créditos primeiro */}
          <View style={styles.creditsContainer}>
            <Text style={styles.creditTitle}>
              FÁBRICA DE SOFTWARE: Desenvolvimento de Websites, Aplicativos e Jogos
            </Text>

            <Text style={styles.creditSub}>Coordenador:</Text>
            <Text style={styles.creditText}>Prof. Dr. Elvio Gilberto da Silva</Text>

            <Text style={styles.creditSub}>Professores Colaboradores:</Text>
            <Text style={styles.creditText}>• Profa. Camila Pellizon Floret</Text>
            <Text style={styles.creditText}>• Prof. Luís Filipe Grael Tinós</Text>

            <Text style={styles.creditSub}>Participantes do Projeto:</Text>
            <Text style={styles.creditText}>• Lucas Manfrin Batista</Text>
            <Text style={styles.creditText}>• Gabriel Inowe Pescatori Dutra</Text>
            <Text style={styles.creditText}>• Gabriel Souza Lopes</Text>
            <Text style={styles.creditText}>• Eduardo Henrique Sidronio de Araujo</Text>

            <Text style={styles.creditSub}>Apoio:</Text>
            <Image
              source={{
                uri: "https://unisagrado.edu.br/uploads/2008/logotipos/monoliticas_unisagrado/2025/extens%C3%A3o.jpg",
              }}
              style={styles.logoExtensao}
              resizeMode="contain"
            />
          </View>

          {/* Mensagem original do app */}
          <Animated.Text
            style={[styles.welcomeText, { transform: [{ scale: scaleAnim }] }]}
          >
            Olá! {"\n"}Bem-vindo ao nosso App!
          </Animated.Text>

          <Animated.Text
            style={[styles.secondText, { transform: [{ scale: scaleAnim }] }]}
          >
            Esse é um projeto feito por alunos da Unisagrado, com o intuito de ajudá-los a estudar de uma forma assertiva e descontraída! {"\n"}E aí, bora lá?
          </Animated.Text>

          {/* Botão */}
          <Animated.View style={{ transform: [{ translateY }] }}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Navigate')}>
              <Text style={styles.buttonText}>Vamos começar</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  imageBackGround: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 390,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    color: "#0d4941",
    marginTop: 30,
  },
  secondText: {
    fontSize: 25,
    marginTop: 80,
    color: "#0d4941",
    marginHorizontal: 10,
    textAlign: "center",
  },
  button: {
    marginTop: 60,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    backgroundColor: "#176c65",
    padding: 14,
    borderRadius: 29,
    textAlign: "center",
  },
  creditsContainer: {
    backgroundColor: "rgba(255,255,255,0.9)",
    marginTop: 35,
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 15,
  },
  creditTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0d4941",
    textAlign: "center",
    marginBottom: 10,
  },
  creditSub: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0d4941",
    marginTop: 10,
  },
  creditText: {
    fontSize: 15,
    color: "#0d4941",
    marginTop: 3,
    marginLeft: 5,
  },
  logoExtensao: {
    width: 200,
    height: 80,
    marginTop: 15,
    alignSelf: "center",
  },
});
