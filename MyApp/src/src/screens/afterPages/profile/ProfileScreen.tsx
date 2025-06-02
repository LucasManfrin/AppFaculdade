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
  ImageBackground,
  SafeAreaView
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useUser } from "../../../../../userContext";
import {db, auth} from "@/firebaseConfig";
import { doc, updateDoc, } from "firebase/firestore";


const ProfileScreen = () => {
  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await db.collection("users").doc(currentUser.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          
          if (userData) {
            if (userData.avatar) {
              setAvatarUri(userData.avatar);
            }
            if (userData.nickname) {
              setNicknameProvider(userData.nickname);
            }
          }
        } else {
          console.log("Documento do usuário não encontrado.");
        }
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  };

  fetchUserData();
}, []);

  const avatars = [
    { uri: "https://i.postimg.cc/cHrDSh5G/avatar1.png" },
    { uri: "https://i.postimg.cc/J4KwQ6JR/avatar2.png" },
    { uri: "https://i.postimg.cc/rynCC5mv/avatar3.png" },
    { uri: "https://i.postimg.cc/SxpXWKWB/avatar4.png" },
    { uri: "https://i.postimg.cc/MKtHgJN4/avatar5.png" },
    { uri: "https://i.postimg.cc/NFzVrMLS/avatar6.png" },
    { uri: "https://i.postimg.cc/x1w24sfh/avatar7.png" },
    { uri: "https://i.postimg.cc/nVDwdHjF/avatar8.png" },
    { uri: "https://i.postimg.cc/65HRnZWy/avatar9.png" },
    { uri: "https://i.postimg.cc/MHHZSvhF/avatar10.png" },
    { uri: "https://i.postimg.cc/SNjLZdtW/avatar11.png" },
    { uri: "https://i.postimg.cc/Pr8ppRRF/avatar12.png" },
    { uri: "https://i.postimg.cc/65RVJqt3/avatar13.png" },
    { uri: "https://i.postimg.cc/9QC76BL8/avatar14.png" },
    { uri: "https://i.postimg.cc/RhwW83Kx/avatar15.png" },
    { uri: "https://i.postimg.cc/wTHMMjD3/avatar16.png" },
    { uri: "https://i.postimg.cc/TPZY6dRd/avatar17.png" },
    { uri: "https://i.postimg.cc/63fsmtq1/avatar18.png" },
    { uri: "https://i.postimg.cc/HxHR5Rz0/avatar19.png" },
    { uri: "https://i.postimg.cc/vBdMK1my/bottts-1744605532872.png" },
  ];

  const { avatarUri, setAvatarUri, nicknameProvider, setNicknameProvider } =
    useUser();

    {
      /* ---Condições para existencia do nickname atualizado e para existencia do textInput--- */
    }
  const [tempNickname, setTempNickname] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [advice, setAdvice] = useState(false);
  const [editAvatar, setEditAvatar] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
          console.log("Nickname atualizado com sucesso.")
        }
      } catch (error) {
        console.error("Erro ao salvar nickname no Firestore:", error);
      }
    }
  };

  {
    /*--Condições para existencia do avatar atualizado e para existencia do array de seleçao-- */
  }
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
        console.log("Avatar atualizado com sucesso.")
      }
    } catch (error) {
      console.error("Erro ao salvar avatar no Firestore:", error);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? avatars.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((next) => (next === avatars.length - 1 ? 0 : next + 1));
  };

  const totalQuestions = 10;
  const RightQuetions = 7;
  const desempenho = RightQuetions / totalQuestions;

  let desempenhoTexto = "";
  if (RightQuetions <= 3) {
    desempenhoTexto = "Você pode melhorar. Continue praticando!";
  } else if (RightQuetions <= 5) {
    desempenhoTexto =
      "Bom começo! Com mais prática, \nvocê vai melhorar ainda mais.";
  } else if (RightQuetions <= 7) {
    desempenhoTexto = "Está indo bem, mas ainda há espaço para aprimorar!";
  } else if (RightQuetions <= 9) {
    desempenhoTexto = "Ótimo desempenho! Continue assim!";
  } else {
    desempenhoTexto =
      "Parabéns! Você alcançou a nota máxima, excelente trabalho!";
  }

    {
      /*Condições para existencia do círculo de desempenho*/;
    }
  const strokeWidth = 10;
  const size = 120;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = desempenho * 100;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View
            style={styles.containerColor}
          >
            <Text style={styles.title}>Perfil</Text>

            {/*--Condição de existencia usado com o usestate ao apertar o botão para alternar entre modos--*/}
            <View>
              {editAvatar ? ( // valor inicial é falso, portanto irá aparecer oq está depois do : (caso fosse verdadeiro, apareceria oq está antes do :)
                <>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity onPress={handlePrev}>
                      <Ionicons
                        name="chevron-back-circle"
                        size={30}
                        color="#333"
                      />
                    </TouchableOpacity>

                    <Image source={avatars[currentIndex]} style={styles.avatar} />

                    <TouchableOpacity onPress={handleNext}>
                      <Ionicons
                        name="chevron-forward-circle"
                        size={30}
                        color="#333"
                      />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={saveAvatar}>
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#447f78",
                      }}
                    >
                      Salvar Avatar
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Image
                    source={{
                      uri:
                        avatarUri || "https://i.postimg.cc/FHRCKxp4/user-1.png",
                    }}
                    style={styles.profileImage}
                  />

                  {/*Botão para edição de avatares*/}
                  <TouchableOpacity onPress={() => setEditAvatar(true)}>
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: "4%",
                        alignSelf: "center",
                      }}
                    >
                      <Text style={{ fontWeight: "bold", color: "#447f78" }}>
                        Editar foto
                      </Text>
                      <FontAwesome5 name="pen" size={18} color="#447f78" />
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/*--Condição de existencia usado com o usestate ao apertar o botão para alternar entre modos--*/}
            <View style={{ marginTop: 30 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#447f78",
                }}
              >
                Seu Nickname
              </Text>
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
                    <Text
                      style={{
                        flex: 1,
                        color: "grey",
                        fontWeight: "bold",
                        paddingVertical: "4%",
                      }}
                    >
                      {nicknameProvider}
                    </Text>
                    <TouchableOpacity onPress={handleEditPress}>
                      <FontAwesome5 name="pen" size={18} color="black" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
              {advice && (
                <Text style={{ color: "red", fontSize: 12 }}>
                  Preencha o campo do Nickname!
                </Text>
              )}
            </View>

            <View style={{ marginTop: 30 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#447f78",
                }}
              >
                Seu Desempenho
              </Text>
              <Text style={styles.desempenho}>{desempenhoTexto}</Text>
            </View>

            {/*-- Circunferencia com porcentagem do desempenho--*/}
            <View style={{ marginTop: 40, alignItems: "center" }}>
              <Svg width={size} height={size}>
                <Circle
                  stroke="#ccc"
                  fill="none"
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  strokeWidth={strokeWidth}
                />
                <Circle
                  stroke="#4CAF50"
                  fill="none"
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation="-90"
                  origin={`${size / 2}, ${size / 2}`}
                />
              </Svg>
              {/*--porcentagem do desempenho--*/}
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressText}>{`${Math.round(
                  progress
                )}%`}</Text>
              </View>

              <View style={styles.quizInfoContainer}>
                <Text style={{ fontWeight: "bold", color: "#447f78" }}>
                  Último Quiz
                </Text>
                <Text
                  style={{
                    alignSelf: "center",
                    color: "grey",
                    fontWeight: "bold",
                  }}
                >
                  {`${RightQuetions}/10`}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  containerColor:{
    backgroundColor: "#349f95",
    width: "100%",
    height: "23%",
    alignItems: "center",
    },
  title: {
    marginTop: 25, // Reduced from 70 to account for SafeAreaView padding
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  avatar: {
    width: 140,
    height: 140,
    marginTop: "13%",
    borderRadius: 75,
    backgroundColor: "#dddbdc",
    borderWidth: 4,
    borderColor: "#fff",
    padding: 15,
  },
  profileImage: {
    width: 140,
    height: 140,
    marginTop: 30,
    backgroundColor: "#dddbdc",
    borderColor: "#fff",
    borderWidth: 4,
    borderRadius: 120,
    padding: 10,
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
  quizInfoContainer: {
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 15,
    marginTop: "5%",
    padding: 6,
  },
});