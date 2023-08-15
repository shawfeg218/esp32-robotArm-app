// Esp32Devices.jsx
import { useState, useEffect, useContext } from 'react';
import AppContext from '@/contexts/AppContext';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import styles from '@/styles/Esp32Devices.module.css';
import { AiOutlineDelete } from 'react-icons/ai';
import { AiOutlineEdit } from 'react-icons/ai';
import { GrConnect } from 'react-icons/gr';
import { Input, Spacer, Modal, Button } from '@nextui-org/react';
import Toast from '../Toast';

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

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalHeader, setModalHeader] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deviceToDeleteIndex, setDeviceToDeleteIndex] = useState(null);
  const { setConnecting, setConnectedMacAddress, setConnectedDeviceName } = useContext(AppContext);

  const onCloseToast = () => {
    setShowToast(false);
    setToastMessage('');
    setToastType('');
  };

  const onCloseModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  const handleConnect = (deviceName, macAddress) => {
    setConnectedDeviceName(deviceName);
    setConnectedMacAddress(macAddress);
    setConnecting(true);
    setShowToast(true);
    setToastMessage(`Connecting to ${deviceName}...`);
    setToastType('');
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
      setLoading(false);
    }
  }

  async function addDevice() {
    if (!addDeviceName || !addMacAddress) {
      setShowModal(true);
      setModalHeader('Add Device Failed!');
      setModalMessage('Please enter device name and address!');
      return;
    }

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
      setShowToast(true);
      setToastMessage(`${addDeviceName} added!`);
      setToastType('check');
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
      setShowToast(true);
      setToastMessage(`${deviceToDelete.device_name} deleted!`);
      setToastType('warning');
      setDeviceToDeleteIndex(null);
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

    if (!editDeviceName || !editMacAddress) {
      setShowModal(true);
      setModalHeader('Update Device Failed!');
      setModalMessage('Please enter device name and address!');
      return;
    }

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
      setShowToast(true);
      setToastMessage(`${editDeviceName} updated!`);
      setToastType('check');
    } catch (error) {
      alert('Error updating device!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {showToast && <Toast message={toastMessage} icon={toastType} onClose={onCloseToast} />}

      <div className={styles.container}>
        <div className={styles.esp32Devices}>
          <h2>Devices</h2>
          <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
            <Spacer y={1} />
            <Modal.Body>
              <h1 className="text-3xl text-red-700">確定刪除?</h1>
              <h1 className="text-xl">
                Device:{' '}
                {deviceToDeleteIndex !== null && devices[deviceToDeleteIndex]
                  ? devices[deviceToDeleteIndex].device_name
                  : ''}
              </h1>
              <h1 className="text-xl">
                MacAddress:{' '}
                {deviceToDeleteIndex !== null && devices[deviceToDeleteIndex]
                  ? devices[deviceToDeleteIndex].mac_address
                  : ''}
              </h1>
            </Modal.Body>
            <Modal.Footer className="justify-center">
              <div className="flex justify-around w-full">
                <button
                  className="text-white border-0 w-32 rounded-xl bg-blue-600"
                  onClick={() => {
                    setShowDeleteModal(false);
                    handleDeviceDelete(deviceToDeleteIndex);
                  }}
                >
                  Yes
                </button>
                <button
                  className="text-white border-0 w-32 rounded-xl bg-blue-600"
                  onClick={() => {
                    setShowDeleteModal(false);
                  }}
                >
                  No
                </button>
              </div>
            </Modal.Footer>
          </Modal>
          {editingDeviceIndex === null ? (
            <ul>
              {devices.length > 0 ? (
                devices.map((device, index) => (
                  <li
                    key={index}
                    className="hover:cursor-pointer hover:bg-slate-100 active:bg-slate-100"
                    onClick={() => handleConnect(device.device_name, device.mac_address)}
                  >
                    <div className={styles.listItems}>
                      <p>
                        {device.device_name}: <span>{device.mac_address}</span>
                      </p>
                      <div className={styles.editIcons}>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteModal(true);
                            setDeviceToDeleteIndex(index);
                          }}
                        >
                          <AiOutlineDelete className="reactIcons" size="1.3rem" />
                        </div>

                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeviceEdit(index);
                          }}
                        >
                          <AiOutlineEdit className="reactIcons" size="1.3rem" />
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
                <Button size="sm" onClick={() => handleDeviceUpdate(editingDeviceIndex)}>
                  更新
                </Button>
                <Button size="sm" onClick={() => handleDeviceEdit(null)}>
                  取消
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className={styles.addDeviceForm}>
          <h2>Add a new device</h2>
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
            <Modal open={showModal} onClose={onCloseModal}>
              <Modal.Header>
                <h1 className="text-3xl text-red-700">{modalHeader}</h1>
              </Modal.Header>
              <Modal.Body>
                <h1 className="text-xl text-center">{modalMessage}</h1>
              </Modal.Body>
              <Modal.Footer className="justify-center">
                <Button onClick={onCloseModal}>Close</Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}
