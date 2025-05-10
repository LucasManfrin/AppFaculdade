// Tela Resultado

import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, ImageBackground, StyleSheet } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import HomeScreen from "../home/HomeScreen"

export default function Resultado() {
  const navigation = useNavigation()
  const route = useRoute()
  const insets = useSafeAreaInsets()

  const { correctAnswers, totalQuestions, timeTaken, scorePercentage, answers } = route.params || {}

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getFeedback = () => {
    if (scorePercentage >= 90) {
      return {
        icon: "crown",
        title: "Excelente!",
        message: "Você é um verdadeiro mestre! Seu conhecimento é impressionante.",
        color: "#125250"
        // color: "#e5cb26", // Gold
      }
    } else if (scorePercentage >= 70) {
      return {
        icon: "star",
        title: "Muito Bom!",
        message: "Você tem um ótimo conhecimento! Continue assim.",
        color: "#125250"
        // color: "#125250", // Teal
      }
    } else if (scorePercentage >= 50) {
      return {
        icon: "thumbs-up",
        title: "Bom Trabalho!",
        message: "Você está no caminho certo, mas ainda há espaço para melhorar.",
        color: "#125250"
        // color: "#3498db", // Blue
      }
    } else {
      return {
        icon: "book",
        title: "Continue Estudando!",
        message: "Não desanime! Com mais estudo, você vai melhorar.",
        color: "#125250"
        // color: "#e74c3c", // Red
      }
    }
  }

  const feedback = getFeedback()

  const handleTryAgain = () => {
    navigation.navigate("QuizIntro")
  }


  return (
    <ImageBackground
      style={styles.background}
      source={{
        uri: "https://i.postimg.cc/G2jJCRbL/Whats-App-Image-2025-04-15-at-13-46-50.jpg",
      }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(30, insets.bottom + 20) }]}>
          <View style={styles.headerContainer}>
            <FontAwesome5 name="trophy" size={50} style={styles.trophyIcon} />
            <Text style={styles.headerTitle}>Resultados do Quiz</Text>
          </View>

          <View style={styles.scoreContainer}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{scorePercentage}%</Text>
            </View>
            <View style={styles.scoreDetails}>
              <View style={styles.scoreRow}>
                <FontAwesome5 name="check" size={16} style={[styles.scoreIcon, { color: "#2ecc71" }]} />
                <Text style={styles.scoreLabel}>Acertos:</Text>
                <Text style={styles.scoreValue}>
                  {correctAnswers} de {totalQuestions}
                </Text>
              </View>
              <View style={styles.scoreRow}>
                <FontAwesome5 name="clock" size={16} style={[styles.scoreIcon, { color: "#f39c12" }]} />
                <Text style={styles.scoreLabel}>Tempo:</Text>
                <Text style={styles.scoreValue}>{formatTime(timeTaken)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.feedbackContainer}>
            <FontAwesome5 name={feedback.icon} size={30} style={[styles.feedbackIcon, { color: feedback.color }]} />
            <Text style={[styles.feedbackTitle, { color: feedback.color }]}>{feedback.title}</Text>
            <Text style={styles.feedbackMessage}>{feedback.message}</Text>
          </View>

          <View style={styles.answersContainer}>
            <Text style={styles.answersTitle}>Resumo das Respostas</Text>

            {answers.map((answer, index) => (
              <View
                key={index}
                style={[styles.answerItem, answer.isCorrect ? styles.correctAnswer : styles.incorrectAnswer]}
              >
                <View style={styles.answerHeader}>
                  <Text style={styles.questionNumber}>Pergunta {index + 1}</Text>
                  <FontAwesome5
                    name={answer.isCorrect ? "check-circle" : "times-circle"}
                    size={18}
                    style={{
                      color: answer.isCorrect ? "#2ecc71" : "#e74c3c",
                    }}
                  />
                </View>
                <Text style={styles.answerQuestion}>{answer.question}</Text>

                {/* Modified answer detail layout to prevent overflow */}
                <View style={styles.answerDetail}>
                  <Text style={styles.answerLabel}>Sua resposta:</Text>
                </View>
                <View style={styles.answerValueContainer}>
                  <Text style={[styles.answerValue, { color: answer.isCorrect ? "#125250" : "#e74c3c" }]}>
                    {answer.selectedOption}
                  </Text>
                </View>

                {!answer.isCorrect && (
                  <>
                    <View style={styles.answerDetail}>
                      <Text style={styles.answerLabel}>Resposta correta:</Text>
                    </View>
                    <View style={styles.answerValueContainer}>
                      <Text style={[styles.answerValue, { color: "#125250" }]}>{answer.correctOption}</Text>
                    </View>
                  </>
                )}
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.tryAgainButton, { marginBottom: insets.bottom > 0 ? insets.bottom : 10 }]}
            onPress={handleTryAgain}
          >
            <Text style={styles.tryAgainText}>Tentar Novamente</Text>
            <FontAwesome5 name="redo" size={16} style={styles.buttonIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tryAgainButton, { marginBottom: insets.bottom > 0 ? insets.bottom : 10 }]}
            onPress={() => navigation.navigate('Navigate')}
          >
            <Text style={styles.tryAgainText}>Voltar</Text>
            <FontAwesome5 name="home" size={16} style={styles.buttonIcon} />
          </TouchableOpacity>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  trophyIcon: {
    color: "#e5cb26",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#125250",
    textAlign: "center",
  },
  scoreContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: "#125250",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#125250",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  scoreText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  scoreDetails: {
    flex: 1,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  scoreIcon: {
    marginRight: 8,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 5,
  },
  scoreValue: {
    fontSize: 16,
    color: "#333",
  },
  feedbackContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: "#125250",
    marginBottom: 20,
    alignItems: "center",
  },
  feedbackIcon: {
    marginBottom: 10,
  },
  feedbackTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  feedbackMessage: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  answersContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: "#125250",
    marginBottom: 20,
  },
  answersTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#125250",
    marginBottom: 15,
    textAlign: "center",
  },
  answerItem: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#125250",
    // borderLeftWidth: 5,
  },
  correctAnswer: { // resposta certa
    backgroundColor: "#89ffd7"
    // borderLeftColor: "#2ecc71", 
  },
  incorrectAnswer: { // respota errada
    backgroundColor: "#f9b5c2"
    // borderLeftColor: "#e74c3c", 
  },
  answerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  answerQuestion: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  answerDetail: {
    marginBottom: 2,
  },
  answerLabel: {
    fontSize: 14,
    color: "#555",
    fontWeight: "bold",
  },
  answerValueContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  answerValue: {
    fontSize: 14,
    fontWeight: "bold",
    flexWrap: "wrap",
  },
  tryAgainButton: {
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
  tryAgainText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  buttonIcon: {
    color: "#fff",
  },
})
