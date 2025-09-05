module.exports = ({ env }) => ({
  // Local file upload configuration
  upload: {
    config: {
      providerOptions: {
        localServer: {
          maxage: 300000
        },
      },
      sizeLimit: 250 * 1024 * 1024, // 250MB max file size
      breakpoints: {
        xlarge: 1920,
        large: 1280,
        medium: 750,
        small: 500,
        xsmall: 320
      }
    },
  },
});