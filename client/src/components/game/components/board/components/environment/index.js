import { Circle } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { GodRays, Outline, SelectiveBloom } from '@react-three/postprocessing';
import { BlendFunction, KernelSize, Resizer } from 'postprocessing';
import { memo, forwardRef } from 'react';
import { TextureLoader, BackSide } from 'three';

let skyboxImage = 'milky_way';

function createPathStrings(filename) {
    const basePath = `assets/skyboxes/${filename}/`;
    const baseFilename = basePath + filename;
    const fileType = '.png';
    const sides = ['ft', 'bk', 'up', 'dn', 'rt', 'lf'];
    const pathStings = sides.map((side) => {
        return baseFilename + '_' + side + fileType;
    });

    return pathStings;
}

export const Sun = memo(
    forwardRef(function Sun(props, forwardRef) {
        return (
            <Circle
                args={[30, 30]}
                ref={forwardRef}
                position={[0, 50, 500]}
                rotation-y={Math.PI}
            >
                <meshBasicMaterial color="lightblue" />
            </Circle>
        );
    })
);

export const MemoizedGodRays = memo(function MemoizedGodRays({ sun }) {
    return (
        <GodRays
            sun={sun}
            blendFunction={BlendFunction.Screen}
            samples={60}
            density={0.96}
            decay={0.9}
            weight={0.4}
            exposure={0.6}
            clampMax={1}
            width={Resizer.AUTO_SIZE}
            height={Resizer.AUTO_SIZE}
            kernelSize={KernelSize.SMALL}
            blur={true}
        />
    );
});

export const MemoizedSelectiveBloom = memo(function MemoizedSelectiveBloom({
    lights,
    geometries,
}) {
    return (
        <SelectiveBloom
            lights={lights}
            selection={geometries}
            selectionLayer={1}
            intensity={3}
            luminanceThreshold={0.75}
            luminanceSmoothing={0.025}
            blurPass={null}
            kernelSize={KernelSize.LARGE}
        />
    );
});

export const MemoizedOutline = memo(function MemoizedOutline({ geometries }) {
    return (
        <Outline
            selection={geometries} // selection of objects that will be outlined
            selectionLayer={1} // selection layer
            blendFunction={BlendFunction.SCREEN} // set this to BlendFunction.ALPHA for dark outlines
            patternTexture={null} // a pattern texture
            edgeStrength={10} // the edge strength
            pulseSpeed={0.0} // a pulse speed. A value of zero disables the pulse effect
            visibleEdgeColor={0xffffff} // the color of visible edges
            hiddenEdgeColor={0x22090a} // the color of hidden edges
            width={Resizer.AUTO_SIZE} // render width
            height={Resizer.AUTO_SIZE} // render height
            kernelSize={KernelSize.LARGE} // blur kernel size
            blur={false} // whether the outline should be blurred
            xRay={true} // indicates whether X-Ray outlines are enabled
        />
    );
});

export const MemoizedSkyBox = memo(function SkyBox() {
    const materialArray = [];
    if (materialArray.length === 0) {
        const skyboxImagePaths = createPathStrings(skyboxImage);
        skyboxImagePaths.forEach((image) =>
            materialArray.push(useLoader(TextureLoader, image))
        );
    }
    return (
        <mesh>
            <boxGeometry
                args={[2000, 2000, 2000]}
                attach={'geometry'}
            ></boxGeometry>
            {materialArray.map((texture, index) => (
                <meshBasicMaterial
                    attach={`material-${index}`}
                    key={texture.id}
                    map={texture}
                    side={BackSide}
                ></meshBasicMaterial>
            ))}
        </mesh>
    );
});
