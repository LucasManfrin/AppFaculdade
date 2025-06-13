"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import Ionicons from "@expo/vector-icons/Ionicons"
import { LinearGradient } from "expo-linear-gradient"

type RootStackParamList = {
  Studies: undefined
  Study1: undefined
  Study2: undefined
  Study3: undefined
  Study4: undefined
  Study5: undefined
  Study6: undefined
}

type NavigationProp = StackNavigationProp<RootStackParamList, "Studies">

const totalModules = 5

const StudiesScreen = () => {
  const navigation = useNavigation<NavigationProp>()
  const scrollViewRef = useRef<ScrollView>(null)

  // Estado para controlar o progresso
  const [currentStep, setCurrentStep] = useState(0)

  // Função para adicionar progresso
  const addProgress = () => {
    if (currentStep < totalModules) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  // Função para remover progresso
  const removeProgress = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const progress = currentStep / totalModules

  // Animação para a barra de progresso
  const animatedProgress = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }, [progress])

  const progressWidth = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  })

  // Estados para os checkboxes de cada módulo
  const [moduleStatus, setModuleStatus] = useState({
    module1: { completed: false, checked: false },
    module2: { completed: false, checked: false },
    module3: { completed: false, checked: false },
    module4: { completed: false, checked: false },
    module5: { completed: false, checked: false },
  })

  // Função para alternar o status de um módulo
  const toggleModuleStatus = (module: string) => {
    setModuleStatus((prev) => {
      const currentStatus = prev[module as keyof typeof prev]
      const newStatus = {
        ...prev,
        [module]: {
          completed: !currentStatus.completed,
          checked: !currentStatus.checked,
        },
      }

      // Atualiza o progresso geral
      const completedCount = Object.values(newStatus).filter((status) => status.completed).length
      setCurrentStep(completedCount)

      return newStatus
    })
  }

  // Dados dos módulos
  const modules = [
    {
      id: "module1",
      number: 1,
      title: "O que é família?",
      description:
        "A família é o primeiro grupo social de uma pessoa, formado por quem cuida, apoia e convive com amor.",
      image: "https://www.vaticannews.va/content/dam/vaticannews/multimedia/2021/12/26/famiglia.jpg/_jcr_content/renditions/cq5dam.thumbnail.cropped.750.422.jpeg",
      route: "Study1",
      color: "#4ECDC4",
    },
    {
      id: "module2",
      number: 2,
      title: "Comunicação na Família",
      description: "Como conversar, ouvir e expressar sentimentos de forma saudável e construtiva.",
      image: "https://media.gazetadopovo.com.br/sites/2/2021/09/03183211/melhorar-comunicacao-familia-9023dade-660x372.jpg",
      route: "Study2",
      color: "#FF6B6B",
    },
    {
      id: "module3",
      number: 3,
      title: "Resolvendo Conflitos",
      description: "Técnicas para resolver desentendimentos de forma saudável e construtiva.",
      image: "https://wendellcarvalho.com.br/wp-content/uploads/2023/06/resolver-conflitos.jpg",
      route: "Study3",
      color: "#FFD166",
    },
    {
      id: "module4",
      number: 4,
      title: "Tradições Familiares",
      description: "A importância de criar e manter tradições que fortalecem os laços familiares.",
      image: "https://st3.depositphotos.com/35990688/37246/i/450/depositphotos_372464104-stock-photo-portrait-granddaughter-grandmother-preparing-fresh.jpg",
      route: "Study4",
      color: "#06D6A0",
    },
    {
      id: "module5",
      number: 5,
      title: "Responsabilidades na Família",
      description: "O papel de cada membro na família e a importância da cooperação.",
      image: "https://static.wixstatic.com/media/11062b_81a8249190db4e2cb24a06fa44e98831~mv2.jpg/v1/fill/w_568,h_378,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_81a8249190db4e2cb24a06fa44e98831~mv2.jpg",
      route: "Study5",
      color: "#118AB2",
    },
  ]

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* <ImageBackground
        source={{ uri: "https://img.freepik.com/free-vector/abstract-watercolor-pastel-background_87374-139.jpg" }}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.15 }}
      > */}
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Minha Jornada</Text>
            <Text style={styles.subtitle}>Aprendendo sobre família</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>
                Seu progresso: <Text style={styles.progressPercentage}>{Math.round(progress * 100)}%</Text>
              </Text>
              <Text style={styles.progressModules}>
                {currentStep}/{totalModules} módulos
              </Text>
            </View>

            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
              </View>
              <View style={styles.progressMarkers}>
                {[...Array(totalModules + 1)].map((_, index) => (
                  <View key={index} style={[styles.marker, index <= currentStep ? styles.markerCompleted : {}]} />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.modulesContainer}>
            {modules.map((module, index) => (
              <View key={module.id} style={styles.moduleWrapper}>
                <LinearGradient
                  colors={[module.color, shadeColor(module.color, -20)]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.moduleCard,
                    moduleStatus[module.id as keyof typeof moduleStatus].completed ? styles.moduleCardCompleted : {},
                  ]}
                >
                  <View style={styles.moduleImageContainer}>
                    <Image source={{ uri: module.image }} style={styles.moduleImage} resizeMode="cover" />
                    <View style={styles.moduleNumberContainer}>
                      <Text style={styles.moduleNumber}>{module.number}</Text>
                    </View>
                  </View>

                  <View style={styles.moduleContent}>
                    <View style={styles.moduleHeader}>
                      <Text style={styles.moduleTitle}>{module.title}</Text>
                      <TouchableOpacity style={styles.checkButton} onPress={() => toggleModuleStatus(module.id)}>
                        <FontAwesome
                          name={
                            moduleStatus[module.id as keyof typeof moduleStatus].checked
                              ? "check-circle"
                              : "check-circle-o"
                          }
                          size={28}
                          color={moduleStatus[module.id as keyof typeof moduleStatus].checked ? "#4CAF50" : "#BDBDBD"}
                        />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.moduleDescription}>{module.description}</Text>

                    <TouchableOpacity
                      style={styles.studyButton}
                      onPress={() => navigation.navigate(module.route as keyof RootStackParamList)}
                    >
                      <Text style={styles.studyButtonText}>Estudar agora</Text>
                      <Ionicons name="arrow-forward" size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>


        </ScrollView>
      {/* </ImageBackground> */}
    </View>
  )
}

// Função auxiliar para escurecer ou clarear uma cor
const shadeColor = (color: string, percent: number) => {
  let R = Number.parseInt(color.substring(1, 3), 16)
  let G = Number.parseInt(color.substring(3, 5), 16)
  let B = Number.parseInt(color.substring(5, 7), 16)

  R = Math.floor((R * (100 + percent)) / 100)
  G = Math.floor((G * (100 + percent)) / 100)
  B = Math.floor((B * (100 + percent)) / 100)

  R = R < 255 ? R : 255
  G = G < 255 ? G : 255
  B = B < 255 ? B : 255

  R = R > 0 ? R : 0
  G = G > 0 ? G : 0
  B = B > 0 ? B : 0

  const RR = R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16)
  const GG = G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16)
  const BB = B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16)

  return "#" + RR + GG + BB
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  progressTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressText: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
  },
  progressPercentage: {
    fontWeight: "bold",
    color: "#447f78",
  },
  progressModules: {
    fontSize: 14,
    color: "#777",
  },
  progressBarContainer: {
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#447f78",
    borderRadius: 10,
  },
  progressMarkers: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    marginTop: 5,
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },
  markerCompleted: {
    backgroundColor: "#447f78",
  },
  modulesContainer: {
    paddingHorizontal: 20,
    marginBottom: 100
  },
  moduleWrapper: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moduleCard: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFF",
  },
  moduleCardCompleted: {
    opacity: 0.9,
  },
  moduleImageContainer: {
    position: "relative",
    height: 120,
  },
  moduleImage: {
    width: "100%",
    height: "100%",
  },
  moduleNumberContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  moduleNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  moduleContent: {
    padding: 16,
  },
  moduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    flex: 1,
  },
  checkButton: {
    padding: 5,
  },
  moduleDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 16,
    lineHeight: 20,
  },
  studyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  studyButtonText: {
    color: "#FFF",
    fontWeight: "600",
    marginRight: 8,
  },
  quizButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF8C00",
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  quizButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
  },
})

export default StudiesScreen
