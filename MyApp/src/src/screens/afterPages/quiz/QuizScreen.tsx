"use client"

// Tela do Quiz

import React, { useEffect, useState, useRef } from "react"
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Alert,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import { LinearGradient } from "expo-linear-gradient"
import { collection, getDocs } from "firebase/firestore"
import { db, auth } from "@/firebaseConfig"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { doc, setDoc, getDoc } from "firebase/firestore"

const { width } = Dimensions.get("window")

export default function Quiz() {
  const route = useRoute()
  const { preloadedQuestions } = route.params || {}
  const insets = useSafeAreaInsets()

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const navigation = useNavigation()
  const [answers, setAnswers] = useState([])

  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0)
  const timerInterval = useRef(null)

  // Animation for the question card
  const fadeAnim = React.useRef(new Animated.Value(0)).current
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current

  // Load questions on component mount
  useEffect(() => {
    console.log("Quiz component mounted")

    // Check if we have preloaded questions
    if (preloadedQuestions && preloadedQuestions.length > 0) {
      console.log(`Recebidas ${preloadedQuestions.length} perguntas pré-carregadas`)
      setQuestions(preloadedQuestions)
      setLoading(false)
      startTimer()
    } else {
      console.log("Nenhuma pergunta pré-carregada, carregando do Firestore...")
      // If no preloaded questions, load them directly
      loadQuestionsDirectly()
    }

    // Clean up timer on unmount
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current)
      }
    }
  }, [preloadedQuestions])

  // Load questions directly from Firestore if preloading failed
  const loadQuestionsDirectly = async () => {
    try {
      setLoading(true)
      const snapshot = await getDocs(collection(db, "perguntas"))

      if (snapshot.empty) {
        console.log("Nenhuma pergunta encontrada no Firestore.")
        Alert.alert("Erro", "Não foi possível encontrar perguntas no banco de dados.")
        setLoading(false)
        return
      }

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
      console.log(`Carregadas ${perguntasEmbaralhadas.length} perguntas diretamente`)

      setQuestions(perguntasEmbaralhadas)
      setLoading(false)
      startTimer()
    } catch (error) {
      console.error("Erro ao carregar perguntas do Firestore:", error)
      Alert.alert("Erro", "Ocorreu um erro ao carregar as perguntas. Por favor, tente novamente.")
      setLoading(false)
      navigation.goBack()
    }
  }

  useEffect(() => {
    // Fade in and scale animation when question changes
    fadeAnim.setValue(0)
    scaleAnim.setValue(0.95)

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()
  }, [currentQuestionIndex])

  const startTimer = () => {
    console.log("Iniciando cronômetro")
    timerInterval.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current)
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleOptionSelect = (index) => {
    setSelectedOption(index)
  }

  const handleNextQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = selectedOption === currentQuestion.answer

    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1)
    }

    const newAnswers = [
      ...answers,
      {
        question: currentQuestion.question,
        selectedOption: currentQuestion.options[selectedOption],
        correctOption: currentQuestion.originalAnswer,
        isCorrect: isCorrect,
      },
    ]

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOption(null)
      setAnswers(newAnswers)
    } else {
      stopTimer()

      const finalCorrectAnswers = isCorrect ? correctAnswers + 1 : correctAnswers
      const scorePercentage = Math.round((finalCorrectAnswers / questions.length) * 100)

      try {
        const user = auth.currentUser

        if (user) {
          const userId = user.uid

          // === Buscar nome e avatar ===
          const userDocRef = doc(db, "users", userId)
          const userSnap = await getDoc(userDocRef)

          let nome = "Anônimo"
          let avatar = "https://i.postimg.cc/FHRCKxp4/user-1.png"

          if (userSnap.exists()) {
            const userData = userSnap.data()
            nome = userData.nickname || nome
            avatar = userData.avatar || avatar
          }

          // === Criar objeto de resultado ===
          const resultadoAtual = {
            acertos: finalCorrectAnswers,
            tempo: elapsedTime,
            data: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
            nome,
            avatar,
          }

          // === Salvar em 'ultimo' ===
          const ultimoRef = doc(db, "users", userId, "resultados", "ultimo")
          await setDoc(ultimoRef, resultadoAtual)
          console.log("Resultado salvo em 'ultimo'!")

          // === Verificar e salvar em 'melhor' ===
          const melhorRef = doc(db, "users", userId, "resultados", "melhor")
          const melhorSnap = await getDoc(melhorRef)

          let deveAtualizarMelhor = false

          if (!melhorSnap.exists()) {
            deveAtualizarMelhor = true
          } else {
            const melhorAnterior = melhorSnap.data()
            if (
              resultadoAtual.acertos > melhorAnterior.acertos ||
              (resultadoAtual.acertos === melhorAnterior.acertos && resultadoAtual.tempo < melhorAnterior.tempo)
            ) {
              deveAtualizarMelhor = true
            }
          }

          if (deveAtualizarMelhor) {
            await setDoc(melhorRef, resultadoAtual)
            console.log("Novo melhor resultado salvo!")
          } else {
            console.log("Resultado não superou o melhor anterior.")
          }
        } else {
          console.warn("Usuário não autenticado. Resultado não foi salvo.")
        }
      } catch (error) {
        console.error("Erro ao salvar resultados:", error)
        Alert.alert("Erro", "Não foi possível salvar os resultados no banco de dados.")
      }

      // === Navegar para tela de resultado ===
      navigation.navigate("Resultado", {
        correctAnswers: finalCorrectAnswers,
        totalQuestions: questions.length,
        timeTaken: elapsedTime,
        scorePercentage,
        answers: newAnswers,
      })
    }
  }

  // Show loading indicator while questions are being loaded
  if (loading) {
    return (
      <ImageBackground
        style={styles.background}
        source={{
          uri: "https://i.postimg.cc/G2jJCRbL/Whats-App-Image-2025-04-15-at-13-46-50.jpg",
        }}
      >
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#125250" />
            <Text style={styles.loadingText}>Carregando perguntas...</Text>
          </View>
        </View>
      </ImageBackground>
    )
  }

  // If questions are loaded but empty, show error
  if (questions.length === 0) {
    return (
      <ImageBackground
        style={styles.background}
        source={{
          uri: "https://i.postimg.cc/G2jJCRbL/Whats-App-Image-2025-04-15-at-13-46-50.jpg",
        }}
      >
        <View style={styles.loadingContainer}>
          <View style={styles.errorCard}>
            <FontAwesome5 name="exclamation-circle" size={50} style={{ color: "#e74c3c", marginBottom: 20 }} />
            <Text style={styles.errorText}>Não foi possível carregar as perguntas.</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.retryButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <ImageBackground
      style={styles.background}
      source={{
        uri: "https://i.postimg.cc/G2jJCRbL/Whats-App-Image-2025-04-15-at-13-46-50.jpg",
      }}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(30, insets.bottom + 20) }]}>
          <View style={styles.header}>
            <View style={styles.timerContainer}>
              <FontAwesome5 name="clock" size={18} style={styles.timerIcon} />
              <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
            </View>

            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>
                Pergunta {currentQuestionIndex + 1} de {questions.length}
              </Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <Animated.View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.progressMarkers}>
              {questions.map((_, index) => (
                <View
                  key={index}
                  style={[styles.progressMarker, index <= currentQuestionIndex ? styles.progressMarkerActive : {}]}
                />
              ))}
            </View>
          </View>

          <Animated.View
            style={[
              styles.questionCardContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={["rgba(255, 255, 255, 0.95)", "rgba(240, 240, 240, 0.95)"]}
              style={styles.questionCard}
            >
              <Text style={styles.questionText}>{currentQuestion.question}</Text>

              <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.optionButton, selectedOption === index && styles.selectedOption]}
                    onPress={() => handleOptionSelect(index)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.optionContent}>
                      <View style={[styles.optionBullet, selectedOption === index && styles.selectedOptionBullet]}>
                        <Text
                          style={[styles.optionBulletText, selectedOption === index && styles.selectedOptionBulletText]}
                        >
                          {String.fromCharCode(65 + index)}
                        </Text>
                      </View>
                      <Text style={[styles.optionText, selectedOption === index && styles.selectedOptionText]}>
                        {option}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>
          </Animated.View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.nextButton,
                selectedOption === null && styles.disabledButton,
                { marginBottom: insets.bottom > 0 ? insets.bottom : 10 },
              ]}
              onPress={handleNextQuestion}
              disabled={selectedOption === null}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={selectedOption === null ? ["#BDBDBD", "#9E9E9E"] : ["#125250", "#0D3D3B"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.nextButtonText}>
                  {currentQuestionIndex < questions.length - 1 ? "Próxima Pergunta" : "Ver Resultados"}
                </Text>
                <FontAwesome5
                  name={currentQuestionIndex < questions.length - 1 ? "arrow-right" : "trophy"}
                  size={16}
                  style={styles.buttonIcon}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = {
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    width: "100%",
    paddingTop: StatusBar.currentHeight || 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  timerIcon: {
    color: "#125250",
    marginRight: 8,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#125250",
  },
  progressTextContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#125250",
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#125250",
    borderRadius: 4,
  },
  progressMarkers: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  progressMarker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  progressMarkerActive: {
    backgroundColor: "#125250",
  },
  questionCardContainer: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  questionCard: {
    borderRadius: 20,
    padding: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#125250",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 28,
  },
  optionsContainer: {
    width: "100%",
  },
  optionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(18, 82, 80, 0.2)",
    overflow: "hidden",
  },
  selectedOption: {
    backgroundColor: "rgba(18, 82, 80, 0.1)",
    borderColor: "#125250",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  optionBullet: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  selectedOptionBullet: {
    backgroundColor: "#125250",
  },
  optionBulletText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  selectedOptionBulletText: {
    color: "#FFF",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  selectedOptionText: {
    color: "#125250",
    fontWeight: "500",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  nextButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  buttonIcon: {
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#125250",
    marginTop: 20,
    textAlign: "center",
  },
  errorCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#125250",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
}
