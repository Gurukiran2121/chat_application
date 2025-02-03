import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { axiosInstance } from "./axiosInstance";
import { notification } from "antd";
import { io } from "socket.io-client";
import { AxiosError } from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface loginPayload {
  email: string;
  password: string;
}

interface signUpPayload {
  name: string;
  email: string;
  password: string;
}

interface AppContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: loginPayload) => Promise<void>;
  signUp: (payload: signUpPayload) => Promise<void>;
  logOut: () => Promise<void>;
  strangers: unknown[] | null;
  allUsers: () => void;
  isLoadingUsers: boolean;
  postMessage: (payload: { message: string }, userId: string) => Promise<void>;
  isCheckingAuth: boolean;
  checkAuth: () => void;
  conversation: unknown[];
  getConversation: (userToSend: string) => Promise<void>;
  selectedUserId: string;
  setSelectedUserId: (state: string) => void;
  onlineUsers: { [key: string]: string };
  getRealTimeMessage: () => void;
  stopRealTimeMessage: () => void;
  isLoadingConversation: boolean;
}

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

const AppContextProvider: React.FC<AppContextProviderProps> = React.memo(
  ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [strangers, setStrangers] = useState<unknown[] | null>(null);
    const [conversation, setConversation] = useState<unknown[]>([]);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [socketConnection, setSocketConnection] = useState<any>(null);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [isLoadingConversation, setIsLoadingConversation] = useState(true);

    const connectSocket = (user: any) => {
      if (!user || socketConnection?.connected) return;
      const socket = io(import.meta.env.VITE_SERVER_BASE_URL, {
        query: {
          userId: user?._id,
        },
      });
      socket.connect();
      setSocketConnection(socket);
      socket.on("getOnlineUsers", (data) => {
        setOnlineUsers(data);
      });
    };

    const getRealTimeMessage = () => {
      socketConnection.on("getSentMessage", (message: object | unknown[]) => {
        setConversation([...conversation, message]);
      });
    };

    const stopRealTimeMessage = () => {
      socketConnection.off("getSentMessage");
    };

    const disconnectSocket = () => {
      if (socketConnection?.connected) {
        socketConnection?.disconnect();
      }
    };

    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("/auth/check-auth");
        setUser(response.data);
        setIsAuthenticated(true);
        setIsCheckingAuth(false);
        connectSocket(response.data);
      } catch (error) {
        setIsCheckingAuth(false);
        setIsAuthenticated(false);
        console.error("User authentication failed:", error);
        return null;
      }
    };

    const login = async (payload: loginPayload) => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.post("/auth/login", payload);
        notification.success({
          message: "Login Successful",
          description:
            response.data.message || "You have successfully signed in!",
        });
        setUser(response.data);
        connectSocket(response.data);
        setIsLoading(false);
        setIsAuthenticated(true);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        notification.error({
          message: "Login Failed",
          description:
            error.response?.data?.message ||
            "An error occurred. Please try again.",
        });
        console.error(`Error submitting login from ${error}`);
        setIsLoading(false);
        setIsAuthenticated(false);
      }
    };

    const signUp = async (payload: signUpPayload) => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.post("/auth/signup", payload);
        notification.success({
          message: "Sign Up Successful",
          description:
            response.data.message || "You have successfully signed up!",
        });
        setIsAuthenticated(false); //since user has to verify the email and again will be pushed to login screen
        setIsLoading(false);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        notification.error({
          message: "Sign Up Failed",
          description:
            error.response?.data?.message ||
            "An error occurred. Please try again.",
        });
        console.error("Error signing up the user " + error);
        setIsLoading(false);
        setIsAuthenticated(false);
      }
    };

    const logOut = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.post("/auth/logout");
        notification.success({
          message: "Error",
          description: response.data.message || "logout successful",
        });
        setIsAuthenticated(false);
        disconnectSocket();
        setIsLoading(false);
      } catch (error) {
        notification.error({
          message: "Error",
          description: "Error logging out.",
        });
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    };

    const allUsers = useCallback(async () => {
      try {
        const response = await axiosInstance.get("/message/users");
        const allStrangers = response.data;
        setStrangers(allStrangers);
        setIsLoadingUsers(false);
      } catch (error) {
        setIsLoadingUsers(false);
        notification.error({
          message: "Error",
          description: "Error getting all users.",
        });
        console.error(`error getting all users ${error}`);
      }
    }, []);

    const postMessage = async (
      payload: { message: string },
      userToSend: string
    ) => {
      try {
        const response = await axiosInstance.post(
          `/message/send/${userToSend}`,
          payload
        );
        setConversation([...conversation, response.data]);
      } catch (error) {
        console.error(`Error sending message ${error}`);
      }
    };

    const getConversation = async (userToSend: string) => {
      try {
        const response = await axiosInstance.get(`/message/${userToSend}`);
        setConversation(response.data);
        setIsLoadingConversation(false);
      } catch (error) {
        console.error(`Error getting the conversation ${error}`);
        setIsLoadingConversation(false);
      }
    };

    const contextValue: AppContextValue = {
      user,
      isLoading,
      isAuthenticated,
      login,
      signUp,
      logOut,
      strangers,
      allUsers,
      isLoadingUsers,
      postMessage,
      conversation,
      getConversation,
      checkAuth,
      isCheckingAuth,
      selectedUserId,
      setSelectedUserId,
      onlineUsers,
      getRealTimeMessage,
      stopRealTimeMessage,
      isLoadingConversation,
    };

    return (
      <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
    );
  }
);

export default AppContextProvider;

export const useAppContext = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error(
      "AppContext is undefined. Ensure you are wrapping your component tree with AppContextProvider."
    );
  }
  return context;
};
