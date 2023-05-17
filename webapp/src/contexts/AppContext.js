// file: webapp\src\contexts\AppContext.js
import { createContext, useState } from 'react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [point, setPoint] = useState(0);
  const [history, setHistory] = useState([]);
  const [connectedDeviceName, setConnectedDeviceName] = useState('');
  const [connectedMacAddress, setConnectedMacAddress] = useState('');

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
        connectedDeviceName,
        setConnectedDeviceName,
        connectedMacAddress,
        setConnectedMacAddress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
