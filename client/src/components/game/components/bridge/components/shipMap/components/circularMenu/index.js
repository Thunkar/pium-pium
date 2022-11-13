import { useState, useRef } from 'react';
import { CircleMenu, CircleMenuItem } from 'react-circular-menu';
import { IconButton, Icon } from '@mui/material';
import { Clear } from '@mui/icons-material';
import * as SC from './index.styles.js';

export const CircularMenu = ({ name, abilities, onMenuToggled }) => {
    const [isOpen, setIsOpen] = useState(false);

    const customIcon = (icon) => (
        <SC.CustomIcon>
            <img style={{ height: '100%' }} src={`assets/${icon}.png`} />
        </SC.CustomIcon>
    );
    return (
        <CircleMenu
            startAngle={-90}
            rotationAngle={360}
            itemSize={0.1}
            radius={abilities.length > 2 ? 6 : 3}
            rotationAngleInclusive={false}
            menuToggleElement={
                <IconButton>
                    {isOpen ? <Clear></Clear> : customIcon(name)}
                </IconButton>
            }
            style={{ transition: 'unset' }}
            onMenuToggle={(open) => {
                setIsOpen(open);
                onMenuToggled(open);
            }}
        >
            {abilities?.map((ability, index) => (
                <CircleMenuItem key={`ability-${index}`}>
                    <SC.Ability>
                        {ability.costs?.map((cost, index) => (
                            <SC.CostContainer key={`cost-${index}`}>
                                {cost.value}&nbsp;
                                {customIcon(cost.type)}
                            </SC.CostContainer>
                        ))}
                        <SC.TextContainer>{ability.text}</SC.TextContainer>
                        {ability.effects?.or?.map((or, index) => (
                            <SC.CostContainer key={`effect-${index}`}>
                                {or.value}&nbsp;
                                {customIcon(or.name)}
                            </SC.CostContainer>
                        ))}
                    </SC.Ability>
                </CircleMenuItem>
            ))}
        </CircleMenu>
    );
};
