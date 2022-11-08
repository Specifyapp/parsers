import React from 'react';
import tw, { styled } from 'twin.macro';

const SvgContainer = styled.svg`
  ${tw`fill-current`}
  ${({ color }) => (color != null ? `color: ${color};` : null)}
`;

const AlertTriangle: React.FC<Client.SVG.SvgProps> = ({ width, height, className, color }) => (
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
      d="M17.15 6.43331L3.03334 30C2.74228 30.504 2.58828 31.0755 2.58665 31.6575C2.58502 32.2395 2.73582 32.8119 3.02405 33.3175C3.31227 33.8232 3.72788 34.2446 4.22952 34.5397C4.73115 34.8349 5.30134 34.9936 5.88334 35H34.1167C34.6987 34.9936 35.2689 34.8349 35.7705 34.5397C36.2721 34.2446 36.6877 33.8232 36.976 33.3175C37.2642 32.8119 37.415 32.2395 37.4134 31.6575C37.4117 31.0755 37.2577 30.504 36.9667 30L22.85 6.43331C22.5529 5.94349 22.1345 5.53851 21.6353 5.25745C21.1361 4.97639 20.5729 4.82874 20 4.82874C19.4271 4.82874 18.8639 4.97639 18.3647 5.25745C17.8655 5.53851 17.4471 5.94349 17.15 6.43331V6.43331Z"
      stroke="black"
      strokeWidth="3.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 15V21.6667"
      stroke="black"
      strokeWidth="3.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 28.3333H20.0167"
      stroke="black"
      strokeWidth="3.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgContainer>
);

export default AlertTriangle;
