import React from "react";
import styled from "styled-components";

interface GlowingSwitchProps {
  isOn: boolean;
  setIsOn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GlowingSwitch = ({ isOn, setIsOn }: GlowingSwitchProps) => {
  const handleToggle = () => setIsOn((prev) => !prev);

  return (
    <StyledWrapper $isOn={isOn}>
      <label className="label">
        <div className="toggle">
          <input
            className="toggle-state"
            type="checkbox"
            checked={isOn}
            onChange={handleToggle}
          />
          <div className="indicator" />
        </div>
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $isOn: boolean }>`
  .label {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    color: #394a56;
  }

  .toggle {
    isolation: isolate;
    position: relative;
    height: 30px;
    width: 60px;
    border-radius: 15px;
    overflow: hidden;
    box-shadow:
      -8px -4px 8px 0px #ffffff,
      8px 4px 12px 0px #d1d9e6,
      4px 4px 4px 0px #d1d9e6 inset,
      -4px -4px 4px 0px #ffffff inset;
  }

  .toggle-state {
    display: none;
  }

  .indicator {
    height: 100%;
    width: 200%;
    border-radius: 15px;
    transform: ${({ $isOn }) =>
      $isOn ? "translate3d(25%, 0, 0)" : "translate3d(-75%, 0, 0)"};
    transition:
      transform 0.4s cubic-bezier(0.85, 0.05, 0.18, 1.35),
      background 0.4s,
      box-shadow 0.4s,
      filter 0.4s;
    background: ${({ $isOn }) => ($isOn ? "#3ce0c0" : "#ff6633")};
    filter: ${({ $isOn }) => ($isOn ? "brightness(1.15)" : "brightness(1.1)")};
    animation: ${({ $isOn }) =>
      $isOn
        ? "glowOn 2s ease-in-out infinite"
        : "glowOff 2s ease-in-out infinite"};
    box-shadow: ${({ $isOn }) =>
      $isOn
        ? `
    0 0 6px #3ce0c0,
    0 0 12px #3ce0c0,
    0 0 18px #3ce0c0,
    4px 4px 12px #d1d9e6`
        : `
    0 0 6px #ff6633,
    0 0 12px #ff6633,
    0 0 18px #ff6633,
    4px 4px 12px #d1d9e6`};
  }
`;
