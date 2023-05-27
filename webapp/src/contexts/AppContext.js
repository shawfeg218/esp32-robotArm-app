// file: webapp\src\contexts\AppContext.js
import { createContext, useState } from 'react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [point, setPoint] = useState(0);
  const [connectedDeviceName, setConnectedDeviceName] = useState('');
  const [connectedMacAddress, setConnectedMacAddress] = useState('');
  const [connected, setConnected] = useState(false);

  return (
    <AppContext.Provider
      value={{
        selectedSubject,
        setSelectedSubject,
        point,
        setPoint,
        connectedDeviceName,
        setConnectedDeviceName,
        connectedMacAddress,
        setConnectedMacAddress,
        connected,
        setConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
