import React from 'react';
import tw, { styled } from 'twin.macro';

const SvgContainer = styled.svg`
  ${tw`fill-current`}
  ${({ color }) => (color != null ? `color: ${color};` : null)}
`;

const AlertCircle: React.FC<Client.SVG.SvgProps> = ({ width, height, className, color }) => (
  <SvgContainer
    width={width}
    height={height}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color={color}
    className={className}
  >
    <path
      d="M20 36.6666C29.2047 36.6666 36.6667 29.2047 36.6667 20C36.6667 10.7952 29.2047 3.33331 20 3.33331C10.7953 3.33331 3.33334 10.7952 3.33334 20C3.33334 29.2047 10.7953 36.6666 20 36.6666Z"
      stroke="black"
      strokeWidth="3.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 13.3333V20"
      stroke="black"
      strokeWidth="3.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 26.6667H20.0167"
      stroke="black"
      strokeWidth="3.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgContainer>
);

export default AlertCircle;
