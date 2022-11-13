import { useGLTF, Billboard, Text } from '@react-three/drei';

export default function Ship(props) {
    const { nodes, materials } = useGLTF('assets/ship.gltf');
    return (
        <>
            <Billboard
                follow={true}
                lockX={false}
                lockY={false}
                lockZ={false}
                rotation={[Math.PI / 2, 0, 0]}
                position={[
                    props.position[0],
                    props.position[1] + 1,
                    props.position[2],
                ]}
            >
                <Text fontSize={0.3}>{props.name}</Text>
            </Billboard>
            <group {...props} dispose={null}>
                <mesh
                    geometry={nodes['Corvette-F3'].geometry}
                    material={materials['SF_Corvette_F3.001']}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.001}
                />
            </group>
        </>
    );
}

useGLTF.preload('assets/ship.gltf');
