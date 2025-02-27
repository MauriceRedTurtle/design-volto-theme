import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'design-react-kit/dist/design-react-kit';
import { UniversalLink } from '@plone/volto/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import { ListingLinkMore } from '@italia/components/ItaliaTheme';

const SquaresImageTemplate = ({
  items,
  title,
  show_block_bg,
  isEditMode,
  linkTitle,
  linkHref,
}) => {
  return (
    <div className="squares-image-template">
      <Container className="px-4">
        <div className="title">{title && <h2>{title}</h2>}</div>
        <div className="grid mb-3 mt-5">
          {items.map((item, index) => {
            let image = item?.image || item?.immagine_testata;
            return (
              <UniversalLink
                item={!isEditMode ? item : null}
                href={isEditMode ? '#' : null}
                style={{
                  backgroundImage: `url(${flattenToAppURL(
                    image?.scales?.preview?.download || '',
                  )})`,
                }}
                className="listing-item box bg-img"
                key={index}
              >
                <span className="title font-weight-bold">{item?.title}</span>
              </UniversalLink>
            );
          })}
        </div>

        <ListingLinkMore title={linkTitle} href={linkHref} className="my-4" />
      </Container>
    </div>
  );
};

SquaresImageTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  isEditMode: PropTypes.bool,
  linkTitle: PropTypes.any,
  linkHrefs: PropTypes.any,
};

export default SquaresImageTemplate;
