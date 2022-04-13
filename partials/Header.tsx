import React, { FunctionComponent, useState, useEffect } from "react";
import Image from 'next/image';
import { useRouter } from 'next/router';

// assets
import logo from '../public/logo.png';

// helpers
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export const Header: FunctionComponent = () => {
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
                            <a href="https://longform.watchdog.team/about-us" className="navLink">CONTACT US</a>
                            <a href="https://longform.watchdog.team/about-us" className="navLink">ABOUT US</a>
                        </div>
                    </div>
                </header>
            </div>
      </>
    )
}