"use client"

import { useState, useRef } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Ionicons from "@expo/vector-icons/Ionicons"

const windowWidth = Dimensions.get("window").width

const Study4Screen = () => {
  const navigation = useNavigation()
  const [activeSection, setActiveSection] = useState(0)
  const scrollViewRef = useRef(null)

  const sections = [
    {
      title: "O que são tradições familiares?",
      content:
        "Tradições familiares são atividades especiais, celebrações ou costumes que uma família repete regularmente e que têm um significado especial.\n\nElas podem ser grandes celebrações como festas de aniversário ou pequenos hábitos como ler uma história antes de dormir. As tradições ajudam a criar memórias felizes e fortalecem os laços entre os membros da família.",
      image: "https://www.familia.com.br/wp-content/uploads/2013/07/featuredImageId95813.jpg",
    },
    {
      title: "Por que as tradições são importantes?",
      content:
        "As tradições familiares são importantes porque:\n\n• Criam um sentimento de pertencimento\n• Ajudam a construir a identidade familiar\n• Oferecem segurança e previsibilidade\n• Conectam gerações diferentes\n• Criam memórias que duram para sempre\n• Ensinam valores importantes\n\nAs tradições nos ajudam a sentir que fazemos parte de algo especial!",
      image: "https://s2.glbimg.com/G_nym0wK2RfD4SB0ktkQbk63I3Y=/e.glbimg.com/og/ed/f/original/2020/08/28/gettyimages-1139901529.jpg",
    },
    {
      title: "Tipos de tradições familiares",
      content:
        "Existem muitos tipos de tradições familiares:\n\n• Tradições de feriados: como decorar a árvore de Natal ou fazer um almoço especial no domingo\n• Tradições diárias: como dar um abraço antes de dormir\n• Tradições de férias: como visitar um lugar especial todo ano\n• Tradições de celebração: como cantar uma música especial em aniversários\n• Tradições culturais: que celebram sua herança ou religião",
      image: "https://www.metropax.com.br/wp-content/uploads/2023/11/Tradicao_de_familia.jpg",
    },
    {
      title: "Criando novas tradições",
      content:
        "Você pode ajudar a criar novas tradições na sua família! Aqui estão algumas ideias:\n\n• Uma noite de jogos em família toda semana\n• Preparar uma refeição especial juntos uma vez por mês\n• Criar um álbum de fotos ou diário da família\n• Plantar uma árvore em ocasiões especiais\n• Inventar uma dança ou música da família\n\nAs melhores tradições são aquelas que trazem alegria e significado para todos!",
      image: "https://s2-galileu.glbimg.com/R0Kgzq6R-mFCEOfbBZinH08cfnQ=/0x0:888x592/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_fde5cd494fb04473a83fa5fd57ad4542/internal_photos/bs/2023/t/O/Oxekr1TqGrjbzBZxxjmw/image6-31-.jpg",
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

        <Text style={styles.title}>Tradições Familiares</Text>

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
              No Japão, existe uma tradição chamada "Shichi-Go-San" (7-5-3) onde crianças de 3, 5 e 7 anos visitam
              templos em novembro para celebrar seu crescimento e saúde!
            </Text>
          </View>
        </View>

        <View style={styles.activityContainer}>
          <Text style={styles.activityTitle}>Atividade Divertida!</Text>
          <Text style={styles.activityText}>
            "Cápsula do Tempo Familiar": Coloque em uma caixa objetos especiais, fotos, cartas e desenhos que
            representem sua família hoje. Guardem a caixa e combinem de abri-la juntos depois de alguns anos!
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

export default Study4Screen
