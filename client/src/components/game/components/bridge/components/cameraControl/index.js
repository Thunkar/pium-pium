import { CenterFocusStrong, Map, QueryStats } from '@mui/icons-material';
import { ToggleButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    CAMERA_MODES,
    selectCameraMode,
    setCameraMode,
} from '../../../../../../reducers/playerReducer.js';
import * as SC from './index.styles.js';

export function CameraControl() {
    const dispatch = useDispatch();
    const cameraMode = useSelector(selectCameraMode);
    const onCenterClicked = () => {
        dispatch(
            setCameraMode(
                cameraMode !== CAMERA_MODES.FOLLOW
                    ? CAMERA_MODES.FOLLOW
                    : CAMERA_MODES.FREE
            )
        );
    };
    const onMapClicked = () => {
        dispatch(
            setCameraMode(
                cameraMode !== CAMERA_MODES.MAP
                    ? CAMERA_MODES.MAP
                    : CAMERA_MODES.FREE
            )
        );
    };
    return (
        <SC.Container>
            <SC.ToggleCameraButton
                value="check"
                onChange={onCenterClicked}
                selected={cameraMode === CAMERA_MODES.FOLLOW}
            >
                <CenterFocusStrong />
            </SC.ToggleCameraButton>
            <SC.ToggleCameraButton
                value="check"
                onChange={onMapClicked}
                selected={cameraMode === CAMERA_MODES.MAP}
            >
                <Map />
            </SC.ToggleCameraButton>
        </SC.Container>
    );
}

export default CameraControl;
