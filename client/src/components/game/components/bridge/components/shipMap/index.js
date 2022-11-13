import { useState } from 'react';
import { CircularMenu } from './components/circularMenu/index.js';
import * as SC from './index.styles.js';
import { Thrusters, ManeuveringThrusters } from 'pium-pium-engine';

export function ShipMap() {
    const [toggledMenus, setToggledMenus] = useState(0);

    const countToggledMenus = (menuState) => {
        setToggledMenus(menuState ? toggledMenus + 1 : toggledMenus - 1);
    };

    return (
        <SC.Container>
            <SC.ShipImage src="assets/ship.png"></SC.ShipImage>
            <SC.AftTrapezoid></SC.AftTrapezoid>
            <SC.PortTrapezoid></SC.PortTrapezoid>
            <SC.ForwardTrapezoid></SC.ForwardTrapezoid>
            <SC.StarboardTrapezoid></SC.StarboardTrapezoid>
            {toggledMenus > 0 && <SC.Overlay></SC.Overlay>}
            <SC.Aft>
                <CircularMenu
                    onMenuToggled={countToggledMenus}
                    {...Thrusters}
                ></CircularMenu>
            </SC.Aft>
            <SC.Port></SC.Port>
            <SC.Forward>
                <CircularMenu
                    onMenuToggled={countToggledMenus}
                    {...Thrusters}
                ></CircularMenu>
                <CircularMenu
                    onMenuToggled={countToggledMenus}
                    {...ManeuveringThrusters}
                ></CircularMenu>
            </SC.Forward>
            <SC.Starboard></SC.Starboard>
        </SC.Container>
    );
}
