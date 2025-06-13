"use client"

import { useState, useRef } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Ionicons from "@expo/vector-icons/Ionicons"

const windowWidth = Dimensions.get("window").width

const Study2Screen = () => {
  const navigation = useNavigation()
  const [activeSection, setActiveSection] = useState(0)
  const scrollViewRef = useRef(null)

  const sections = [
    {
      title: "A importância da comunicação",
      content:
        "Comunicação é a forma como compartilhamos nossas ideias, sentimentos e pensamentos com outras pessoas. Em uma família, a boa comunicação ajuda todos a se entenderem melhor e a se sentirem amados e respeitados.\n\nQuando conversamos de forma clara e gentil, criamos laços mais fortes e resolvemos problemas com mais facilidade!",
      image: "https://www.crb.g12.br/Blog/image.axd?picture=/2024/img_blog_comunicacao_familiar_03.jpg",
    },
    {
      title: "Como ser um bom ouvinte",
      content:
        "Ser um bom ouvinte é uma parte muito importante da comunicação. Isso significa:\n\n• Prestar atenção quando alguém está falando\n• Olhar para a pessoa\n• Não interromper\n• Fazer perguntas para entender melhor\n• Mostrar interesse pelo que está sendo dito\n\nQuando ouvimos com atenção, mostramos que nos importamos com os sentimentos e opiniões dos outros.",
      image: "https://www.amambainoticias.com.br/wp-content/uploads/media/images/3271/101575/57db056395f78f8b5d37672a5a58ce279de9b3cbb70d6.jpg",
    },
    {
      title: "Expressando sentimentos",
      content:
        "É importante aprender a falar sobre como nos sentimos. Podemos fazer isso:\n\n• Usando palavras como 'Eu me sinto...' em vez de culpar os outros\n• Sendo honestos sobre nossas emoções\n• Escolhendo um bom momento para conversar\n• Usando um tom de voz calmo\n\nLembre-se: Todos os sentimentos são válidos, mesmo quando são difíceis!",
      image: "https://media.licdn.com/dms/image/v2/C4D12AQGLRXj3xi51og/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1571667389742?e=2147483647&v=beta&t=tgqbN8h8swMEU1wdZC0IP4D-o8Sj3LzP5PEVvCSNapE",
    },
    {
      title: "Comunicação não-verbal",
      content:
        "Sabia que nem toda comunicação usa palavras? Nosso corpo também 'fala'!\n\n• Expressões faciais: um sorriso ou uma cara triste\n• Gestos: acenar, apontar ou abraçar\n• Postura: como sentamos ou ficamos em pé\n• Tom de voz: como falamos, não apenas o que falamos\n\nÀs vezes, nosso corpo mostra como nos sentimos mesmo quando não dizemos nada!",
      image: "https://www.flowup.me/blog/wp-content/uploads/2023/09/FlowUp-imagens-2023-09-29T093421.690.webp",
    },
  ]

  // funcao para ir ao topo quando clicar nos botoes proximo e anterior
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

        <Text style={styles.title}>Comunicação na Família</Text>

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
              Os cientistas descobriram que mais de 50% da nossa comunicação é não-verbal! Isso significa que prestamos
              mais atenção em como as pessoas agem do que no que elas dizem.
            </Text>
          </View>
        </View>

        <View style={styles.activityContainer}>
          <Text style={styles.activityTitle}>Atividade Divertida!</Text>
          <Text style={styles.activityText}>
            Jogo do Espelho: Em duplas, uma pessoa faz movimentos e expressões faciais, e a outra tenta copiar como um
            espelho. Depois troquem! Este jogo ajuda a prestar atenção na comunicação não-verbal.
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

export default Study2Screen
