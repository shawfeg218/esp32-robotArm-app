// file: webapp\src\contexts\AppContext.js
import { createContext, useState } from 'react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [displaySidebar, setDisplaySidebar] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [point, setPoint] = useState(0);
  const [connectedDeviceName, setConnectedDeviceName] = useState('');
  const [connectedMacAddress, setConnectedMacAddress] = useState('');
  const [connecting, setConnecting] = useState(false);

  return (
    <AppContext.Provider
      value={{
        displaySidebar,
        setDisplaySidebar,
        selectedSubject,
        setSelectedSubject,
        point,
        setPoint,
        connectedDeviceName,
        setConnectedDeviceName,
        connectedMacAddress,
        setConnectedMacAddress,
        connecting,
        setConnecting,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
