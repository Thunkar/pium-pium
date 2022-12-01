import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    align-items: center;
`;

export const ReactorCore = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    aspect-ratio: 1/1;
    background: radial-gradient(
        circle,
        rgba(2, 0, 36, 1) 0%,
        rgba(9, 9, 121, 1) 50%,
        rgba(0, 198, 255, 1) 70%
    );
    border-radius: 50%;
`;

export const Energy = styled.div`
    display: flex;
    font-size: 5em;
`;
