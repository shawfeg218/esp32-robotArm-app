import React from 'react';
import styles from '@/styles/ArmControl.module.css';
import { Spacer } from '@nextui-org/react';
import { useUser } from '@supabase/auth-helpers-react';

export default function ArmControlView(props) {
  const user = useUser();
  const role = user?.user_metadata?.role;

  const {
    controlMode,
    targetAngles,
    currentAngles,
    dancing,
    setDancing,
    speaking,
    setSpeaking,
    handleChange,
    handleReset,
    handleCorrectAction,
    handleWrongAction,
    handleGrabAction,
    handleSpeakAction,
    // handleResetWifi,
  } = props;

  return (
    <div className={styles.container}>
      <div className={styles.controlPanel}>
        {role === 'teacher' || controlMode === 'single' ? null : (
          <div className="absolute left-0 w-full h-full flex justify-center bg-slate-100/75">
            <h2 className="mt-64 hover:cursor-default">教師控制中</h2>
          </div>
        )}
        <h2>右手</h2>
        <Spacer y={2.5} />
        <h4>E軸角度：{targetAngles.E}°</h4>
        <input
          type="range"
          min="50"
          max="160"
          value={targetAngles.E}
          onChange={(e) => handleChange('E', e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <Spacer y={2.5} />
        <h4>F軸角度：{targetAngles.F}°</h4>
        <input
          type="range"
          min="30"
          max="150"
          value={targetAngles.F}
          onChange={(e) => handleChange('F', e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <Spacer y={2.5} />
        <h4>G軸角度：{targetAngles.G}°</h4>
        <input
          type="range"
          min="0"
          max="150"
          value={targetAngles.G}
          onChange={(e) => handleChange('G', e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <Spacer y={2.5} />
        <h4>H軸角度：{targetAngles.H}°</h4>
        <input
          type="range"
          min="60"
          max="120"
          value={targetAngles.H}
          onChange={(e) => handleChange('H', e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>
      <div className={styles.controlPanel}>
        {role === 'teacher' || controlMode === 'single' ? null : (
          <div className="absolute left-0 w-full h-full flex justify-center bg-slate-100/75">
            <h2 className="mt-64 hover:cursor-default">教師控制中</h2>
          </div>
        )}
        <h2>左手</h2>
        <Spacer y={2.5} />
        <h4>A軸角度：{targetAngles.A}°</h4>
        <input
          type="range"
          min="0"
          max="90"
          value={targetAngles.A}
          onChange={(e) => handleChange('A', e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <Spacer y={2.5} />
        <h4>B軸角度：{targetAngles.B}°</h4>
        <input
          type="range"
          min="30"
          max="150"
          value={targetAngles.B}
          onChange={(e) => handleChange('B', e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <Spacer y={2.5} />
        <h4>C軸角度：{targetAngles.C}°</h4>
        <input
          type="range"
          min="0"
          max="150"
          value={targetAngles.C}
          onChange={(e) => handleChange('C', e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <Spacer y={2.5} />
        <h4>D軸角度：{targetAngles.D}°</h4>
        <input
          type="range"
          min="120"
          max="170"
          value={targetAngles.D}
          onChange={(e) => handleChange('D', e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>

      <div className={styles.columnContainer}>
        <div className={styles.servoState}>
          <h2>Servo</h2>
          <div className="flex">
            <h5 className="w-1/2">A軸-當前角度：{currentAngles.A}°</h5>
            <h5 className="w-1/2 ml-6">目標角度：{targetAngles.A}°</h5>
          </div>
          <div className="flex">
            <h5 className="w-1/2">B軸-當前角度：{currentAngles.B}°</h5>
            <h5 className="w-1/2 ml-6">目標角度：{targetAngles.B}°</h5>
          </div>
          <div className="flex">
            <h5 className="w-1/2">C軸-當前角度：{currentAngles.C}°</h5>
            <h5 className="w-1/2 ml-6">目標角度：{targetAngles.C}°</h5>
          </div>
          <div className="flex">
            <h5 className="w-1/2">D軸-當前角度：{currentAngles.D}°</h5>
            <h5 className="w-1/2 ml-6">目標角度：{targetAngles.D}°</h5>
          </div>
          <div className="flex">
            <h5 className="w-1/2">E軸-當前角度：{currentAngles.E}°</h5>
            <h5 className="w-1/2 ml-6">目標角度：{targetAngles.E}°</h5>
          </div>
          <div className="flex">
            <h5 className="w-1/2">F軸-當前角度：{currentAngles.F}°</h5>
            <h5 className="w-1/2 ml-6">目標角度：{targetAngles.F}°</h5>
          </div>
          <div className="flex">
            <h5 className="w-1/2">G軸-當前角度：{currentAngles.G}°</h5>
            <h5 className="w-1/2 ml-6">目標角度：{targetAngles.G}°</h5>
          </div>
          <div className="flex">
            <h5 className="w-1/2">H軸-當前角度：{currentAngles.H}°</h5>
            <h5 className="w-1/2 ml-6">目標角度：{targetAngles.H}°</h5>
          </div>
        </div>

        <div className={styles.btnContainer}>
          {role === 'teacher' || controlMode === 'single' ? null : (
            <div className="absolute top-0 left-0 w-full h-full flex justify-center bg-slate-100/75">
              <h2 className="mt-28 hover:cursor-default">教師控制中</h2>
            </div>
          )}
          <div className="w-full h-44 mb-3 py-2 flex flex-wrap justify-between items-center">
            <button className={styles.controlBtn} onClick={handleReset}>
              返回初始狀態
            </button>
            <button className={styles.controlBtn} onClick={handleCorrectAction}>
              答對動作
            </button>
            <button className={styles.controlBtn} onClick={handleWrongAction}>
              答錯動作
            </button>
            <button className={styles.controlBtn} onClick={handleGrabAction}>
              抓動作
            </button>
            <button
              className={styles.controlBtn}
              onClick={() => {
                setSpeaking(!speaking);
                if (speaking === true) {
                  setSpeaking(false);
                }
              }}
            >
              {speaking ? '停止...' : '說話動作'}
            </button>
            <button
              className={styles.controlBtn}
              onClick={() => {
                setDancing(!dancing);
                if (dancing === true) {
                  setDancing(false);
                }
              }}
            >
              {dancing ? '停止...' : '跳舞'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
