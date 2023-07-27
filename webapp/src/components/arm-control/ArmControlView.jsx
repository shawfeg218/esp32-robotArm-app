// file: ArmControl.js
import React from 'react';
import styles from '@/styles/ArmControl.module.css';
import Link from 'next/link';
import { Spacer } from '@nextui-org/react';
import { useUser } from '@supabase/auth-helpers-react';

export default function ArmControlView(props) {
  const user = useUser();
  const role = user?.user_metadata?.role;

  const {
    controlMode,
    targetAngles,
    currentAngles,
    handleChange,
    handleReset,
    handleCorrectAction,
    handleWrongAction,
    handleGrabAction,
    handleResetWifi,
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
        <Spacer y={2} />
        <div>E軸角度：{targetAngles.E}°</div>
        <input
          type="range"
          min="50"
          max="160"
          value={targetAngles.E}
          onChange={(e) => handleChange('E', e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <Spacer y={4} />
        <div>F軸角度：{targetAngles.F}°</div>
        <input
          type="range"
          min="30"
          max="150"
          value={targetAngles.F}
          onChange={(e) => handleChange('F', e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <Spacer y={4} />
        <div>G軸角度：{targetAngles.G}°</div>
        <input
          type="range"
          min="0"
          max="150"
          value={targetAngles.G}
          onChange={(e) => handleChange('G', e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <Spacer y={4} />
        <div>H軸角度：{targetAngles.H}°</div>
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
        <Spacer y={2} />
        <div>A軸角度：{targetAngles.A}°</div>
        <input
          type="range"
          min="0"
          max="90"
          value={targetAngles.A}
          onChange={(e) => handleChange('A', e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <Spacer y={4} />
        <div>B軸角度：{targetAngles.B}°</div>
        <input
          type="range"
          min="30"
          max="150"
          value={targetAngles.B}
          onChange={(e) => handleChange('B', e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <Spacer y={4} />
        <div>C軸角度：{targetAngles.C}°</div>
        <input
          type="range"
          min="0"
          max="150"
          value={targetAngles.C}
          onChange={(e) => handleChange('C', e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <Spacer y={4} />
        <div>D軸角度：{targetAngles.D}°</div>
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
          <div>
            A軸-當前角度：{currentAngles.A}° - 目標角度：{targetAngles.A}°
          </div>
          <div>
            B軸-當前角度：{currentAngles.B}° - 目標角度：{targetAngles.B}°
          </div>
          <div>
            C軸-當前角度：{currentAngles.C}° - 目標角度：{targetAngles.C}°
          </div>
          <div>
            D軸-當前角度：{currentAngles.D}° - 目標角度：{targetAngles.D}°
          </div>
          <div>
            E軸-當前角度：{currentAngles.E}° - 目標角度：{targetAngles.E}°
          </div>
          <div>
            F軸-當前角度：{currentAngles.F}° - 目標角度：{targetAngles.F}°
          </div>
          <div>
            G軸-當前角度：{currentAngles.G}° - 目標角度：{targetAngles.G}°
          </div>
          <div>
            H軸-當前角度：{currentAngles.H}° - 目標角度：{targetAngles.H}°
          </div>
        </div>

        <div className={styles.btnContainer}>
          {role === 'teacher' || controlMode === 'single' ? null : (
            <div className="absolute top-0 left-0 w-full h-full flex justify-center bg-slate-100/75">
              <h2 className="mt-32 hover:cursor-default">教師控制中</h2>
            </div>
          )}
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
          <button className={styles.controlBtn} onClick={handleResetWifi}>
            重置wifi
          </button>
          <Link href="/device" passHref>
            <button className={styles.controlBtn}>連線設置</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
