"use client"

import { useState, useRef } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Ionicons from "@expo/vector-icons/Ionicons"

const windowWidth = Dimensions.get("window").width

const Study3Screen = () => {
  const navigation = useNavigation()
  const [activeSection, setActiveSection] = useState(0)
  const scrollViewRef = useRef(null)

  const sections = [
    {
      title: "O que são conflitos?",
      content:
        "Conflitos são desentendimentos ou discordâncias entre pessoas. Eles acontecem em todas as famílias e são uma parte normal da vida!\n\nOs conflitos surgem quando temos opiniões diferentes, queremos coisas diferentes, ou quando não nos comunicamos bem. Aprender a resolver conflitos de forma saudável é uma habilidade muito importante para toda a vida.",
      image: "https://img.freepik.com/free-photo/siblings-arguing-over-toy_23-2148355251.jpg",
    },
    {
      title: "Passos para resolver conflitos",
      content:
        "Quando temos um conflito, podemos seguir estes passos:\n\n1. Acalmar-se primeiro: Respire fundo e conte até 10\n2. Conversar: Cada pessoa fala sua opinião sem interrupções\n3. Ouvir: Prestar atenção ao que o outro está sentindo\n4. Entender: Tentar ver o problema pelo ponto de vista do outro\n5. Buscar soluções juntos: Pensar em ideias que funcionem para todos",
      image: "https://media.licdn.com/dms/image/v2/D4D12AQHMMEPoEtmpLA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1698077746220?e=2147483647&v=beta&t=RwMQ2ojByYYGjy1KLJE8Qo9Bi2QkhGkTpELthhC5pgU",
    },
    {
      title: "Palavras que ajudam",
      content:
        'Algumas frases podem ajudar muito quando estamos tentando resolver um conflito:\n\n• "Eu me sinto... quando você..."\n• "Eu entendo que você..."\n• "Podemos tentar..."\n• "O que você acha de..."\n• "Vamos encontrar uma solução juntos"\n• "Desculpe por..."\n\nEstas frases mostram respeito e vontade de resolver o problema.',
      image: "https://portaldalideranca.pt/images/WordsSpelling.jpg",
    },
    {
      title: "Quando pedir ajuda",
      content:
        "Às vezes, precisamos de ajuda para resolver conflitos maiores. Não há problema nisso!\n\nPodemos pedir ajuda a:\n• Outros membros da família\n• Professores\n• Conselheiros escolares\n• Outros adultos de confiança\n\nLembre-se: Pedir ajuda não é sinal de fraqueza, mas de sabedoria!",
      image: "https://conteudo.imguol.com.br/c/entretenimento/b1/2020/04/29/pedir-ajuda-1588196515667_v2_4x3.jpg",
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

        <Text style={styles.title}>Resolvendo Conflitos</Text>

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
              Em algumas escolas ao redor do mundo, crianças são treinadas para serem "mediadores de conflitos" e ajudam
              seus colegas a resolver desentendimentos no pátio da escola!
            </Text>
          </View>
        </View>

        <View style={styles.activityContainer}>
          <Text style={styles.activityTitle}>Atividade Divertida!</Text>
          <Text style={styles.activityText}>
            "Jogo da Solução": Escreva em pedaços de papel alguns conflitos comuns (como "dois irmãos querem usar o
            mesmo brinquedo"). Em grupo, sorteiem um conflito e criem uma pequena encenação mostrando como resolvê-lo de
            forma positiva!
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

export default Study3Screen
