// file: webapp\src\contexts\AppContext.js
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { createContext, useState } from 'react';
const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const role = user?.user_metadata?.role;

  const [displaySidebar, setDisplaySidebar] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [point, setPoint] = useState(0);
  const [connectedDeviceName, setConnectedDeviceName] = useState('');
  const [connectedMacAddress, setConnectedMacAddress] = useState('');
  const [connecting, setConnecting] = useState(false);

  const [socket, setSocket] = useState(null);
  const [teacherPath, setTeacherPath] = useState(null);
  const [controlMode, setControlMode] = useState('single');

  return (
    <AppContext.Provider
      value={{
        // supabase
        supabase,
        user,
        role,
        // socket
        socket,
        setSocket,
        teacherPath,
        setTeacherPath,
        // states
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
        controlMode,
        setControlMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
