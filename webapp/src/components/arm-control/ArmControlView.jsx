// file: ArmControl.js
import React from 'react';
import styles from '@/styles/ArmControl.module.css';
import Esp32Status from './Esp32Status';

export default function ArmControlView(props) {
  const {
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
        <h2>Arm Control</h2>
        <div>A軸角度：{targetAngles.A}°</div>
        <input
          type="range"
          min="0"
          max="180"
          value={targetAngles.A}
          onChange={(e) => handleChange('A', e.target.value)}
        />
        <div>B軸角度：{targetAngles.B}°</div>
        <input
          type="range"
          min="0"
          max="180"
          value={targetAngles.B}
          onChange={(e) => handleChange('B', e.target.value)}
        />
        <div>C軸角度：{targetAngles.C}°</div>
        <input
          type="range"
          min="0"
          max="180"
          value={targetAngles.C}
          onChange={(e) => handleChange('C', e.target.value)}
        />
        <div>D軸角度：{targetAngles.D}°</div>
        <input
          type="range"
          min="0"
          max="180"
          value={targetAngles.D}
          onChange={(e) => handleChange('D', e.target.value)}
        />
        <div>E軸角度：{targetAngles.E}°</div>
        <input
          type="range"
          min="0"
          max="180"
          value={targetAngles.E}
          onChange={(e) => handleChange('E', e.target.value)}
        />
        <div>F軸角度：{targetAngles.F}°</div>
        <input
          type="range"
          min="0"
          max="180"
          value={targetAngles.F}
          onChange={(e) => handleChange('F', e.target.value)}
        />
      </div>

      <div>
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
        </div>
        <div className={styles.btnContainer}>
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
        </div>
      </div>

      <div>
        <Esp32Status />
      </div>
    </div>
  );
}
