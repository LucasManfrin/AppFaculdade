import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Animated,
  ScrollView,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db, auth } from "@/firebaseConfig"; // importa a instância do Firestore

// Criação de um componente animado com o ícone de coroa
const AnimatedIcon = Animated.createAnimatedComponent(FontAwesome5);

const HomeScreen = () => {
  const [rankingData, setRankingData] = useState([]); // Estado com os dados dos jogadores
  const translateY1 = useRef(new Animated.Value(0)).current;
  const translateY2 = useRef(new Animated.Value(0)).current;
  const translateY3 = useRef(new Animated.Value(0)).current;
  const [currentUserId, setCurrentUserId] = useState(null);

  // Função de animação flutuante para os 3 primeiros colocados
  const createFloatingAnimation = (
    animatedValue: Animated.Value,
    delay: number
  ) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: -15,
          duration: 800,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
  };

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      setCurrentUserId(user.uid);
    }
  });

  // Inicia animações
  createFloatingAnimation(translateY1, 0).start();
  createFloatingAnimation(translateY2, 300).start();
  createFloatingAnimation(translateY3, 600).start();

  return () => {
    unsubscribe();
    translateY1.stopAnimation();
    translateY2.stopAnimation();
    translateY3.stopAnimation();
  };
}, []);


  useEffect(() => {
    // Busca os resultados 'melhor' de todos os usuários
    const fetchRanking = async () => {
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      let allUsuarios = [];

      for (const userDoc of usersSnap.docs) {
        const userId = userDoc.id;
        const userData = userDoc.data();

        const melhorRef = doc(db, "users", userId, "resultados", "melhor");
        const melhorSnap = await getDoc(melhorRef);

        let score = 0;
        let tempo = 9999;

        if (melhorSnap.exists()) {
          const melhorData = melhorSnap.data();
          score = melhorData.acertos || 0;
          tempo = melhorData.tempo || 9999;
        }

        allUsuarios.push({
          id: userId,
          name: userData.nickname || "Anônimo",
          score,
          tempo,
          avatar: userData.avatar || "https://i.postimg.cc/FHRCKxp4/user-1.png",
        });
      }

    // Ordenar por score, depois por tempo
    const sorted = allUsuarios.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.tempo - b.tempo;
    });

    setRankingData(sorted);
    console.log("Ranking carregado com todos os usuários:", sorted);
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
  }
};

    fetchRanking(); // Executa a função ao montar o componente
  }, []);

  return (
    <ImageBackground
      style={styles.background}
      source={{
        uri: "https://i.postimg.cc/G2jJCRbL/Whats-App-Image-2025-04-15-at-13-46-50.jpg",
      }}
    >
      <ScrollView>
        {/* Top 3 colocados com animação */}
        <View style={styles.imageContainer}>
          {rankingData.slice(0, 3).map((player, index) => {
          const isCurrentUser = player.id === currentUserId;

          let animatedStyle = {};
          let borderColor = "";
          let size = 70;
          let numberStyle = {};

          if (index === 0) {
            animatedStyle = { transform: [{ translateY: translateY1 }] };
            borderColor = "#e5cb26";
            size = 90;
            numberStyle = styles.number1;
          } else if (index === 1) {
            animatedStyle = { transform: [{ translateY: translateY2 }] };
            borderColor = "#125250";
            size = 70;
            numberStyle = styles.number2;
          } else {
            animatedStyle = { transform: [{ translateY: translateY3 }] };
            borderColor = "#125250";
            size = 70;
            numberStyle = styles.number3;
          }

          return (
            <Animated.View
              key={player.id}
              style={[
                animatedStyle,
                isCurrentUser ? styles.highlightTopBox : null, // destaque p/ top 3
              ]}
            >
              {index === 0 && (
                <AnimatedIcon name="crown" size={18} style={styles.icon} />
              )}
              <Image
                style={{
                  width: size,
                  height: size,
                  margin: 20,
                  borderWidth: 4,
                  borderColor: isCurrentUser ? "#2ecc71" : borderColor,
                  borderRadius: 70,
                }}
                source={{ uri: player.avatar }}
              />
              <Text style={numberStyle}>{index + 1}</Text>
              <Text style={[styles.info, isCurrentUser && styles.highlightText]}>
                {player.name}
              </Text>
              <Text style={[styles.info, isCurrentUser && styles.highlightText]}>
                {player.score}
              </Text>
            </Animated.View>
          );
        })}
        </View>

        {/* Demais posições a partir do 4º lugar */}
        <View style={styles.positionsContainer}>
          {rankingData.slice(3).map((player, index) => {
            const isCurrentUser = player.id === currentUserId;

            // DEBUG opcional
            console.log("Comparando:", player.id, "com", currentUserId);

            return (
              <View
                key={player.id}
                style={[styles.box, isCurrentUser ? styles.highlightBox : null]}
              >
                <View
                  style={[
                    styles.positionBox,
                    isCurrentUser ? styles.highlight : null,
                  ]}
                >
                  <View style={styles.user}>
                    <Text>{index + 4}</Text>
                    <Image
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 70,
                      }}
                      source={{ uri: player.avatar }}
                    />
                    <Text style={[styles.info, isCurrentUser && styles.highlightText]}>
                    {player.name}
                  </Text>
                  </View>
                  <Text style={isCurrentUser ? { fontWeight: "bold" } : null}>
                    {player.score}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default HomeScreen;


const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 110,
  },
  icon: {
    color: "#e5cb26",
    position: "absolute",
    top: 1,
    left: 53,
  },
  number1: {
    position: "absolute",
    left: 60,
    top: 98,
    backgroundColor: "#e5cb26",
    color: "#fff",
    width: 15,
    height: 15,
    paddingLeft: 3,
    borderRadius: 8,
  },
  number2: {
    position: "absolute",
    left: 49,
    top: 80,
    backgroundColor: "#125250",
    color: "#fff",
    width: 15,
    height: 15,
    paddingLeft: 3,
    borderRadius: 8,
  },
  number3: {
    position: "absolute",
    left: 50,
    top: 80,
    backgroundColor: "#125250",
    color: "#fff",
    width: 15,
    height: 15,
    paddingLeft: 3,
    borderRadius: 8,
  },
  info: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "bold",
    color: "grey",
  },
  positionsContainer: {
    marginVertical: 130,
  },
  box: {
    marginTop: 30,
  },
  positionBox: {
    flexDirection: "row",
    backgroundColor: "#cbcdcc",
    alignItems: "center",
    paddingRight: 8,
    borderRadius: 15,
  },
  user: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    width: 290,
    height: 65,
    paddingHorizontal: 20,
    paddingTop: 5,
    borderRadius: 15,
    backgroundColor: "#cbcdcc",
    marginRight: 5,
  },
 highlightText: {
  fontWeight: "bold",
  color: "#000", // garante legibilidade
},
});
