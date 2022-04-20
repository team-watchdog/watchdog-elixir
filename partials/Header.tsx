import React, { FunctionComponent, useState, useEffect } from "react";
import Image from 'next/image';
import { useRouter } from 'next/router';

// assets
import logo from '../public/logo.png';

// types
import { Account } from "../shared/types";

// helpers
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

interface HeaderProps{
    account: Account | null;
}

export const Header: FunctionComponent<HeaderProps> = ({ account }: HeaderProps) => {
    const router = useRouter();
    const path = router.pathname;

    return (
        <>
            <div className="sticky top-0 z-50">
                <header id="header" className="">
                    <div className="container">
                        <a href="/" id="logo">
                            <Image src={logo} layout="responsive" /> 
                        </a>
                        <div className="right-nav hidden md:flex">
                            <a href="/" className={`navLink${path === "/" ? " active" : ""}`}>REQUESTS</a>
                            {account ? <a href="/drugs" className={`navLink${path === "/drugs" ? " active" : ""}`}>DRUGS</a> : null}
                            {account ? <a href="/equipments" className={`navLink${path === "/equipments" ? " active" : ""}`}>EQUIPMENT</a> : null}
                            {account && account.type === "ADMIN" ? <a href="/accounts" className={`navLink${path === "/accounts" ? " active" : ""}`}>ACCOUNTS</a> : null}
                            <a href="https://longform.watchdog.team/about-us" className="navLink">ABOUT US</a>
                            {account ? <a href="/auth/signout" className="navLink font-bold">SIGN OUT</a> : <a href="/auth/signin" className="navLink font-bold">SIGN IN</a>}
                        </div>
                    </div>
                </header>
            </div>
      </>
    )
}