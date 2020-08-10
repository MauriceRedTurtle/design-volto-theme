import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, useIntl } from 'react-intl';
import {
  Card,
  CardBody,
  CardTitle,
  Icon,
  Button,
} from 'design-react-kit/dist/design-react-kit';
import { flattenToAppURL } from '@plone/volto/helpers';

import { Link } from 'react-router-dom';
import cx from 'classnames';

const messages = defineMessages({
  view_all: {
    id: 'Vedi tutto',
    defaultMessage: 'Vedi tutto',
  },
});
const ArgumentListingTemplate = ({ items, isEditMode, linkMore }) => {
  const intl = useIntl();
  return (
    <div
      className={cx('arguments', {
        'public-ui': isEditMode,
      })}
    >
      <div className="card-wrapper card-teaser-wrapper card-teaser-wrapper-equal card-teaser-block-3 mb-3">
        {items.map((item, index) => (
          <Card
            className="align-items-center rounded shadow"
            noWrapper
            teaser
            key={index}
          >
            {item.icon && <Icon icon={item.icon} />}
            <CardBody>
              <CardTitle tag="h5">
                <Link
                  to={!isEditMode ? flattenToAppURL(item['@id']) : '#'}
                  condition={!isEditMode}
                >
                  {item.title || item.id}
                </Link>
              </CardTitle>
            </CardBody>
          </Card>
        ))}
      </div>
      {linkMore?.href && (
        <div className="link-button">
          <Button
            className="view-all"
            icon={false}
            tag="button"
            onClick={() => window.open(linkMore.href, '_self')}
          >
            {linkMore.title || intl.formatMessage(messages.view_all)}
          </Button>
        </div>
      )}
    </div>
  );
};

ArgumentListingTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  isEditMode: PropTypes.bool,
  linkMore: PropTypes.any,
};

export default ArgumentListingTemplate;
