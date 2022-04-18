import React, { useState, useEffect, useCallback, Fragment } from "react";
import tw from "twin.macro";
import "styled-components/macro";
import logo from "images/logo-icon-light.png";
import { FiMenu, FiX } from "react-icons/fi";
import { GoMarkGithub } from "react-icons/go";
import { Link } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { NavLink, MobileNavLink, ExternalLink } from "./NavLinks";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

const UserActions = tw.div`xl:(flex items-center)`;

export const MainNavbar = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  function toggleMenu() {
    setOpen(!open);
  }

  const handleScroll = useCallback(() => {
    if (window.scrollY >= 80) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const DesktopLinks = () => (
    <div className="xl:flex">
      <NavLink scrolled={scrolled} key="/" to="/">
        {t("menu.home")}
      </NavLink>
      <NavLink scrolled={scrolled} key="downloads" to="/downloads">
        {t("menu.downloads")}
      </NavLink>
      <ExternalLink
        onClick={() => toggleMenu()}
        key="developers"
        href="https://developers.smswithoutborders.com"
        target="_blank"
      >
        {t("menu.developers")}
      </ExternalLink>
      <NavLink scrolled={scrolled} key="privacy-policy" to="/privacy-policy">
        {t("menu.privacy")}
      </NavLink>
      <NavLink scrolled={scrolled} key="contact-us" to="/contact-us">
        {t("menu.contact")}
      </NavLink>
    </div>
  );

  const ActionLinks = () => (
    <UserActions>
      <ExternalLink
        key="Github"
        href="https://github.com/orgs/smswithoutborders/"
        target="_blank"
      >
        <GoMarkGithub size={20} />
        <span className="ml-2">GitHub</span>
      </ExternalLink>
      <NavLink scrolled={scrolled} open={open} key="login" to="/login">
        <span className="ml-2">{t("menu.login")}</span>
      </NavLink>
      <NavLink
        key="sign-up"
        to="/sign-up"
        className="text-white bg-blue-800 xl:px-6 xl:py-2 xl:mr-4 xl:rounded-3xl"
      >
        <span className="ml-2">{t("menu.signup")}</span>
      </NavLink>
    </UserActions>
  );

  const MobileLinks = () => (
    <div className="xl:flex">
      <MobileNavLink
        scrolled={scrolled}
        onClick={() => toggleMenu()}
        key="/"
        to="/"
      >
        {t("menu.home")}
      </MobileNavLink>
      <MobileNavLink
        scrolled={scrolled}
        onClick={() => toggleMenu()}
        key="downloads"
        to="/downloads"
      >
        {t("menu.downloads")}
      </MobileNavLink>
      <ExternalLink
        onClick={() => toggleMenu()}
        key="developers"
        href="https://developers.smswithoutborders.com"
        target="_blank"
      >
        {t("menu.developers")}
      </ExternalLink>
      <MobileNavLink
        scrolled={scrolled}
        onClick={() => toggleMenu()}
        key="privacy-policy"
        to="/privacy-policy"
      >
        {t("menu.privacy")}
      </MobileNavLink>
      <MobileNavLink
        scrolled={scrolled}
        onClick={() => toggleMenu()}
        key="contact-us"
        to="/contact-us"
      >
        {t("menu.contact")}
      </MobileNavLink>

      <ExternalLink
        onClick={() => toggleMenu()}
        key="Github"
        href="https://github.com/orgs/smswithoutborders/"
        target="_blank"
      >
        <GoMarkGithub size={20} />
        <span className="ml-2">GitHub</span>
      </ExternalLink>
      <MobileNavLink
        scrolled={scrolled}
        open={open}
        key="login"
        to="/login"
        onClick={() => toggleMenu()}
      >
        <span className="ml-2">{t("menu.login")}</span>
      </MobileNavLink>
      <MobileNavLink
        key="sign-up"
        to="/sign-up"
        onClick={() => toggleMenu()}
        className="text-white bg-blue-800 xl:px-6 xl:py-2 xl:mr-4 xl:rounded-3xl"
      >
        <span className="ml-2">{t("menu.signup")}</span>
      </MobileNavLink>
    </div>
  );

  const Logo = () => (
    <Link to="/" className="flex items-center text-xl font-bold xl:ml-4">
      <img src={logo} alt="logo" className="w-8 h-8 mr-3" />
      <span>SMSWithoutBorders</span>
    </Link>
  );

  return (
    <Fragment>
      <div
        className={clsx(
          "hidden sticky top-0 z-50 xl:flex justify-between items-center",
          scrolled ? "bg-white shadow-lg" : "text-white bg-transparent"
        )}
      >
        <Logo />
        <DesktopLinks />
        <ActionLinks />
      </div>
      <div className="sticky top-0 z-50 bg-white shadow-lg xl:hidden">
        <div className="flex items-center justify-between p-4">
          <Logo />
          <button className="appearance-none" onClick={() => toggleMenu()}>
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {open && (
          <Transition
            show={open}
            appear={true}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="flex flex-col w-full h-screen bg-white"
          >
            <MobileLinks />
          </Transition>
        )}
      </div>
    </Fragment>
  );
};
