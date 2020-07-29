import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from 'design-react-kit/dist/design-react-kit';
import { flattenToAppURL } from '@plone/volto/helpers';
import cx from 'classnames';

const ArgumentListingTemplateReggio = ({ items, isEditMode, linkMore }) => {
  return (
    <div
      className={cx('arguments-reggio', {
        'public-ui': isEditMode,
      })}
    >
      <div className="container mb-3">
        {items.map((item, index) => (
          <div
            style={{backgroundImage: `url(${flattenToAppURL(item?.image?.scales?.preview?.download || '')})`}}
            className={cx('listing-item box')}
            key={index}
            onClick={() => window.open(item['@id'], '_self')}
          >
             <span className="text font-weight-bold">
                {item?.title}
              </span>
          </div>
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

ArgumentListingTemplateReggio.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  isEditMode: PropTypes.bool,
  linkMore: PropTypes.any,
};

export default ArgumentListingTemplateReggio;
