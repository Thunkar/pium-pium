import { Fragment, useState } from 'react';
import { ActionsMenu } from './components/actionsMenu/index.js';
import * as SC from './index.styles.js';
import {
    Parts,
    powerManagementRequestAction,
    abilityTriggerRequestAction,
    ventHeatRequestAction,
} from 'pium-pium-engine';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { selectPlayerId } from '../../../../../../reducers/playerReducer.js';

export function ShipMap({ ship }) {
    const [toggledMenus, setToggledMenus] = useState(0);
    const dispatch = useDispatch();

    const playerId = useSelector(selectPlayerId);
    const notMyShip = ship?.playerId !== playerId;

    const countToggledMenus = (menuState) => {
        const valueToAdd = menuState ? +1 : -1;
        const result =
            toggledMenus + valueToAdd > 0 ? toggledMenus + valueToAdd : 0;
        setToggledMenus(result);
    };

    const onPowerRequest = function (subsystem, value) {
        dispatch(
            powerManagementRequestAction({ subsystem, shipId: ship.id, value })
        );
    };

    const onVentHeatRequest = function (subsystem, value) {
        dispatch(
            ventHeatRequestAction({
                subsystem,
                shipId: ship.id,
                value,
            })
        );
    };

    const onAbilityTriggered = function (subsystem, abilityIndex, effectIndex) {
        const isTargeted = dispatch(
            abilityTriggerRequestAction({
                subsystem,
                shipId: ship.id,
                abilityIndex,
                effectIndex,
            })
        );
    };

    return (
        <SC.Container>
            <SC.Stats>
                <SC.Stat>
                    <Typography variant="p">Reactor</Typography>
                    <SC.Reactor>
                        <Typography variant="p">
                            {ship?.reactor.current}/{ship?.reactor.total}
                        </Typography>
                    </SC.Reactor>
                </SC.Stat>
                <SC.Stat>
                    <Typography variant="p">Vent</Typography>
                    <SC.Vent>
                        <Typography variant="p">
                            {ship?.reactor.vented}/{ship?.reactor.maxVent}
                        </Typography>
                    </SC.Vent>
                </SC.Stat>
                <SC.Break />
                <SC.Stat>
                    <Typography variant="p">Hull</Typography>
                    <SC.Hull>
                        <Typography variant="p">{ship?.hull}</Typography>
                    </SC.Hull>
                </SC.Stat>
                <SC.Stat>
                    <Typography variant="p">Heat</Typography>
                    <SC.Heat>
                        <Typography variant="p">
                            {ship?.reactor.heat}
                        </Typography>
                    </SC.Heat>
                </SC.Stat>
            </SC.Stats>
            <SC.Systems>
                <SC.ShipImage src="assets/ship.png"></SC.ShipImage>
                <SC.AftTrapezoid></SC.AftTrapezoid>
                <SC.ForwardTrapezoid></SC.ForwardTrapezoid>
                <SC.PortTrapezoid></SC.PortTrapezoid>
                <SC.StarboardTrapezoid></SC.StarboardTrapezoid>
                {toggledMenus > 0 && <SC.Overlay></SC.Overlay>}
                <SC.Aft>
                    {ship?.aft.map((subsystem, index) => (
                        <Fragment key={subsystem.name}>
                            <ActionsMenu
                                onMenuToggled={countToggledMenus}
                                component={Parts[subsystem.type]}
                                reactor={ship.reactor}
                                status={ship.aft[index].status}
                                disabled={toggledMenus > 0}
                                readonly={notMyShip}
                                onPowerRequest={(value) =>
                                    onPowerRequest(`aft[${index}]`, value)
                                }
                                onVentHeatRequest={(value) =>
                                    onVentHeatRequest(`aft[${index}]`, value)
                                }
                                onAbilityTriggered={(
                                    abilityIndex,
                                    effectIndex
                                ) =>
                                    onAbilityTriggered(
                                        `aft[${index}]`,
                                        abilityIndex,
                                        effectIndex
                                    )
                                }
                            ></ActionsMenu>
                            {index !== ship?.aft.length - 1 && (
                                <SC.VerticalDivider
                                    visible={!toggledMenus}
                                ></SC.VerticalDivider>
                            )}
                        </Fragment>
                    ))}
                </SC.Aft>
                <SC.Port>
                    {ship?.port.map((subsystem, index) => (
                        <Fragment key={subsystem.name}>
                            <ActionsMenu
                                key={subsystem.name}
                                onMenuToggled={countToggledMenus}
                                component={Parts[subsystem.type]}
                                reactor={ship.reactor}
                                status={ship.port[index].status}
                                disabled={toggledMenus > 0}
                                readonly={notMyShip}
                                onPowerRequest={(value) =>
                                    onPowerRequest(`port[${index}]`, value)
                                }
                                onVentHeatRequest={(value) =>
                                    onVentHeatRequest(`port[${index}]`, value)
                                }
                                onAbilityTriggered={(
                                    abilityIndex,
                                    effectIndex
                                ) =>
                                    onAbilityTriggered(
                                        `port[${index}]`,
                                        abilityIndex,
                                        effectIndex
                                    )
                                }
                                horizontal
                            ></ActionsMenu>
                            {index !== ship?.port.length - 1 && (
                                <SC.HorizontalDivider
                                    visible={!toggledMenus}
                                ></SC.HorizontalDivider>
                            )}
                        </Fragment>
                    ))}
                </SC.Port>
                <SC.Forward>
                    {ship?.forward.map((subsystem, index) => (
                        <Fragment key={subsystem.name}>
                            <ActionsMenu
                                onMenuToggled={countToggledMenus}
                                component={Parts[subsystem.type]}
                                reactor={ship.reactor}
                                status={ship.forward[index].status}
                                disabled={toggledMenus > 0}
                                readonly={notMyShip}
                                onPowerRequest={(value) =>
                                    onPowerRequest(`forward[${index}]`, value)
                                }
                                onVentHeatRequest={(value) =>
                                    onVentHeatRequest(
                                        `forward[${index}]`,
                                        value
                                    )
                                }
                                onAbilityTriggered={(
                                    abilityIndex,
                                    effectIndex
                                ) =>
                                    onAbilityTriggered(
                                        `forward[${index}]`,
                                        abilityIndex,
                                        effectIndex
                                    )
                                }
                            ></ActionsMenu>
                            {index !== ship?.forward.length - 1 && (
                                <SC.VerticalDivider
                                    visible={!toggledMenus}
                                ></SC.VerticalDivider>
                            )}
                        </Fragment>
                    ))}
                </SC.Forward>
                <SC.Starboard>
                    {ship?.starboard.map((subsystem, index) => (
                        <Fragment key={subsystem.name}>
                            <ActionsMenu
                                onMenuToggled={countToggledMenus}
                                component={Parts[subsystem.type]}
                                reactor={ship.reactor}
                                status={ship.starboard[index].status}
                                disabled={toggledMenus > 0}
                                readonly={notMyShip}
                                onPowerRequest={(value) =>
                                    onPowerRequest(`starboard[${index}]`, value)
                                }
                                onVentHeatRequest={(value) =>
                                    onVentHeatRequest(
                                        `starboard[${index}]`,
                                        value
                                    )
                                }
                                onAbilityTriggered={(
                                    abilityIndex,
                                    effectIndex
                                ) =>
                                    onAbilityTriggered(
                                        `starboard[${index}]`,
                                        abilityIndex,
                                        effectIndex
                                    )
                                }
                                horizontal
                            ></ActionsMenu>
                            {index !== ship?.starboard.length - 1 && (
                                <SC.HorizontalDivider
                                    visible={!toggledMenus}
                                ></SC.HorizontalDivider>
                            )}
                        </Fragment>
                    ))}
                </SC.Starboard>
            </SC.Systems>
        </SC.Container>
    );
}
