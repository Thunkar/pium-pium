import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as SC from './index.styles';
import { Stars, OrbitControls, Plane } from '@react-three/drei';

function Box(props) {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef();
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false);
    const [clicked, click] = useState(false);
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (ref.current.rotation.x += 0.01));
    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={ref}
            scale={clicked ? 1.5 : 1}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    );
}

export function Board() {
    return (
        <SC.Container>
            <Canvas>
                <Stars saturation={0} />
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Box position={[-1.2, 0, 0]} />
                <Box position={[1.2, 0, 0]} />
                <Plane rotation-x={Math.PI / 2} args={[200, 200, 100, 100]}>
                    <meshBasicMaterial color="darkgrey" wireframe />
                </Plane>
                <OrbitControls></OrbitControls>
            </Canvas>
        </SC.Container>
    );
}
