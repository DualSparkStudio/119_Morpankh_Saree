# Images Directory

This directory contains all static images for the application.

## Structure

- `banners/` - Hero carousel banner images
  - `banner-1.jpg` through `banner-5.jpg`

- `categories/` - Category icons/images
  - `silk.jpg`
  - `cotton.jpg`
  - `designer.jpg`
  - `printed.jpg`
  - `dress.jpg`
  - `traditional.jpg`
  - `modern.jpg`
  - `bridal.jpg`

- `products/` - Product images
  - `product-1.jpg` through `product-20.jpg` (main product images)
  - `product-{id}-{number}.jpg` (product detail gallery images, e.g., `product-1-1.jpg`, `product-1-2.jpg`)

## Image Requirements

- **Banners**: Recommended size 1920x1080px or 1920x700px
- **Categories**: Recommended size 300x300px (circular images work best)
- **Products**: Recommended size 600x800px (3:4 aspect ratio)

## Fallback

If images are not found, the application will automatically fall back to placeholder images with the product/category name.

