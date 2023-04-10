import { createContext, useState } from 'react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [point, setPoint] = useState(0);
  const [history, setHistory] = useState([]);
  const [esp32WifiConnected, setEsp32WifiConnected] = useState(false);

  const addHistory = (subject, point) => {
    setHistory((prevHistory) => [
      ...prevHistory,
      { subject: subject, point: point },
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        selectedSubject,
        setSelectedSubject,
        point,
        setPoint,
        history,
        setHistory,
        addHistory,
        esp32WifiConnected,
        setEsp32WifiConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
