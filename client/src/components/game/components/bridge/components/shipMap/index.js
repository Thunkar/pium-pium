import { useState } from 'react';
import { ActionsMenu } from './components/actionsMenu/index.js';
import * as SC from './index.styles.js';
import { Thrusters, ManeuveringThrusters } from 'pium-pium-engine';

export function ShipMap({ ship }) {
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
                    component={Thrusters}
                    status={ship?.thrusters.aft}
                ></ActionsMenu>
            </SC.Aft>
            <SC.Port></SC.Port>
            <SC.Forward>
                <ActionsMenu
                    onMenuToggled={countToggledMenus}
                    component={Thrusters}
                    status={ship?.thrusters.retro}
                ></ActionsMenu>
                <ActionsMenu
                    onMenuToggled={countToggledMenus}
                    component={ManeuveringThrusters}
                    status={ship?.thrusters.maneuvering}
                    submenuRadius={4}
                ></ActionsMenu>
            </SC.Forward>
            <SC.Starboard></SC.Starboard>
        </SC.Container>
    );
}
