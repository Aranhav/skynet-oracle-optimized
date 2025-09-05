import type { Schema, Attribute } from '@strapi/strapi';

export interface AddressAddresses extends Schema.Component {
  collectionName: 'components_address_addresses';
  info: {
    displayName: 'addresses';
    icon: 'alien';
  };
  attributes: {
    type: Attribute.String;
    address: Attribute.Text;
  };
}

export interface ContactContact extends Schema.Component {
  collectionName: 'components_contact_contacts';
  info: {
    displayName: 'contact';
    icon: 'car';
  };
  attributes: {
    phone: Attribute.String;
    email: Attribute.Email;
    address: Attribute.Text;
    workingHours: Attribute.String;
  };
}

export interface CoordinatesCoordinates extends Schema.Component {
  collectionName: 'components_coordinates_coordinates';
  info: {
    displayName: 'coordinates';
    icon: 'attachment';
  };
  attributes: {
    lat: Attribute.Decimal;
    lng: Attribute.Decimal;
  };
}

export interface LegalTextSection extends Schema.Component {
  collectionName: 'components_legal_text_sections';
  info: {
    displayName: 'Text Section';
    icon: 'attachment';
  };
  attributes: {
    heading: Attribute.String & Attribute.Required;
    content: Attribute.RichText & Attribute.Required;
  };
}

export interface ServiceServiceHighlight extends Schema.Component {
  collectionName: 'components_service_service_highlights';
  info: {
    displayName: 'Service Highlight';
    icon: 'star';
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    description: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    icon: Attribute.Enumeration<
      [
        'Clock',
        'Globe',
        'Shield',
        'Plane',
        'Truck',
        'Package',
        'MapPin',
        'Zap',
        'Heart',
        'Compass',
        'IndianRupee',
        'CheckCircle',
        'Star',
        'Award',
        'Headphones'
      ]
    >;
  };
}

export interface SocialMediaSocialMedia extends Schema.Component {
  collectionName: 'components_social_media_social_medias';
  info: {
    displayName: 'socialMedia';
    icon: 'briefcase';
  };
  attributes: {
    facebook: Attribute.String;
    twitter: Attribute.String;
    instagram: Attribute.String;
    linkedin: Attribute.String;
    youtube: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'address.addresses': AddressAddresses;
      'contact.contact': ContactContact;
      'coordinates.coordinates': CoordinatesCoordinates;
      'legal.text-section': LegalTextSection;
      'service.service-highlight': ServiceServiceHighlight;
      'social-media.social-media': SocialMediaSocialMedia;
    }
  }
}
