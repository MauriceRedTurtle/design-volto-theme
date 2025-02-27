/**
 * Navigation components.
 * @module components/theme/Navigation/Navigation
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  Header,
  HeaderContent,
  HeaderToggler,
  Nav,
} from 'design-react-kit/dist/design-react-kit';

import { flattenToAppURL } from '@plone/volto/helpers';

import { Collapse } from '@italia/components';
import {
  MegaMenu,
  MenuSecondary,
  Logo,
  Icon,
  SocialHeader,
  BrandText,
} from '@italia/components/ItaliaTheme';

import {
  getDropdownMenuNavitems,
  getItemsByPath,
} from '@italia/addons/volto-dropdownmenu';

const Navigation = ({ pathname }) => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const dispatch = useDispatch();
  const subsite = useSelector((state) => state.subsite?.data);

  const items = useSelector((state) => state.dropdownMenuNavItems?.result);
  useEffect(() => {
    dispatch(getDropdownMenuNavitems());
  }, [dispatch]);

  const menu = getItemsByPath(items, pathname);

  const getAnchorTarget = (nodeElement) => {
    if (nodeElement.nodeName === 'A') {
      return nodeElement;
    } else if (nodeElement.parentElement?.nodeName === 'A') {
      return nodeElement.parentElement;
    } else {
      return null;
    }
  };

  useEffect(() => {
    const blocksClickListener = (e) => {
      const menuLinks = [
        ...(document?.querySelectorAll(
          '.menu-wrapper a:not([aria-haspopup])',
        ) ?? []),
      ];

      if (
        menuLinks?.length === 0 ||
        menuLinks?.indexOf(getAnchorTarget(e.target)) < 0
      ) {
        return;
      }

      setCollapseOpen(false);
    };

    document.body.addEventListener('click', blocksClickListener);

    return () =>
      document.body.removeEventListener('click', blocksClickListener);
  }, []);

  return (
    <Header theme="" type="navbar">
      {menu?.length > 0 ? (
        <HeaderContent expand="lg" megamenu id="navigation">
          <HeaderToggler
            aria-controls="#it-navigation-collapse"
            aria-expanded={collapseOpen}
            aria-label="Toggle navigation"
            onClick={() => setCollapseOpen(!collapseOpen)}
          >
            <Icon icon="it-burger" />
          </HeaderToggler>
          <Collapse
            header
            isOpen={collapseOpen}
            navbar
            onOverlayClick={() => setCollapseOpen(!collapseOpen)}
            id="it-navigation-collapse"
          >
            <div className="menu-wrapper">
              <div className="it-brand-wrapper" role="navigation">
                <Link
                  to={subsite?.['@id'] ? flattenToAppURL(subsite['@id']) : '/'}
                >
                  <Logo />
                  <BrandText mobile={true} subsite={subsite} />
                </Link>
              </div>
              <Nav navbar>
                {menu
                  ?.filter((item) => item.visible)
                  ?.map((item, index) => (
                    <MegaMenu
                      item={item}
                      pathname={pathname}
                      key={index + 'mm'}
                    />
                  ))}
              </Nav>

              <MenuSecondary pathname={pathname} />

              <SocialHeader />
            </div>
          </Collapse>
        </HeaderContent>
      ) : null}
    </Header>
  );
};

Navigation.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export default Navigation;
