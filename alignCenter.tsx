import React from 'react';
import tw, { styled } from 'twin.macro';

const SvgContainer = styled.svg`
  ${tw`fill-current`}
  ${({ color }) => (color != null ? `color: ${color};` : null)}
`;

const AlignCenter: React.FC<Client.SVG.SvgProps> = ({ width, height, className, color }) => (
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
      d="M30 16.6667H10"
      stroke="black"
      strokeWidth="3.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M35 10H5"
      stroke="black"
      strokeWidth="3.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M35 23.3333H5"
      stroke="black"
      strokeWidth="3.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M30 30H10"
      stroke="black"
      strokeWidth="3.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgContainer>
);

export default AlignCenter;
