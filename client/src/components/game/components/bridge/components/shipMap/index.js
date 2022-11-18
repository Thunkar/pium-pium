import { useState } from 'react';
import { ActionsMenu } from './components/actionsMenu/index.js';
import * as SC from './index.styles.js';
import { Thrusters, ManeuveringThrusters } from 'pium-pium-engine';

export function ShipMap() {
    const [toggledMenus, setToggledMenus] = useState(0);

    const countToggledMenus = (menuState) => {
        const valueToAdd = menuState ? +1 : -1;
        const result =
            toggledMenus + valueToAdd > 0 ? toggledMenus + valueToAdd : 0;
        setToggledMenus(result);
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
                <ActionsMenu
                    onMenuToggled={countToggledMenus}
                    {...Thrusters}
                ></ActionsMenu>
            </SC.Aft>
            <SC.Port></SC.Port>
            <SC.Forward>
                <ActionsMenu
                    onMenuToggled={countToggledMenus}
                    {...Thrusters}
                ></ActionsMenu>
                <ActionsMenu
                    onMenuToggled={countToggledMenus}
                    {...ManeuveringThrusters}
                ></ActionsMenu>
            </SC.Forward>
            <SC.Starboard></SC.Starboard>
        </SC.Container>
    );
}
