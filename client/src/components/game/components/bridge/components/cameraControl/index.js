import { CenterFocusStrong, Map, QueryStats } from '@mui/icons-material';
import * as SC from './index.styles.js';

export function CameraControl() {
    return (
        <SC.Container>
            <SC.CameraButton>
                <CenterFocusStrong />
            </SC.CameraButton>
            <SC.CameraButton>
                <Map />
            </SC.CameraButton>
            <SC.CameraButton>
                <QueryStats />
            </SC.CameraButton>
        </SC.Container>
    );
}

export default CameraControl;
