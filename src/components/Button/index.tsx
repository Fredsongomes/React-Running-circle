import type {ComponentProps, ReactNode} from 'react'
import {NavLink, type NavLinkProps} from 'react-router'
import styles from './Button.module.css'

type BaseProps = {
    variant?: 'primary' | 'outline',
    icon?: ReactNode,
    children?: ReactNode,
    to?: string
}

type ButtonAsButton = BaseProps &
    Omit<ComponentProps<'button'>, 'children'> & {
    to?: never
}

type ButtonAsLink = BaseProps & Omit<NavLinkProps, 'children' | 'className'>

type ButtonProps = ButtonAsButton | ButtonAsLink

function Button(props: ButtonProps) {
    if (props.to !== undefined) {
        const {children, icon, variant = 'primary', ...rest} = props
        return (
            <NavLink className={`${styles.button} ${styles[variant]}`} {...rest}>
                {children}
                {icon}
            </NavLink>
        )
    }

    const {
        children,
        icon,
        variant = 'primary',
        type = 'button',
        ...rest
    } = props
    return (
        <button
            className={`${styles.button} ${styles[variant]}`}
            type={type}
            {...rest}
        >
            {children}
            {icon}
        </button>
    )
}

export default Button
