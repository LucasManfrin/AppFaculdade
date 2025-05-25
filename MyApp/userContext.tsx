import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserContextType = {
  avatarUri: string;
  setAvatarUri: (uri: string) => void;
  nicknameProvider: string;
  setNicknameProvider: (name: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [avatarUri, setAvatarUriState] = useState("");
  const [nicknameProvider, setNicknameProviderState] = useState("");

  // Carrega os dados do AsyncStorage apenas uma vez
  useEffect(() => {
    const loadUserData = async () => {
      const storedAvatar = await AsyncStorage.getItem("avatarUri");
      const storedNickname = await AsyncStorage.getItem("nickname");

      if (storedAvatar) setAvatarUriState(storedAvatar);
      if (storedNickname) setNicknameProviderState(storedNickname);
    };

    loadUserData();
  }, []);

  // Ao mudar o nickname ou avatar, salva no AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem("avatarUri", avatarUri);
  }, [avatarUri]);

  useEffect(() => {
    AsyncStorage.setItem("nickname", nicknameProvider);
  }, [nicknameProvider]);

  const setAvatarUri = (uri: string) => {
    setAvatarUriState(uri);
  };

  const setNicknameProvider = (name: string) => {
    setNicknameProviderState(name);
  };

  return (
    <UserContext.Provider
      value={{
        avatarUri,
        setAvatarUri,
        nicknameProvider,
        setNicknameProvider,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUser must be used within a UserProvider");
  return context;
};
