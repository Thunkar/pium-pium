import { useLayoutEffect, forwardRef, useCallback, useState } from 'react';
import { Vector3 } from 'three';

export default forwardRef(function Line(props, ref) {
    const { start, end, color } = props;
    const [localRef, setLocalRef] = useState(null);
    const setRef = useCallback((el) => {
        if (!el) return;
        setLocalRef(el);
        if (ref) ref(el);
    }, []);
    useLayoutEffect(() => {
        if (localRef) {
            localRef.geometry.setFromPoints(
                [start, end].map((point) => new Vector3(...point))
            );
        }
    }, [start, end, localRef]);
    return (
        <line ref={setRef}>
            <bufferGeometry />
            <lineBasicMaterial
                attach="material"
                color={color}
                toneMapped={false}
            />
        </line>
    );
});
