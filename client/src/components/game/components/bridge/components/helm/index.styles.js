import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    align-items: center;
`;

export const NavigationChart = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    aspect-ratio: 1/1;
    background: radial-gradient(
        circle,
        rgb(0 0 0) 0%,
        rgb(0 0 0) 50%,
        rgb(40 40 40) 70%
    );
    border-radius: 50%;
`;
