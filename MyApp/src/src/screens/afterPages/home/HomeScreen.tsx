"use client"

import { useEffect, useRef, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Animated,
  ScrollView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db, auth } from "@/firebaseConfig"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const { width } = Dimensions.get("window")

// Criação de um componente animado com o ícone de coroa
const AnimatedIcon = Animated.createAnimatedComponent(FontAwesome5)

const HomeScreen = () => {
  const [rankingData, setRankingData] = useState([]) // Estado com os dados dos jogadores
  const [loading, setLoading] = useState(true) // Estado para controlar o carregamento
  const [showEmptyMessage, setShowEmptyMessage] = useState(false) // Estado para controlar a mensagem vazia
  const translateY1 = useRef(new Animated.Value(0)).current
  const translateY2 = useRef(new Animated.Value(0)).current
  const translateY3 = useRef(new Animated.Value(0)).current
  const [currentUserId, setCurrentUserId] = useState(null)
  const insets = useSafeAreaInsets()

  // Animações de fade-in para cada posição do ranking
  const headerFade = useRef(new Animated.Value(0)).current
  const headerTranslate = useRef(new Animated.Value(-50)).current
  const podiumFade = useRef(new Animated.Value(0)).current
  const podiumTranslate = useRef(new Animated.Value(-30)).current
  const legendFade = useRef(new Animated.Value(0)).current
  const legendTranslate = useRef(new Animated.Value(-30)).current
  const listItemFades = useRef([]).current

  // Função de animação flutuante para os 3 primeiros colocados
  const createFloatingAnimation = (animatedValue, delay) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: -15,
          duration: 1200,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    )
  }

  // Função para criar animações sequenciais de cima para baixo
  const startSequentialAnimations = (totalPlayers) => {
    // Limpa animações anteriores
    listItemFades.length = 0

    // Cria uma nova animação para cada jogador
    for (let i = 0; i < totalPlayers; i++) {
      listItemFades.push(new Animated.Value(0))
    }

    // Sequência de animações de cima para baixo
    const animationSequence = [
      // 1. Animar o cabeçalho
      Animated.parallel([
        Animated.timing(headerFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(headerTranslate, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

      // 2. Animar o pódio
      Animated.parallel([
        Animated.timing(podiumFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(podiumTranslate, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

      // 3. Animar a legenda
      Animated.parallel([
        Animated.timing(legendFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(legendTranslate, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

      // 4. Animar os itens da lista sequencialmente
      ...listItemFades.map((fadeAnim, index) => {
        return Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      }),
    ]

    // Executa a sequência de animações
    Animated.sequence(animationSequence).start()
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserId(user.uid)
      }
    })

    // Inicia animações flutuantes
    createFloatingAnimation(translateY1, 0).start()
    createFloatingAnimation(translateY2, 300).start()
    createFloatingAnimation(translateY3, 600).start()

    return () => {
      unsubscribe()
      translateY1.stopAnimation()
      translateY2.stopAnimation()
      translateY3.stopAnimation()
    }
  }, [])

  useEffect(() => {
    // Busca os resultados 'melhor' de todos os usuários
    const fetchRanking = async () => {
      setLoading(true)
      setShowEmptyMessage(false)

      // Timer para mostrar mensagem vazia após 5 segundos
      const emptyMessageTimer = setTimeout(() => {
        if (loading && rankingData.length === 0) {
          setShowEmptyMessage(true)
        }
      }, 5000)

      try {
        const usersSnap = await getDocs(collection(db, "users"))
        const allUsuarios = []

        for (const userDoc of usersSnap.docs) {
          const userId = userDoc.id
          const userData = userDoc.data()

          const melhorRef = doc(db, "users", userId, "resultados", "melhor")
          const melhorSnap = await getDoc(melhorRef)

          let score = 0
          let tempo = 9999

          if (melhorSnap.exists()) {
            const melhorData = melhorSnap.data()
            score = melhorData.acertos || 0
            tempo = melhorData.tempo || 9999
          }

          allUsuarios.push({
            id: userId,
            name: userData.nickname || "Anônimo",
            score,
            tempo,
            avatar: userData.avatar || "https://i.postimg.cc/FHRCKxp4/user-1.png",
          })
        }

        // Ordenar por score, depois por tempo
        const sorted = allUsuarios.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score
          return a.tempo - b.tempo
        })

        setRankingData(sorted)

        // Limpa o timer se os dados chegarem antes de 5 segundos
        clearTimeout(emptyMessageTimer)

        // Inicia as animações sequenciais após carregar os dados
        startSequentialAnimations(sorted.length > 3 ? sorted.length - 3 : 0)

        setLoading(false)
        console.log("Ranking carregado com todos os usuários:", sorted)
      } catch (error) {
        console.error("Erro ao buscar ranking:", error)
        clearTimeout(emptyMessageTimer)
        setLoading(false)
        setShowEmptyMessage(true)
      }
    }

    fetchRanking() // Executa a função ao montar o componente
  }, [])

  // Formatar tempo para exibição
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <ImageBackground
      style={styles.background}
      source={{
        uri: "https://i.postimg.cc/G2jJCRbL/Whats-App-Image-2025-04-15-at-13-46-50.jpg",
      }}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 80, // Espaço extra para a barra de navegação
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.headerContainer,
            {
              opacity: headerFade,
              transform: [{ translateY: headerTranslate }],
            },
          ]}
        >
          <View style={styles.header}>
            <FontAwesome5 name="trophy" size={24} color="#125250" style={styles.headerIcon} />
            <Text style={styles.headerTitle}>Ranking de Jogadores</Text>
          </View>
        </Animated.View>

        {/* Top 3 colocados com animação */}
        <Animated.View
          style={[
            styles.podiumContainer,
            {
              opacity: podiumFade,
              transform: [{ translateY: podiumTranslate }],
            },
          ]}
        >
          {/* Segundo lugar */}
          {rankingData.length > 1 && (
            <Animated.View
              style={[
                styles.podiumItem,
                styles.secondPlace,
                {
                  transform: [{ translateY: translateY2 }],
                },
              ]}
            >
              <View style={styles.podiumPosition}>
                <Text style={styles.podiumPositionText}>2</Text>
              </View>
              <View style={[styles.podiumCard, rankingData[1]?.id === currentUserId ? styles.currentUserCard : null]}>
                <Image
                  style={[
                    styles.podiumAvatar,
                    styles.secondAvatar,
                    rankingData[1]?.id === currentUserId ? styles.currentUserAvatar : null,
                  ]}
                  source={{ uri: rankingData[1]?.avatar }}
                />
                <Text
                  style={[styles.podiumName, rankingData[1]?.id === currentUserId ? styles.currentUserText : null]}
                  numberOfLines={1}
                >
                  {rankingData[1]?.name}
                </Text>
                <View style={styles.podiumScoreContainer}>
                  <FontAwesome5 name="star" size={12} color="#C0C0C0" style={styles.podiumScoreIcon} />
                  <Text
                    style={[styles.podiumScore, rankingData[1]?.id === currentUserId ? styles.currentUserText : null]}
                  >
                    {rankingData[1]?.score}
                  </Text>
                </View>
                <View style={styles.podiumTimeContainer}>
                  <FontAwesome5 name="clock" size={12} color="#C0C0C0" style={styles.podiumTimeIcon} />
                  <Text
                    style={[styles.podiumTime, rankingData[1]?.id === currentUserId ? styles.currentUserText : null]}
                  >
                    {formatTime(rankingData[1]?.tempo)}
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}

          {/* Primeiro lugar */}
          {rankingData.length > 0 && (
            <Animated.View
              style={[
                styles.podiumItem,
                styles.firstPlace,
                {
                  transform: [{ translateY: translateY1 }],
                },
              ]}
            >
              <AnimatedIcon name="crown" size={24} style={styles.crownIcon} />
              <View style={styles.podiumPosition}>
                <Text style={styles.podiumPositionText}>1</Text>
              </View>
              <View style={[styles.podiumCard, rankingData[0]?.id === currentUserId ? styles.currentUserCard : null]}>
                <Image
                  style={[
                    styles.podiumAvatar,
                    styles.firstAvatar,
                    rankingData[0]?.id === currentUserId ? styles.currentUserAvatar : null,
                  ]}
                  source={{ uri: rankingData[0]?.avatar }}
                />
                <Text
                  style={[styles.podiumName, rankingData[0]?.id === currentUserId ? styles.currentUserText : null]}
                  numberOfLines={1}
                >
                  {rankingData[0]?.name}
                </Text>
                <View style={styles.podiumScoreContainer}>
                  <FontAwesome5 name="star" size={12} color="#FFD700" style={styles.podiumScoreIcon} />
                  <Text
                    style={[styles.podiumScore, rankingData[0]?.id === currentUserId ? styles.currentUserText : null]}
                  >
                    {rankingData[0]?.score}
                  </Text>
                </View>
                <View style={styles.podiumTimeContainer}>
                  <FontAwesome5 name="clock" size={12} color="#FFD700" style={styles.podiumTimeIcon} />
                  <Text
                    style={[styles.podiumTime, rankingData[0]?.id === currentUserId ? styles.currentUserText : null]}
                  >
                    {formatTime(rankingData[0]?.tempo)}
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}

          {/* Terceiro lugar */}
          {rankingData.length > 2 && (
            <Animated.View
              style={[
                styles.podiumItem,
                styles.thirdPlace,
                {
                  transform: [{ translateY: translateY3 }],
                },
              ]}
            >
              <View style={styles.podiumPosition}>
                <Text style={styles.podiumPositionText}>3</Text>
              </View>
              <View style={[styles.podiumCard, rankingData[2]?.id === currentUserId ? styles.currentUserCard : null]}>
                <Image
                  style={[
                    styles.podiumAvatar,
                    styles.thirdAvatar,
                    rankingData[2]?.id === currentUserId ? styles.currentUserAvatar : null,
                  ]}
                  source={{ uri: rankingData[2]?.avatar }}
                />
                <Text
                  style={[styles.podiumName, rankingData[2]?.id === currentUserId ? styles.currentUserText : null]}
                  numberOfLines={1}
                >
                  {rankingData[2]?.name}
                </Text>
                <View style={styles.podiumScoreContainer}>
                  <FontAwesome5 name="star" size={12} color="#CD7F32" style={styles.podiumScoreIcon} />
                  <Text
                    style={[styles.podiumScore, rankingData[2]?.id === currentUserId ? styles.currentUserText : null]}
                  >
                    {rankingData[2]?.score}
                  </Text>
                </View>
                <View style={styles.podiumTimeContainer}>
                  <FontAwesome5 name="clock" size={12} color="#CD7F32" style={styles.podiumTimeIcon} />
                  <Text
                    style={[styles.podiumTime, rankingData[2]?.id === currentUserId ? styles.currentUserText : null]}
                  >
                    {formatTime(rankingData[2]?.tempo)}
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}
        </Animated.View>

        {/* Legenda - Apenas o título "Classificação" */}
        <Animated.View
          style={[
            styles.legendContainer,
            {
              opacity: legendFade,
              transform: [{ translateY: legendTranslate }],
            },
          ]}
        >
          <View style={styles.legend}>
            <Text style={styles.legendTitle}>Classificação</Text>
          </View>
        </Animated.View>

        {/* Demais posições a partir do 4º lugar */}
        <View style={styles.rankingListContainer}>
          {rankingData.slice(3).map((player, index) => {
            const isCurrentUser = player.id === currentUserId
            const fadeAnim = listItemFades[index] || new Animated.Value(0)

            return (
              <Animated.View
                key={player.id}
                style={[
                  styles.rankingItemContainer,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={[styles.rankingItem, isCurrentUser ? styles.currentUserRankingItem : null]}>
                  <View style={styles.positionContainer}>
                    <Text style={[styles.positionNumber, isCurrentUser && styles.currentUserPosition]}>
                      {index + 4}
                    </Text>
                  </View>

                  <View style={styles.playerContainer}>
                    <Image style={styles.playerAvatar} source={{ uri: player.avatar }} />
                    <Text style={[styles.playerName, isCurrentUser && styles.currentUserText]} numberOfLines={1}>
                      {player.name}
                    </Text>
                  </View>

                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <FontAwesome5
                        name="star"
                        size={12}
                        color={isCurrentUser ? "#125250" : "#666"}
                        style={styles.statIcon}
                      />
                      <Text style={[styles.statValue, isCurrentUser && styles.currentUserText]}>{player.score}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <FontAwesome5
                        name="clock"
                        size={12}
                        color={isCurrentUser ? "#125250" : "#666"}
                        style={styles.statIcon}
                      />
                      <Text style={[styles.statValue, isCurrentUser && styles.currentUserText]}>
                        {formatTime(player.tempo)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
            )
          })}

          {/* Indicador de carregamento ou mensagem vazia */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#125250" />
              <Text style={styles.loadingText}>Carregando ranking...</Text>
            </View>
          )}

          {!loading && rankingData.length === 0 && showEmptyMessage && (
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="trophy" size={50} color="#BDBDBD" />
              <Text style={styles.emptyText}>Nenhum jogador encontrado</Text>
              <Text style={styles.emptySubtext}>Seja o primeiro a completar o quiz!</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  headerContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 20,
  },
  headerIcon: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#125250",
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginHorizontal: 20,
    marginBottom: 30,
    height: 220,
  },
  podiumItem: {
    alignItems: "center",
    position: "relative",
  },
  firstPlace: {
    zIndex: 3,
    // marginHorizontal: -10,
  },
  secondPlace: {
    zIndex: 2,
  },
  thirdPlace: {
    zIndex: 1,
  },
  crownIcon: {
    position: "absolute",
    top: -15,
    color: "#FFD700",
    zIndex: 10,
  },
  podiumPosition: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#125250",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  podiumPositionText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  podiumCard: {
    width: 120,
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  currentUserCard: {
    borderWidth: 2,
    borderColor: "#125250",
  },
  podiumAvatar: {
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 3,
  },
  firstAvatar: {
    width: 90,
    height: 90,
    borderColor: "#FFD700",
  },
  secondAvatar: {
    width: 70,
    height: 70,
    borderColor: "#C0C0C0",
  },
  thirdAvatar: {
    width: 70,
    height: 70,
    borderColor: "#CD7F32",
  },
  currentUserAvatar: {
    borderColor: "#125250",
  },
  podiumName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
    width: "100%",
  },
  podiumScoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  podiumScoreIcon: {
    marginRight: 5,
  },
  podiumScore: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  podiumTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  podiumTimeIcon: {
    marginRight: 5,
  },
  podiumTime: {
    fontSize: 12,
    color: "#666",
  },
  currentUserText: {
    color: "#125250",
    fontWeight: "bold",
  },
  legendContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
  },
  legend: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 15,
    alignItems: "center",
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#125250",
    textAlign: "center",
  },
  rankingListContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  rankingItemContainer: {
    marginBottom: 10,
  },
  rankingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  currentUserRankingItem: {
    backgroundColor: "rgba(18, 82, 80, 0.2)",
    borderWidth: 1,
    borderColor: "#125250",
  },
  positionContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(18, 82, 80, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  positionNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  currentUserPosition: {
    color: "#125250",
  },
  playerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  playerName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  statsContainer: {
    width: 120,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    width: 50,
    justifyContent: "flex-end",
  },
  statIcon: {
    marginRight: 5,
  },
  statValue: {
    fontSize: 14,
    color: "#333",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 15,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#125250",
    marginTop: 15,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 15,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
  },
})

export default HomeScreen