import React from "react";

function NavTabIconImg({ src, className = "" }) {
  return (
    <img
      className={`nav_tab_img ${className}`.trim()}
      src={src}
      alt=""
      aria-hidden="true"
    />
  );
}

export function IconTourSearch() {
  return <NavTabIconImg src="/assets/icon-img/new-search2.png" />;
}

export function IconAirTickets() {
  return (
    <NavTabIconImg
      src="/assets/icon-img/new-plane2.png"
      className="nav_tab_img_air"
    />
  );
}

export function IconHotels() {
  return <NavTabIconImg src="/assets/icon-img/hotel-new.jpg" />;
}

export function IconAuthorTours() {
  return <NavTabIconImg src="/assets/icon-img/tour-new.jpg" />;
}

export function IconHotTours() {
  return <NavTabIconImg src="/assets/icon-img/tour-new.jpg" />;
}

export function IconInsurance() {
  return <NavTabIconImg src="/assets/icon-img/strah-new.jpg" />;
}

function renderShortLabel(shortLabel) {
  if (!shortLabel) return null;

  const parts = shortLabel.split("|");
  if (parts.length > 1) {
    return parts.map((part, index) => (
      <React.Fragment key={part}>
        {index > 0 && <br />}
        {part}
      </React.Fragment>
    ));
  }

  return shortLabel;
}

export function NavTabItem({ active, onClick, icon: Icon, label, shortLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`nav_link ${active ? "active" : ""}`}
      aria-label={label}
      title={label}
    >
      <span className="nav_link_icon">
        <Icon />
      </span>
      <span className="nav_link_label nav_link_label_desktop">{label}</span>
      <span className="nav_link_label nav_link_label_mobile">
        {renderShortLabel(shortLabel || label)}
      </span>
    </button>
  );
}
