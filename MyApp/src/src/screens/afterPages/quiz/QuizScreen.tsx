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
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import { collection, getDocs } from "firebase/firestore"
import { db, auth } from "@/firebaseConfig"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { doc, setDoc, getDoc } from "firebase/firestore";


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
    // Fade in animation when question changes
    fadeAnim.setValue(0)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
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
  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedOption === currentQuestion.answer;

  if (isCorrect) {
    setCorrectAnswers(correctAnswers + 1);
  }

  const newAnswers = [
    ...answers,
    {
      question: currentQuestion.question,
      selectedOption: currentQuestion.options[selectedOption],
      correctOption: currentQuestion.originalAnswer,
      isCorrect: isCorrect,
    },
  ];

  if (currentQuestionIndex < questions.length - 1) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedOption(null);
    setAnswers(newAnswers);
  } else {
    stopTimer();

    const finalCorrectAnswers = isCorrect ? correctAnswers + 1 : correctAnswers;
    const scorePercentage = Math.round((finalCorrectAnswers / questions.length) * 100);

    try {
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;

        // === Buscar nome e avatar ===
        const userDocRef = doc(db, "users", userId);
        const userSnap = await getDoc(userDocRef);

        let nome = "Anônimo";
        let avatar = "https://i.postimg.cc/FHRCKxp4/user-1.png";

        if (userSnap.exists()) {
          const userData = userSnap.data();
          nome = userData.nickname || nome;
          avatar = userData.avatar || avatar;
        }

        // === Criar objeto de resultado ===
        const resultadoAtual = {
          acertos: finalCorrectAnswers,
          tempo: elapsedTime,
          data: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
          nome,
          avatar,
        };

        // === Salvar em 'ultimo' ===
        const ultimoRef = doc(db, "users", userId, "resultados", "ultimo");
        await setDoc(ultimoRef, resultadoAtual);
        console.log("Resultado salvo em 'ultimo'!");

        // === Verificar e salvar em 'melhor' ===
        const melhorRef = doc(db, "users", userId, "resultados", "melhor");
        const melhorSnap = await getDoc(melhorRef);

        let deveAtualizarMelhor = false;

        if (!melhorSnap.exists()) {
          deveAtualizarMelhor = true;
        } else {
          const melhorAnterior = melhorSnap.data();
          if (
            resultadoAtual.acertos > melhorAnterior.acertos ||
            (resultadoAtual.acertos === melhorAnterior.acertos &&
              resultadoAtual.tempo < melhorAnterior.tempo)
          ) {
            deveAtualizarMelhor = true;
          }
        }

        if (deveAtualizarMelhor) {
          await setDoc(melhorRef, resultadoAtual);
          console.log("Novo melhor resultado salvo!");
        } else {
          console.log("Resultado não superou o melhor anterior.");
        }
      } else {
        console.warn("Usuário não autenticado. Resultado não foi salvo.");
      }
    } catch (error) {
      console.error("Erro ao salvar resultados:", error);
      Alert.alert("Erro", "Não foi possível salvar os resultados no banco de dados.");
    }

    // === Navegar para tela de resultado ===
    navigation.navigate("Resultado", {
      correctAnswers: finalCorrectAnswers,
      totalQuestions: questions.length,
      timeTaken: elapsedTime,
      scorePercentage,
      answers: newAnswers,
    });
  }
};




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
          <ActivityIndicator size="large" color="#125250" />
          <Text style={styles.loadingText}>Carregando perguntas...</Text>
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
          <FontAwesome5 name="exclamation-circle" size={50} style={{ color: "#e74c3c", marginBottom: 20 }} />
          <Text style={styles.loadingText}>Não foi possível carregar as perguntas.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <ImageBackground
      style={styles.background}
      source={{
        uri: "https://i.postimg.cc/G2jJCRbL/Whats-App-Image-2025-04-15-at-13-46-50.jpg",
      }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(30, insets.bottom + 20) }]}>
          <View style={styles.timerContainer}>
            <FontAwesome5 name="clock" size={18} style={styles.timerIcon} />
            <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
          </View>

          <Animated.View style={[styles.questionCard, { opacity: fadeAnim }]}>
            <View style={styles.questionHeader}>
              <Text style={styles.progressText}>
                Pergunta {currentQuestionIndex + 1} de {questions.length}
              </Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            </View>

            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.optionButton, selectedOption === index && styles.selectedOption]}
                  onPress={() => handleOptionSelect(index)}
                >
                  <Text style={[styles.optionText, selectedOption === index && styles.selectedOptionText]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          <TouchableOpacity
            style={[
              styles.nextButton,
              selectedOption === null && styles.disabledButton,
              { marginBottom: insets.bottom > 0 ? insets.bottom : 10 },
            ]}
            onPress={handleNextQuestion}
            disabled={selectedOption === null}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex < questions.length - 1 ? "Próxima Pergunta" : "Ver Resultados"}
            </Text>
            <FontAwesome5
              name={currentQuestionIndex < questions.length - 1 ? "arrow-right" : "trophy"}
              size={16}
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = {
  background: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    paddingTop: 40,
    color: "#cafaef"
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#125250",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#125250",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#125250",
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
  questionCard: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#125250",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  questionHeader: {
    width: "100%",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#125250",
    paddingBottom: 15,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#125250",
    marginBottom: 8,
    textAlign: "center",
  },
  progressBarContainer: {
    alignItems: "center",
  },
  progressBar: {
    height: 10,
    width: "100%",
    backgroundColor: "#cbcdcc",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#125250", // aqyudad
    borderRadius: 5,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#125250",
    textAlign: "center",
    marginBottom: 20,
  },
  optionsContainer: {
    width: "100%",
    marginTop: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 15,
    borderWidth: 2,
    borderColor: "#125250",
  },
  optionButton: {
    backgroundColor: "#cbcdcc",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#cbcdcc",
  },
  selectedOption: {
    backgroundColor: "rgba(18, 82, 80, 0.2)",
    borderColor: "#125250",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  selectedOptionText: {
    color: "#125250",
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#125250",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#125250",
  },
  disabledButton: {
    backgroundColor: "#cbcdcc",
    borderColor: "#cbcdcc",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  buttonIcon: {
    color: "#fff",
  },
}
