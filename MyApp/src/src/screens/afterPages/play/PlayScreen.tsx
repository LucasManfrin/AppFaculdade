"use client"

// Tela de Intro do Quiz

import { useState, useEffect } from "react"
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import { useNavigation } from "@react-navigation/native"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/firebaseConfig"

export default function QuizIntro() {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([])

  // Preload questions when the intro screen mounts
  useEffect(() => {
    // We'll keep this for initial loading, but won't navigate automatically
    preloadQuestions()
  }, [])

  const preloadQuestions = async () => {
    try {
      console.log("Iniciando carregamento de perguntas...")
      const snapshot = await getDocs(collection(db, "perguntas"))

      if (snapshot.empty) {
        console.log("Nenhuma pergunta encontrada no Firestore.")
        Alert.alert("Erro", "Não foi possível encontrar perguntas no banco de dados.")
        setLoading(false)
        return []
      }

      console.log(`Encontradas ${snapshot.docs.length} perguntas.`)

      const perguntasArray = snapshot.docs.map((doc) => {
        const data = doc.data()

        // Get the options and correct answer
        const options = data.alternativas || []
        const correctAnswerIndex = data.resposta || 0
        const correctAnswer = options[correctAnswerIndex]

        // Shuffle the options
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5)

        // Find the new index of the correct answer
        const newCorrectAnswerIndex = shuffledOptions.findIndex((option) => option === correctAnswer)

        return {
          id: doc.id,
          question: data.pergunta,
          options: shuffledOptions,
          answer: newCorrectAnswerIndex,
          originalAnswer: correctAnswer,
        }
      })

      const perguntasEmbaralhadas = perguntasArray.sort(() => Math.random() - 0.5)
      console.log(`Perguntas processadas: ${perguntasEmbaralhadas.length}`)

      setQuestions(perguntasEmbaralhadas)
      return perguntasEmbaralhadas
    } catch (error) {
      console.error("Erro ao carregar perguntas do Firestore:", error)
      Alert.alert("Erro", "Ocorreu um erro ao carregar as perguntas. Por favor, tente novamente.")
      setLoading(false)
      return []
    }
  }

  const handleStartQuiz = async () => {
    setLoading(true)

    try {
      // Always load fresh questions when starting the quiz
      const loadedQuestions = await preloadQuestions()

      if (loadedQuestions.length > 0) {
        console.log(`Navegando para Quiz com ${loadedQuestions.length} perguntas`)
        navigation.navigate("Quiz" , { preloadedQuestions: loadedQuestions })
      } else {
        Alert.alert("Erro", "Não foi possível carregar as perguntas. Por favor, tente novamente.")
      }
    } catch (error) {
      console.error("Erro ao iniciar quiz:", error)
      Alert.alert("Erro", "Ocorreu um erro ao iniciar o quiz. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ImageBackground
      style={styles.background}
      source={{
        uri: "https://i.postimg.cc/G2jJCRbL/Whats-App-Image-2025-04-15-at-13-46-50.jpg",
      }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <FontAwesome5 name="gamepad" size={50} style={styles.icon} />
            <Text style={styles.title}>Bem-vindo ao Quiz!</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Como funciona:</Text>

            <View style={styles.infoItem}>
              <FontAwesome5 name="check-circle" size={20} style={styles.infoIcon} />
              <Text style={styles.infoText}>Responda todas as perguntas para testar seus conhecimentos</Text>
            </View>

            <View style={styles.infoItem}>
              <FontAwesome5 name="clock" size={20} style={styles.infoIcon} />
              <Text style={styles.infoText}>Seu tempo será registrado, então tente responder rapidamente</Text>
            </View>

            <View style={styles.infoItem}>
              <FontAwesome5 name="trophy" size={20} style={styles.infoIcon} />
              <Text style={styles.infoText}>Ao final, você verá sua pontuação e o tempo que levou</Text>
            </View>

            <View style={styles.infoItem}>
              <FontAwesome5 name="random" size={20} style={styles.infoIcon} />
              <Text style={styles.infoText}>As perguntas e respostas são aleatórias a cada tentativa</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.startButtonText}>Iniciar Quiz</Text>
                <FontAwesome5 name="play" size={16} style={styles.buttonIcon} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    paddingTop: 40,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  icon: {
    color: "#125250",
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#125250",
    textAlign: "center",
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: "#125250",
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#125250",
    marginBottom: 15,
    textAlign: "center",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoIcon: {
    color: "#125250",
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  startButton: {
    backgroundColor: "#125250",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#125250",
    width: "80%",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  buttonIcon: {
    color: "#fff",
  },
})