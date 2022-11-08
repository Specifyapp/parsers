import React from 'react';
import tw, { styled } from 'twin.macro';

const SvgContainer = styled.svg`
  ${tw`fill-current`}
  ${({ color }) => (color != null ? `color: ${color};` : null)}
`;

const Activity: React.FC<Client.SVG.SvgProps> = ({ width, height, className, color }) => (
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
      d="M36.6667 20H30L25 35L15 5L10 20H3.33334"
      stroke="black"
      strokeWidth="3.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgContainer>
);

export default Activity;
