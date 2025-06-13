"use client"

import { useState, useRef } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Ionicons from "@expo/vector-icons/Ionicons"

const windowWidth = Dimensions.get("window").width

const Study1Screen = () => {
  const navigation = useNavigation()
  const [activeSection, setActiveSection] = useState(0)
  const scrollViewRef = useRef(null)

  const sections = [
    {
      title: "O que é uma família?",
      content:
        "Família é um grupo especial de pessoas que se amam, cuidam umas das outras e compartilham suas vidas juntas. Cada família é única e especial à sua maneira!\n\nUma família pode ser formada de diferentes maneiras: pode ter um papai e uma mamãe, dois papais, duas mamães, apenas um dos pais, avós que cuidam dos netos, ou até mesmo pessoas que não têm laços de sangue, mas se amam como família.",
      image: "https://desenvolviver.com/wp-content/uploads/2019/05/19.jpg",
    },
    {
      title: "Tipos de família",
      content:
        "Existem muitos tipos diferentes de famílias no mundo:\n\n• Família nuclear: com pai, mãe e filhos\n• Família monoparental: com apenas um dos pais e os filhos\n• Família extensa: inclui avós, tios, primos\n• Família adotiva: quando crianças são adotadas por novos pais\n• Família reconstituída: quando pessoas se unem e trazem filhos de outros relacionamentos\n\nTodas essas famílias são igualmente importantes e especiais!",
      image: "https://jornalinfoco.com.br/wp-content/uploads/2021/05/tipos-de-familia.jpg",
    },
    {
      title: "Valores na família",
      content:
        "Na família, aprendemos valores importantes como:\n\n• Respeito: ouvir e valorizar a opinião de todos\n• Amor: demonstrar carinho e afeto\n• Cooperação: ajudar nas tarefas de casa\n• Honestidade: sempre falar a verdade\n• Responsabilidade: cumprir com nossos deveres\n\nEstes valores nos ajudam a crescer como pessoas boas e a construir um mundo melhor!",
      image: "https://s3.wasabisys.com/instax/74/instax/2022/03/fotografia-de-familia-1648578272.jpeg",
    },
    {
      title: "Como demonstrar respeito",
      content:
        'Podemos demonstrar respeito na família:\n\n• Usando palavras gentis como "por favor" e "obrigado"\n• Ouvindo com atenção quando alguém está falando\n• Batendo na porta antes de entrar no quarto de outra pessoa\n• Pedindo permissão para usar algo que não é seu\n• Ajudando nas tarefas domésticas sem reclamar\n• Respeitando as regras da casa\n\nQuando respeitamos nossa família, criamos um ambiente feliz onde todos se sentem valorizados!',
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi3vQJnCe2p5b231kLRWNXHdR_0CndwxfaaROokW7cPIiU3i5U0ut-d3ramd24ute9ZHDeu6JVIvJdIt-QV5ulEMGLlDSUjENw3mpLeOIXrl4GLQLDHbZzo0MQzCXpz-ONzChY9vql7CvGx/s1600/familia.jpg",
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

        <Text style={styles.title}>O que é a Família?</Text>

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
              Em algumas culturas, como na África e na América Latina, a família inclui toda a comunidade! Eles
              acreditam que "é preciso uma aldeia para criar uma criança".
            </Text>
          </View>
        </View>

        <View style={styles.activityContainer}>
          <Text style={styles.activityTitle}>Atividade Divertida!</Text>
          <Text style={styles.activityText}>
            Desenhe sua família e escreva uma coisa especial sobre cada pessoa. Compartilhe seu desenho com sua família!
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

export default Study1Screen
