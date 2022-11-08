import React from 'react';
import tw, { styled } from 'twin.macro';

const SvgContainer = styled.svg`
  ${tw`fill-current`}
  ${({ color }) => (color != null ? `color: ${color};` : null)}
`;

const AlertOctagon: React.FC<Client.SVG.SvgProps> = ({ width, height, className, color }) => (
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
      d="M13.1 3.33331H26.9L36.6667 13.1V26.9L26.9 36.6666H13.1L3.33333 26.9V13.1L13.1 3.33331Z"
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

export default AlertOctagon;
