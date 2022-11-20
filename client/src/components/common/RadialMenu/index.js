import * as SC from './index.styles';
import { useState, Children, useEffect } from 'react';
import { CustomIcon } from '../CustomIcon';

export const RadialMenu = function ({
    openIcon,
    closedIcon,
    children,
    customToggle,
    startAngle = -90,
    rotationAngle = 360,
    radius = 5,
    onMenuToggled,
}) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => onMenuToggled(isOpen), [isOpen]);
    return (
        <SC.Wrapper>
            <SC.Toggle onClick={() => setIsOpen(!isOpen)}>
                {!customToggle ? (
                    <SC.IconButton>
                        <CustomIcon
                            icon={isOpen ? openIcon : closedIcon}
                        ></CustomIcon>
                    </SC.IconButton>
                ) : (
                    customToggle
                )}
            </SC.Toggle>
            <SC.ChildrenContainer>
                {Children.toArray(children).map((child, index) => {
                    let angle = startAngle;
                    let increment = 0;
                    if (children.length > 1) {
                        increment = Math.round(rotationAngle / children.length);
                    }
                    angle += index * increment;
                    return (
                        <SC.RadialChild
                            key={`radial-child-${index}`}
                            angle={(angle * Math.PI) / 180}
                            radius={radius}
                            isOpen={isOpen}
                        >
                            {child}
                        </SC.RadialChild>
                    );
                })}
            </SC.ChildrenContainer>
        </SC.Wrapper>
    );
};
