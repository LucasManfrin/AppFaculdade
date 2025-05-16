"use client"

import { useState } from "react"
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import { widthPercentageToDP as wp } from "react-native-responsive-screen"
import type { RootStackParamList } from "../../../../App" // Verifique o caminho correto do seu arquivo
import { auth } from "../../../../firebaseConfig"
import { signInWithEmailAndPassword } from 'firebase/auth';

// Tipagem da navegação
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>()
  const [senha, setSenha] = useState("")
  const [email, setEmail] = useState("")
  const [senhaVisivel, setSenhaVisivel] = useState(false)
  const [showError, setShowError] = useState(false)

  // Função de login
  const handleLogin = () => {
    if (email.trim() === "" || senha.trim() === "") {
      setShowError(true)
      return
    }

    setShowError(false)

    // Autenticação com Firebase
    signInWithEmailAndPassword(auth, email, senha)
      .then(() => {
        // Se o login for bem-sucedido, navega para a tela "Navigate"
        navigation.navigate("Navigate")
      })
      .catch((error) => {
        // Mostra erro se o login falhar
        setShowError(true)
        console.error("Erro ao fazer login: ", error.message)
      })
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="automatic"
          >
            <Image
              source={{
                uri: "https://i.postimg.cc/Nj9vjTFL/Whats-App-Image-2025-04-05-at-12-24-57-4.png",
              }}
              style={styles.imagem}
            />

            <View>
              <Text style={styles.inputLabel}>Coloque seu E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite aqui"
                placeholderTextColor="grey"
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.inputLabel2}>Coloque sua senha</Text>
              <View style={styles.senhaContainer}>
                <TextInput
                  style={styles.inputSenha}
                  placeholder="Digite aqui"
                  placeholderTextColor="grey"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!senhaVisivel}
                />
                <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
                  <Ionicons name={senhaVisivel ? "eye-off" : "eye"} size={22} color="grey" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity>
                <Text style={styles.registerStyle} onPress={() => navigation.navigate("Avatar")}>
                  Primeiro Login? Clique aqui
                </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.registerStyle}>Esqueceu a senha?</Text>
              </TouchableOpacity>
            </View>

            {showError && <Text style={styles.error}>E-mail ou senha incorretos!</Text>}

            <TouchableOpacity
              style={styles.startButton}
              onPress={handleLogin} // Função de login ao pressionar o botão
            >
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  inputLabel: {
    alignSelf: "flex-start",
    fontWeight: "600",
    color: "grey",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#08443f",
    color: "grey",
    width: wp("90%"),
    padding: 10,
    height: 45,
  },
  inputLabel2: {
    marginTop: 40,
    alignSelf: "flex-start",
    fontWeight: "600",
    color: "grey",
  },
  startButton: {
    marginTop: 130,
  },
  buttonText: {
    width: wp("85%"),
    height: 45,
    paddingTop: 10,
    borderRadius: 15,
    backgroundColor: "#447f78",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  imagem: {
    width: 330,
    height: 330,
    resizeMode: "contain",
  },
  registerStyle: {
    fontWeight: "bold",
    fontSize: 11,
    color: "grey",
    marginTop: 15,
    marginHorizontal: 30,
    paddingBottom: 20,
  },
  senhaContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#08443f",
    width: wp("90%"),
    paddingRight: 10,
    height: 45,
  },

  inputSenha: {
    flex: 1,
    color: "grey",
    padding: 10,
  },
  error: {
    color: "red",
    alignSelf: "flex-start",
    marginLeft: 30,
    fontSize: 13,
  },
})