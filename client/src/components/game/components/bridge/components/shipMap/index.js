import { useState } from 'react';
import { ActionsMenu } from './components/actionsMenu/index.js';
import * as SC from './index.styles.js';
import { Thrusters, ManeuveringThrusters, Missiles } from 'pium-pium-engine';

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
                    disabled={toggledMenus > 0}
                ></ActionsMenu>
            </SC.Aft>
            <SC.Port>
                <ActionsMenu
                    onMenuToggled={countToggledMenus}
                    component={Missiles}
                    status={ship?.thrusters.aft}
                    horizontal
                    disabled={toggledMenus > 0}
                ></ActionsMenu>
            </SC.Port>
            <SC.Forward>
                <ActionsMenu
                    onMenuToggled={countToggledMenus}
                    component={Thrusters}
                    status={ship?.thrusters.retro}
                    disabled={toggledMenus > 0}
                ></ActionsMenu>
                <ActionsMenu
                    onMenuToggled={countToggledMenus}
                    component={ManeuveringThrusters}
                    status={ship?.thrusters.maneuvering}
                    submenuRadius={5.5}
                    disabled={toggledMenus > 0}
                ></ActionsMenu>
            </SC.Forward>
            <SC.Starboard></SC.Starboard>
        </SC.Container>
    );
}
