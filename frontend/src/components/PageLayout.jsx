/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { useIsAuthenticated } from "@azure/msal-react";
import { AppBar } from "@mui/material";
import React from "react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props
 */
export const PageLayout = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();

  PageLayout.propTypes = {
    children: React.ReactNode,
  };

  return (
    <>
      <AppBar bg="primary" variant="dark" className="navbarStyle">
        <a className="navbar-brand" href="/">
          Microsoft Identity Platform
        </a>
        <div className="collapse navbar-collapse justify-content-end">
          {isAuthenticated ? <SignOutButton /> : <SignInButton />}
        </div>
      </AppBar>
      <h5>
        <center>
          Welcome to the Microsoft Authentication Library For Javascript - React
          Quickstart
        </center>
      </h5>
      <br />
      <br />
      {children}
    </>
  );
};
