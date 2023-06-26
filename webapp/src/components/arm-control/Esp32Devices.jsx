import { useState, useEffect, useContext } from 'react';
import AppContext from '@/contexts/AppContext';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import styles from '@/styles/Esp32Devices.module.css';
import { AiOutlineDelete } from 'react-icons/ai';
import { AiOutlineEdit } from 'react-icons/ai';
import { GrConnect } from 'react-icons/gr';
import { Input, Spacer, Button } from '@nextui-org/react';

export default function Esp32Devices() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [addDeviceName, setAddDeviceName] = useState('');
  const [addMacAddress, setAddMacAddress] = useState('');
  const [editingDeviceIndex, setEditingDeviceIndex] = useState(null);
  const [editDeviceName, setEditDeviceName] = useState('');
  const [editMacAddress, setEditMacAddress] = useState('');
  const { setConnectedMacAddress, setConnectedDeviceName } = useContext(AppContext);

  const handleConnect = (deviceName, macAddress) => {
    setConnectedDeviceName(deviceName);
    setConnectedMacAddress(macAddress);
  };

  useEffect(() => {
    getDevices();
  }, []);

  async function getDevices() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('esp32_devices')
        .select('*')
        .eq('user_id', user.id)
        .order('inserted_at', { ascending: false });

      if (error) {
        throw error;
      }

      setDevices(data);
    } catch (error) {
      alert('Error loading devices!');
      console.log(error);
    } finally {
      console.log(devices);
      setLoading(false);
    }
  }

  async function addDevice() {
    try {
      setLoading(true);

      const newDevice = {
        user_id: user.id,
        device_name: addDeviceName,
        mac_address: addMacAddress,
        inserted_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('esp32_devices').insert(newDevice);
      if (error) {
        throw error;
      }

      setAddDeviceName('');
      setAddMacAddress('');
      getDevices();
    } catch (error) {
      alert('Error adding device!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeviceDelete(index) {
    const deviceToDelete = devices[index];

    try {
      setLoading(true);

      const { error } = await supabase.from('esp32_devices').delete().eq('id', deviceToDelete.id);

      if (error) {
        throw error;
      }

      const updatedDevices = devices.filter((device) => device.id !== deviceToDelete.id);
      setDevices(updatedDevices);
      getDevices();
    } catch (error) {
      alert('Error deleting device!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function handleDeviceEdit(index) {
    if (editingDeviceIndex === index) {
      setEditingDeviceIndex(null);
    } else {
      setEditingDeviceIndex(index);
    }
  }

  async function handleDeviceUpdate(index) {
    const deviceToUpdate = devices[index];

    try {
      setLoading(true);

      const { error } = await supabase
        .from('esp32_devices')
        .update({
          device_name: editDeviceName,
          mac_address: editMacAddress,
        })
        .eq('id', deviceToUpdate.id);

      if (error) {
        throw error;
      }

      setEditingDeviceIndex(null);
      setEditDeviceName('');
      setEditMacAddress('');
      getDevices();
    } catch (error) {
      alert('Error updating device!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.esp32Devices}>
        <h3>Devices</h3>
        {editingDeviceIndex === null ? (
          <ul>
            {devices.length > 0 ? (
              devices.map((device, index) => (
                <li key={index}>
                  <div className={styles.listItems}>
                    <p>
                      {device.device_name}: <span>{device.mac_address}</span>
                    </p>
                    <div className={styles.editIcons}>
                      <div onClick={() => handleDeviceDelete(index)}>
                        <AiOutlineDelete className="reactIcons" size="1rem" />
                      </div>
                      <div onClick={() => handleDeviceEdit(index)}>
                        <AiOutlineEdit className="reactIcons" size="1rem" />
                      </div>
                      <div onClick={() => handleConnect(device.device_name, device.mac_address)}>
                        <GrConnect className="reactIcons" size="1rem" />
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p>No devices added yet.</p>
            )}
          </ul>
        ) : (
          <div className="w-full pr-6">
            <Input
              label="Device Name"
              color="default"
              clearable
              fullWidth
              bordered
              borderWeight="light"
              name="editDeviceName"
              placeholder={devices[editingDeviceIndex].device_name}
              value={editDeviceName}
              onChange={(e) => setEditDeviceName(e.target.value)}
            />
            <Spacer y={0.5} />

            <Input
              label="Mac Address"
              color="default"
              clearable
              fullWidth
              bordered
              borderWeight="light"
              name="editMacAddress"
              placeholder={devices[editingDeviceIndex].mac_address}
              value={editMacAddress}
              onChange={(e) => setEditMacAddress(e.target.value)}
            />
            <div className="mt-2 flex justify-between">
              <button
                className="border-0 w-36 rounded-xl bg-blue-600"
                onClick={() => handleDeviceUpdate(editingDeviceIndex)}
              >
                Update
              </button>
              <button
                className="border-0 w-36 rounded-xl bg-blue-600"
                bg-blue-600
                onClick={() => handleDeviceEdit(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <div className={styles.addDeviceForm}>
        <h3>Add a new device</h3>
        <Input
          label="Device Name"
          color="default"
          clearable
          fullWidth
          bordered
          id="deviceName"
          value={addDeviceName}
          onChange={(e) => setAddDeviceName(e.target.value)}
        />
        <Spacer y={0.5} />

        <Input
          label="Mac Address"
          color="default"
          clearable
          fullWidth
          bordered
          id="macAddress"
          value={addMacAddress}
          onChange={(e) => setAddMacAddress(e.target.value)}
        />
        <Spacer y={0.5} />

        <div>
          <Button className="w-full" onClick={addDevice} disabled={loading}>
            {loading ? 'Loading ...' : 'Add Device'}
          </Button>
        </div>
      </div>
    </div>
  );
}
