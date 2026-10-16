import React from "react";

export const Heading = ({ title, subtitle }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 text-center mb-8 md:mb-10">
      <h2 className="section-title">
        {title}
      </h2>

      {subtitle && (
        <p className="section-subtitle">
          {subtitle}
        </p>
      )}
    </div>
  );
};
