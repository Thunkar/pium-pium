import * as SC from './index.styles';
import { Clear } from '@mui/icons-material';

const IncludedIcons = {
    clear: Clear,
};

export const CustomIcon = function ({ icon }) {
    const IncludedIcon = IncludedIcons[icon];
    const FunctionalMaterialIcon = () => {
        return <IncludedIcon></IncludedIcon>;
    };
    const PNGIcon = () => (
        <SC.CustomIcon>
            <img style={{ height: '100%' }} src={`assets/icons/${icon}.png`} />
        </SC.CustomIcon>
    );
    return IncludedIcon ? FunctionalMaterialIcon() : PNGIcon();
};
