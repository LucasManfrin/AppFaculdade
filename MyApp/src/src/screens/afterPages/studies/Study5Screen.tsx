"use client"

import { useState, useRef } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Ionicons from "@expo/vector-icons/Ionicons"

const windowWidth = Dimensions.get("window").width

const Study5Screen = () => {
  const navigation = useNavigation()
  const [activeSection, setActiveSection] = useState(0)
  const scrollViewRef = useRef(null)

  const sections = [
    {
      title: "Por que responsabilidades são importantes",
      content:
        "Responsabilidades são tarefas ou deveres que temos que cumprir. Na família, cada pessoa tem responsabilidades diferentes que ajudam a manter a casa funcionando bem e a família feliz.\n\nTer responsabilidades nos ensina habilidades importantes para a vida, como organização, trabalho em equipe e independência. Quando todos ajudam, a família fica mais unida!",
      image: "https://i.ytimg.com/vi/7Ed2-qt7bh8/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBOLqgekskDpAELoGe9J73BkVLAlw",
    },
    {
      title: "Responsabilidades das crianças",
      content:
        "Mesmo sendo jovem, você pode ter responsabilidades importantes na família! Algumas responsabilidades que crianças podem ter:\n\n• Arrumar sua cama\n• Guardar seus brinquedos\n• Ajudar a pôr a mesa\n• Alimentar os animais de estimação\n• Separar o lixo reciclável\n• Fazer a lição de casa sem precisar ser lembrado\n\nEssas tarefas ajudam você a aprender e crescer!",
      image: "https://cdn.babysits.com/content/pt/content/os-direitos-e-deveres-das-crian%C3%A7as-no-brasil-3152-1637847336.jpg",
    },
    {
      title: "Responsabilidades dos adultos",
      content:
        "Os adultos da família também têm muitas responsabilidades:\n\n• Cuidar da saúde e segurança das crianças\n• Trabalhar para ganhar dinheiro para as necessidades da família\n• Preparar refeições saudáveis\n• Manter a casa limpa e organizada\n• Ajudar as crianças com a escola\n• Ensinar valores importantes\n\nOs adultos trabalham duro para cuidar da família!",
      image: "https://img.freepik.com/vetores-gratis/limpeza-de-apartamento-familiar_1284-65323.jpg?semt=ais_hybrid&w=740",
    },
    {
      title: "Trabalhando juntos",
      content:
        "Quando todos na família trabalham juntos, as tarefas ficam mais fáceis e até podem ser divertidas!\n\nAlgumas ideias para trabalhar em equipe:\n• Fazer um quadro de tarefas para a família\n• Ter um dia especial de limpeza com música\n• Revezar as tarefas para que ninguém fique sempre com as mesmas\n• Celebrar quando todos cumprem suas responsabilidades\n• Ajudar quem está com dificuldades\n\nLembre-se: uma família é como um time onde todos são importantes!",
      image: "https://img.freepik.com/fotos-premium/uma-familia-feliz-trabalhando-juntos_13339-149571.jpg",
    },
  ]

  const nextSection = () => {
    if (activeSection < sections.length - 1) {
      setActiveSection(activeSection + 1)
      scrollViewRef.current?.scrollTo({ y: 0, animated: true })
    }
  }

  const prevSection = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1)
      scrollViewRef.current?.scrollTo({ y: 0, animated: true })
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#447f78" style={{ marginLeft: 15 }} />
        </TouchableOpacity>

        <Text style={styles.title}>Responsabilidades na Família</Text>

        <View style={styles.progressContainer}>
          {sections.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.progressDot, activeSection === index ? styles.activeDot : {}]}
              onPress={() => setActiveSection(index)}
            />
          ))}
        </View>

        <Image source={{ uri: sections[activeSection].image }} style={styles.image} resizeMode="cover" />

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{sections[activeSection].title}</Text>

          <Text style={styles.content}>{sections[activeSection].content}</Text>

          <View style={styles.navigationButtons}>
            {activeSection > 0 && (
              <TouchableOpacity style={[styles.navButton, styles.prevButton]} onPress={prevSection}>
                <Ionicons name="arrow-back" size={20} color="white" />
                <Text style={styles.navButtonText}>Anterior</Text>
              </TouchableOpacity>
            )}

            {activeSection < sections.length - 1 && (
              <TouchableOpacity style={[styles.navButton, styles.nextButton]} onPress={nextSection}>
                <Text style={styles.navButtonText}>Próximo</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.funFactContainer}>
            <Ionicons name="bulb" size={24} color="#FFD700" />
            <Text style={styles.funFactTitle}>Você sabia?</Text>
            <Text style={styles.funFactText}>
              Em muitas famílias na Dinamarca, as crianças começam a ajudar na cozinha desde os 3 anos de idade! Elas
              aprendem a preparar alimentos simples e a importância de comer de forma saudável.
            </Text>
          </View>
        </View>

        <View style={styles.activityContainer}>
          <Text style={styles.activityTitle}>Atividade Divertida!</Text>
          <Text style={styles.activityText}>
            "Quadro de Tarefas Criativo": Crie um quadro colorido onde cada membro da família pode marcar as tarefas que
            completou. Use adesivos, desenhos ou fotos para torná-lo divertido. No final da semana, celebrem juntos o
            que conseguiram realizar!
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#f5f5f5",
    padding: 5,
  },
  backButton: {
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    color: "#447f78",
    marginVertical: 20,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#D1D1D1",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#447f78",
    width: 14,
    height: 14,
  },
  image: {
    width: windowWidth - 40,
    height: 200,
    alignSelf: "center",
    borderRadius: 15,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#447f78",
    marginBottom: 15,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    marginBottom: 15,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  prevButton: {
    backgroundColor: "#6AACAA",
  },
  nextButton: {
    backgroundColor: "#447f78",
  },
  navButtonText: {
    color: "white",
    marginHorizontal: 5,
    fontWeight: "600",
  },
  funFactContainer: {
    backgroundColor: "#FFF9E6",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  funFactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
    marginBottom: 8,
  },
  funFactText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },
  activityContainer: {
    backgroundColor: "#E6F7FF",
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 30,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0078D7",
    marginBottom: 10,
  },
  activityText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
  },
})

export default Study5Screen
