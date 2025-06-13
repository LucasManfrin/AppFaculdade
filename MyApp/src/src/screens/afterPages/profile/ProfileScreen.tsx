import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useUser } from "../../../../../userContext";
import { db, auth } from "@/firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const ProfileScreen = () => {
  const [rightAnswers, setRightAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [quizDate, setQuizDate] = useState('');
  const [quizTime, setQuizTime] = useState(0);

  const { avatarUri, setAvatarUri, nicknameProvider, setNicknameProvider } = useUser();

  const [tempNickname, setTempNickname] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [advice, setAdvice] = useState(false);
  const [editAvatar, setEditAvatar] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const avatars = [...Array(20).keys()].map(i => ({ uri: `https://i.postimg.cc/${["cHrDSh5G/avatar1.png","J4KwQ6JR/avatar2.png","rynCC5mv/avatar3.png","SxpXWKWB/avatar4.png","MKtHgJN4/avatar5.png","NFzVrMLS/avatar6.png","x1w24sfh/avatar7.png","nVDwdHjF/avatar8.png","65HRnZWy/avatar9.png","MHHZSvhF/avatar10.png","SNjLZdtW/avatar11.png","Pr8ppRRF/avatar12.png","65RVJqt3/avatar13.png","9QC76BL8/avatar14.png","RhwW83Kx/avatar15.png","wTHMMjD3/avatar16.png","TPZY6dRd/avatar17.png","63fsmtq1/avatar18.png","HxHR5Rz0/avatar19.png","vBdMK1my/bottts-1744605532872.png"][i]}` }));

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid, "resultados", "ultimo");
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setRightAnswers(data.acertos || 0);
            setQuizDate(data.data || "");
            setQuizTime(data.tempo || 0);
            setTotalQuestions(10); // mude o total de questoes aqui 
          }
        }
      } catch (error) {
        console.error("Erro ao buscar resultado do quiz:", error);
      }
    };
    fetchQuizData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDoc = await db.collection("users").doc(currentUser.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            if (userData?.avatar) setAvatarUri(userData.avatar);
            if (userData?.nickname) setNicknameProvider(userData.nickname);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };
    fetchUserData();
  }, []);

  const desempenho = totalQuestions > 0 ? rightAnswers / totalQuestions : 0;

  let desempenhoTexto = "";
  if (rightAnswers <= 2) desempenhoTexto = "Você pode melhorar. Continue praticando!";
  else if (rightAnswers <= 4) desempenhoTexto = "Bom começo! Com mais prática, \nvocê vai melhorar ainda mais.";
  else if (rightAnswers <= 6) desempenhoTexto = "Está indo bem, mas ainda há espaço para aprimorar!";
  else if (rightAnswers <= 8) desempenhoTexto = "Ótimo desempenho! Continue assim!";
  else desempenhoTexto = "Parabéns! Você alcançou a nota máxima, excelente trabalho!";

  const handleEditPress = () => setIsEditing(true);

  const handleSave = async () => {
    if (tempNickname.trim() === "") {
      setAdvice(true);
    } else {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            nickname: tempNickname.trim(),
          });
          setNicknameProvider(tempNickname.trim());
          setAdvice(false);
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Erro ao salvar nickname:", error);
      }
    }
  };

  const saveAvatar = async () => {
    const selectedAvatarUri = avatars[currentIndex].uri;
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          avatar: selectedAvatarUri,
        });
        setAvatarUri(selectedAvatarUri);
        setEditAvatar(false);
      }
    } catch (error) {
      console.error("Erro ao salvar avatar:", error);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? avatars.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((next) => (next === avatars.length - 1 ? 0 : next + 1));
  };

  const strokeWidth = 10;
  const size = 120;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = desempenho * 100;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Perfil</Text>
          </View>

          <View style={styles.body}>
            {/* avatar */}
            {editAvatar ? (
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}>
                <TouchableOpacity onPress={handlePrev}><Ionicons name="chevron-back-circle" size={30} color="#333" /></TouchableOpacity>
                <Image source={avatars[currentIndex]} style={styles.profileImage} />
                <TouchableOpacity onPress={handleNext}><Ionicons name="chevron-forward-circle" size={30} color="#333" /></TouchableOpacity>
              </View>
            ) : (
              <Image source={{ uri: avatarUri || avatars[0].uri }} style={styles.profileImage} />
            )}
            <TouchableOpacity onPress={() => editAvatar ? saveAvatar() : setEditAvatar(true)}>
              <Text style={{ fontWeight: "bold", color: "#447f78", marginTop: 10 }}>
                {editAvatar ? "Salvar Avatar" : "Editar foto"} <FontAwesome5 name="pen" size={14} color="#447f78" />
              </Text>
            </TouchableOpacity>

            {/* nickname */}
            <Text style={styles.sectionTitle}>Seu Nickname</Text>
            <View style={styles.nicknameContainer}>
              {isEditing ? (
                <>
                  <TextInput
                    value={tempNickname}
                    onChangeText={setTempNickname}
                    style={{ flex: 1, color: "grey", fontWeight: "bold" }}
                    autoFocus
                  />
                  <TouchableOpacity onPress={handleSave}>
                    <FontAwesome5 name="check" size={18} color="green" />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={{ flex: 1, color: "grey", fontWeight: "bold", paddingVertical: "4%" }}>{nicknameProvider}</Text>
                  <TouchableOpacity onPress={handleEditPress}>
                    <FontAwesome5 name="pen" size={18} color="black" />
                  </TouchableOpacity>
                </>
              )}
            </View>
            {advice && <Text style={{ color: "red", fontSize: 12 }}>Preencha o campo do Nickname!</Text>}

            {/* desempenho */}
            <Text style={styles.sectionTitle}>Seu Desempenho</Text>
            <Text style={styles.desempenho}>{desempenhoTexto}</Text>
            <View style={{ marginTop: 30, alignItems: "center" }}>
              <Svg width={size} height={size}>
                <Circle stroke="#ccc" fill="none" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
                <Circle stroke="#4CAF50" fill="none" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" rotation="-90" origin={`${size / 2}, ${size / 2}`} />
              </Svg>
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressText}>{`${Math.round(progress)}%`}</Text>
              </View>
            </View>

            {/* resultado */}
            <View style={styles.quizInfoBox}>
              <Text style={styles.quizTitle}>📊 Último Quiz</Text>
              <View style={styles.quizRow}><Text style={styles.quizLabel}>Acertos:</Text><Text style={styles.quizValue}>{`${rightAnswers}/${totalQuestions}`}</Text></View>
              <View style={styles.quizRow}><Text style={styles.quizLabel}>Realizado em:</Text><Text style={styles.quizValue}>{quizDate}</Text></View>
              <View style={styles.quizRow}><Text style={styles.quizLabel}>Tempo:</Text><Text style={styles.quizValue}>{`${quizTime} segundos`}</Text></View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#349f95",
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  body: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  profileImage: {
    width: 140,
    height: 140,
    marginTop: 10,
    borderRadius: 75,
    backgroundColor: "#dddbdc",
    borderWidth: 4,
    borderColor: "#fff",
  },
  sectionTitle: {
    marginTop: 30,
    textAlign: "center",
    fontWeight: "bold",
    color: "#447f78",
  },
  nicknameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
    height: 52,
    padding: "1%",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "grey",
  },
  desempenho: {
    textAlign: "center",
    width: 300,
    height: 50,
    padding: 5,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "grey",
    color: "grey",
    fontWeight: "bold",
  },
  progressTextContainer: {
    position: "absolute",
    top: 45,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  progressText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "grey",
  },
  quizInfoBox: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    width: "85%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quizTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#2f7166",
    marginBottom: 10,
    textAlign: "center",
  },
  quizRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  quizLabel: {
    fontWeight: "600",
    color: "#555",
  },
  quizValue: {
    fontWeight: "bold",
    color: "#333",
  },
});
