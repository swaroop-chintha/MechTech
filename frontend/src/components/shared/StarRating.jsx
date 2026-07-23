import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';

const StarRating = ({ rating = 0, max = 5, size = 'sm', interactive = false, onChange }) => {
  const [hoverRating, setHoverRating] = useState(null);
  const sizeMap = {
    sm: 14,
    md: 20,
    lg: 28
  };
  const iconSize = sizeMap[size] || 14;

  const handleMouseEnter = (index) => {
    if (interactive) setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (interactive) setHoverRating(null);
  };

  const handleClick = (index) => {
    if (interactive && onChange) {
      onChange(index);
    }
  };

  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {Array.from({ length: max }, (_, idx) => {
        const starValue = idx + 1;

        // Determine which icon and fill to render
        let isHalf = false;
        let isFilled = false;

        if (activeRating >= starValue) {
          isFilled = true;
        } else if (activeRating >= starValue - 0.5) {
          isHalf = true;
        }

        const commonProps = {
          size: iconSize,
          style: { 
            cursor: interactive ? 'pointer' : 'default', 
            transition: 'color 0.15s, transform 0.15s' 
          },
          onMouseEnter: () => handleMouseEnter(starValue),
          onMouseLeave: handleMouseLeave,
          onClick: () => handleClick(starValue),
          color: isFilled || isHalf ? '#f59e0b' : 'rgba(255, 255, 255, 0.2)'
        };

        if (isFilled) {
          return <Star key={idx} fill="#f59e0b" {...commonProps} />;
        } else if (isHalf) {
          return <StarHalf key={idx} fill="#f59e0b" {...commonProps} />;
        } else {
          return <Star key={idx} fill="none" {...commonProps} />;
        }
      })}
    </div>
  );
};

export default StarRating;
